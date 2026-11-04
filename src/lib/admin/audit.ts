import { FieldValue, type Firestore, type Timestamp } from 'firebase-admin/firestore';

/** Admin/creator actions are recorded in `auditLog` (server-only collection). */
export type AuditAction =
  | 'role.set'
  | 'user.disable'
  | 'user.enable'
  | 'resource.create'
  | 'resource.update'
  | 'resource.delete';

export async function writeAudit(
  db: Firestore,
  entry: { actorUid: string; action: AuditAction; target: string; summary?: string },
): Promise<void> {
  await db.collection('auditLog').add({ ...entry, at: FieldValue.serverTimestamp() });
}

export type AuditEntry = {
  id: string;
  actorUid: string;
  action: string;
  target: string;
  summary: string | null;
  at: Date | null;
};

export async function recentAudit(db: Firestore, limit = 8): Promise<AuditEntry[]> {
  const snap = await db.collection('auditLog').orderBy('at', 'desc').limit(limit).get();
  return snap.docs.map((d) => {
    const at = d.get('at') as Timestamp | undefined;
    const summary: unknown = d.get('summary');
    return {
      id: d.id,
      actorUid: String(d.get('actorUid') ?? ''),
      action: String(d.get('action') ?? ''),
      target: String(d.get('target') ?? ''),
      summary: typeof summary === 'string' ? summary : null,
      at: at?.toDate() ?? null,
    };
  });
}
