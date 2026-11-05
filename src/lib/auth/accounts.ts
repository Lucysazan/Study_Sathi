import { syncLeaderboardEntries } from '@/lib/gamification/entries';
import type { Auth } from 'firebase-admin/auth';
import { FieldValue, type Firestore } from 'firebase-admin/firestore';
import { writeAudit } from '@/lib/admin/audit';
import { isRole, type Role } from './roles';

/**
 * Trusted account writes. Takes the admin SDK instances as arguments (no `server-only` import)
 * so both server actions and CLI scripts (scripts/set-role.ts) can use it.
 * Roles live in the `role` custom claim and are mirrored on users/{uid} (ARCHITECTURE §1).
 */

export type AccountType = 'parent' | 'creator';

/** Current role from the user's custom claims, or null. */
export async function getClaimRole(auth: Auth, uid: string): Promise<Role | null> {
  const user = await auth.getUser(uid);
  const role: unknown = user.customClaims?.role;
  return isRole(role) ? role : null;
}

/**
 * First-time setup for a self sign-up. Parents get the `parent` role straight away.
 * Creator applicants get no role: an admin approves them later (Phase 4), so they can't reach
 * the creator portal yet. Idempotent: an account that already has a role or a user doc is left
 * unchanged.
 */
export async function setUpAccount(
  auth: Auth,
  db: Firestore,
  uid: string,
  input: { accountType: AccountType; displayName: string },
): Promise<{ role: Role | null; created: boolean }> {
  const existingRole = await getClaimRole(auth, uid);
  const ref = db.collection('users').doc(uid);

  const created = await db.runTransaction(async (tx) => {
    const snap = await tx.get(ref);
    if (snap.exists || existingRole) return false;
    tx.create(ref, {
      role: input.accountType === 'parent' ? 'parent' : null,
      requestedRole: input.accountType === 'creator' ? 'creator' : null,
      displayName: input.displayName,
      status: 'active',
      createdAt: FieldValue.serverTimestamp(),
      ...(input.accountType === 'parent' ? { childUids: [] } : {}),
    });
    return true;
  });

  if (!created) return { role: existingRole, created: false };

  await auth.updateUser(uid, { displayName: input.displayName });
  if (input.accountType === 'parent') {
    await auth.setCustomUserClaims(uid, { role: 'parent' });
    return { role: 'parent', created: true };
  }
  return { role: null, created: true };
}

/**
 * Give a user a role (admin action or scripts/set-role.ts). Updates the claim and the user doc,
 * writes an audit entry, and revokes refresh tokens so the new role applies on next sign-in.
 */
export async function assignRole(
  auth: Auth,
  db: Firestore,
  uid: string,
  role: Role,
  actor: string,
): Promise<void> {
  const user = await auth.getUser(uid);
  await auth.setCustomUserClaims(uid, { ...(user.customClaims ?? {}), role });
  const batch = db.batch();
  batch.set(
    db.collection('users').doc(uid),
    {
      role,
      requestedRole: null,
      displayName: user.displayName ?? null,
      status: 'active',
      leaderboardOptIn: false,
      updatedAt: FieldValue.serverTimestamp(),
    },
    { merge: true },
  );
  syncLeaderboardEntries(batch, db, uid, null, false, new Date());
  await batch.commit();
  await writeAudit(db, {
    actorUid: actor,
    action: 'role.set',
    target: uid,
    summary: `Role set to ${role}`,
  });
  await auth.revokeRefreshTokens(uid);
}
