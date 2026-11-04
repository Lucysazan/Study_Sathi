import 'server-only';
import { FieldValue } from 'firebase-admin/firestore';
import { isRole, type Role } from '@/lib/auth/roles';
import { studentLoginDomain } from '@/lib/env/public-config';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { writeAudit } from './audit';
import { requireAdmin } from './guard';

export type AdminUserRow = {
  uid: string;
  name: string;
  /** Email for adults, username for students (their email is synthetic). */
  login: string;
  role: Role | null;
  disabled: boolean;
  wantsToCreate: boolean;
  createdAt: string;
};

const MAX_USERS = 1000;

/**
 * Users for the admin list, newest first, creator applicants on top. Reads Firebase Auth
 * (no Firestore cost) plus one small query for applicants. Search matches name, login or role.
 * v1 limit: the first 1,000 accounts (add paging when StudySathi grows past that).
 */
export async function listUsersForAdmin(
  query: string,
): Promise<{ users: AdminUserRow[]; total: number; capped: boolean }> {
  await requireAdmin();
  const [page, applicants] = await Promise.all([
    adminAuth().listUsers(MAX_USERS),
    adminDb().collection('users').where('requestedRole', '==', 'creator').select().get(),
  ]);
  const applicantIds = new Set(applicants.docs.map((d) => d.id));
  const studentSuffix = `@${studentLoginDomain()}`;

  const rows: AdminUserRow[] = page.users.map((u) => {
    const role: unknown = u.customClaims?.role;
    const email = u.email ?? '';
    return {
      uid: u.uid,
      name: u.displayName ?? '',
      login: email.endsWith(studentSuffix) ? email.slice(0, -studentSuffix.length) : email,
      role: isRole(role) ? role : null,
      disabled: u.disabled,
      wantsToCreate: applicantIds.has(u.uid),
      createdAt: u.metadata.creationTime,
    };
  });

  const q = query.trim().toLowerCase();
  const filtered = q
    ? rows.filter((r) =>
        [r.name, r.login, r.role ?? 'no role'].some((v) => v.toLowerCase().includes(q)),
      )
    : rows;
  filtered.sort(
    (a, b) =>
      Number(b.wantsToCreate) - Number(a.wantsToCreate) ||
      Date.parse(b.createdAt) - Date.parse(a.createdAt),
  );
  return { users: filtered, total: rows.length, capped: Boolean(page.pageToken) };
}

/** Turn an account off or on. Disabling also signs the user out everywhere. */
export async function setDisabled(uid: string, disabled: boolean, actorUid: string): Promise<void> {
  const auth = adminAuth();
  const db = adminDb();
  const user = await auth.updateUser(uid, { disabled });
  if (disabled) await auth.revokeRefreshTokens(uid);
  await db
    .collection('users')
    .doc(uid)
    .set(
      { status: disabled ? 'disabled' : 'active', updatedAt: FieldValue.serverTimestamp() },
      { merge: true },
    );
  await writeAudit(db, {
    actorUid,
    action: disabled ? 'user.disable' : 'user.enable',
    target: uid,
    summary: user.displayName ?? user.email ?? uid,
  });
}

export async function countPendingCreators(): Promise<number> {
  await requireAdmin();
  const snap = await adminDb()
    .collection('users')
    .where('requestedRole', '==', 'creator')
    .count()
    .get();
  return snap.data().count;
}
