import { getCurrentUser } from '@/lib/auth/session';
import { readAcademicProgress } from '@/lib/academic/progress.server';

export async function GET() {
  const headers = { 'Cache-Control': 'private, no-store' };
  const user = await getCurrentUser();
  if (user?.role !== 'student') return Response.json({ uid: null, results: {} }, { headers });
  try {
    return Response.json(
      { uid: user.uid, results: await readAcademicProgress(user.uid) },
      { headers },
    );
  } catch {
    return Response.json(
      { error: 'Saved practice is unavailable. Reload to try again.' },
      { status: 503, headers },
    );
  }
}
