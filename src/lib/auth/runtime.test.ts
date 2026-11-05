import { execFileSync } from 'node:child_process';
import { expect, it } from 'vitest';

it('loads Firebase auth and resolves an RSA signing key without require(ESM)', () => {
  // Mirrors the production failure mode that a regular modern Node process hides.
  const script = `
    const assert = require('node:assert/strict');
    const { generateKeyPairSync, sign, verify } = require('node:crypto');
    require('firebase-admin/auth');
    const jwks = require('jwks-rsa');
    const { publicKey, privateKey } = generateKeyPairSync('rsa', { modulusLength: 2048 });
    const key = { ...publicKey.export({ format: 'jwk' }), kid: 'runtime-test', use: 'sig', alg: 'RS256' };
    const client = jwks({ jwksUri: 'https://example.invalid/keys', cache: false, fetcher: async () => ({ keys: [key] }) });
    (async () => {
      const [resolved] = await client.getSigningKeys();
      assert.equal(resolved.kid, 'runtime-test');
      const payload = Buffer.from('runtime-compatibility-probe');
      assert.ok(verify('RSA-SHA256', payload, resolved.getPublicKey(), sign('RSA-SHA256', payload, privateKey)));
      console.log('auth-runtime-ok');
    })().catch(error => { console.error(error.message); process.exitCode = 1; });
  `;
  const output = execFileSync(
    process.execPath,
    ['--no-experimental-require-module', '-e', script],
    {
      encoding: 'utf8',
      timeout: 15_000,
    },
  );
  expect(output.trim()).toBe('auth-runtime-ok');
});
