import 'server-only';
import { getAdminLearningMetrics } from '@/lib/analytics/courses';
import { adminAuth, adminDb } from '@/lib/firebase/admin';
import { type AuditEntry, recentAudit } from './audit';
import { countPendingCourseReviews } from './courses';
import { requireAdmin } from './guard';
import { countPendingCreators } from './users';

/** Numbers and recent activity for the admin overview. Admin only. */
export async function getAdminOverview(): Promise<{
  adminName: string | null;
  resourceCount: number;
  accountCount: string;
  pendingCreators: number;
  pendingCourseReviews: number;
  activity: AuditEntry[];
  learning: Awaited<ReturnType<typeof getAdminLearningMetrics>>;
}> {
  const admin = await requireAdmin();
  const db = adminDb();
  const [resources, users, pendingCreators, pendingCourseReviews, activity, learning] =
    await Promise.all([
      db.collection('resources').count().get(),
      adminAuth().listUsers(1000),
      countPendingCreators(),
      countPendingCourseReviews(),
      recentAudit(db),
      getAdminLearningMetrics(),
    ]);
  return {
    adminName: admin.name,
    resourceCount: resources.data().count,
    accountCount: `${users.users.length}${users.pageToken ? '+' : ''}`,
    pendingCreators,
    pendingCourseReviews,
    activity,
    learning,
  };
}
