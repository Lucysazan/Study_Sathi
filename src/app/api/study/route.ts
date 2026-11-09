import { getCurrentUser } from '@/lib/auth/session';
import { sameOrigin } from '@/lib/http/same-origin';
import { gradeStudy, studySubmission } from '@/lib/study/checks';
import { readStudyProgress, saveStudyProgress } from '@/lib/study/progress.server';
const headers = { 'Cache-Control': 'private, no-store' };
export async function GET() {
  try {
    const user = await getCurrentUser();
    if (user?.role !== 'student') return Response.json({ uid: null, results: {} }, { headers });
    return Response.json(
      { uid: user.uid, results: await readStudyProgress(user.uid) },
      { headers },
    );
  } catch {
    return Response.json(
      { error: 'Saved activity could not be loaded. Reload to try again.' },
      { status: 503, headers },
    );
  }
}
export async function POST(request: Request) {
  try {
    if (!sameOrigin(request))
      return Response.json({ error: 'Not allowed.' }, { status: 403, headers });
    const body = await request.text();
    if (body.length > 8000)
      return Response.json({ error: 'Submit one activity.' }, { status: 413, headers });
    const input = studySubmission.safeParse(JSON.parse(body));
    if (!input.success)
      return Response.json(
        { error: 'Please check the submitted answers.' },
        { status: 400, headers },
      );
    const user = await getCurrentUser(),
      uid = user?.role === 'student' ? user.uid : null;
    if (uid !== input.data.expectedUid)
      return Response.json(
        { error: 'Your account changed. Reload before checking.' },
        { status: 409, headers },
      );
    const result = gradeStudy(input.data);
    let saved = false,
      reward = { xpAwarded: 0, newBadges: [] as string[] };
    if (uid) {
      try {
        reward = await saveStudyProgress(uid, result);
        saved = true;
      } catch {
        return Response.json(
          {
            result,
            saved: false,
            reward,
            message:
              'Your check was graded, but progress and rewards could not be saved. Retry to save.',
          },
          { headers },
        );
      }
    }
    return Response.json(
      {
        result,
        saved,
        reward,
        message: !uid
          ? 'Visit-only practice. Sign in as a student to save progress and earn rewards.'
          : result.correct === result.total
            ? reward.xpAwarded
              ? `Saved. +${reward.xpAwarded} XP. Your first completed learning check counts toward your streak and badges.`
              : 'Saved. This learning check was already rewarded.'
            : 'Saved. Review the explanations and try again. No XP for this attempt.',
      },
      { headers },
    );
  } catch {
    return Response.json(
      { error: 'Please answer every question in this activity.' },
      { status: 400, headers },
    );
  }
}
