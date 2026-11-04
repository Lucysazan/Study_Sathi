/**
 * Non-secret server config that pages may render (e.g. passed to a Client Component).
 * Read directly instead of through getServerEnv(), so static pages build without admin credentials.
 */
export function studentLoginDomain(): string {
  return (process.env.STUDENT_LOGIN_DOMAIN?.trim() || 'students.studysathi.local').toLowerCase();
}
