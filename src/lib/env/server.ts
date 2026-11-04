import 'server-only';
import { parseServerEnv, type ServerEnv } from './schema';

let cached: ServerEnv | undefined;

/** Server-only config (admin credentials, cookie name, student login domain). */
export function getServerEnv(): ServerEnv {
  cached ??= parseServerEnv(process.env);
  return cached;
}
