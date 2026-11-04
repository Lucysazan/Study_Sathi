/**
 * Give an existing user a role (used once to create the first admin).
 *
 *   npm run set-role -- you@example.com admin            # emulators (.env.local)
 *   npm run set-role -- you@example.com admin --prod     # real project (needs admin credentials)
 *
 * The user must sign up first. They are signed out everywhere so the new role applies at
 * their next login.
 */
import { assignRole } from '../src/lib/auth/accounts';
import { isRole, roles } from '../src/lib/auth/roles';
import { fail, initScriptAdmin } from './lib/admin';

async function main() {
  const args = process.argv.slice(2);
  const [email, role] = args.filter((a) => !a.startsWith('--'));
  if (!email || !role) fail('Usage: npm run set-role -- <email> <role> [--prod]');
  if (!isRole(role)) fail(`Role must be one of: ${roles.join(', ')}`);

  const { auth, db, target } = initScriptAdmin(args.includes('--prod'));
  const user = await auth.getUserByEmail(email.trim().toLowerCase()).catch(() => null);
  if (!user) fail(`No account found for ${email}. Ask them to sign up first.`);

  await assignRole(auth, db, user.uid, role, 'script:set-role');
  console.log(
    `\n✔ ${email} is now "${role}" on ${target}.` +
      '\n  They have been signed out; the new role applies when they log in again.\n',
  );
}

main().catch((error: unknown) => fail(error instanceof Error ? error.message : String(error)));
