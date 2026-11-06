import { getCurrentUser } from '@/lib/auth/session';
import { sameOrigin } from '@/lib/http/same-origin';
import { gradePractice, savedPractice, submissionSchema } from '@/lib/academic/practice';
import { writeAcademicProgress } from '@/lib/academic/progress.server';

export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store' };
  try {
    if (!sameOrigin(request))
      return Response.json({ error: 'Not allowed.' }, { status: 403, headers });
    const body = await request.text();
    if (body.length > 8000)
      return Response.json({ error: 'Please submit one practice set.' }, { status: 413, headers });
    const parsed = submissionSchema.safeParse(JSON.parse(body));
    if (!parsed.success)
      return Response.json({ error: 'Please check your answers.' }, { status: 400, headers });
    const user = await getCurrentUser();
    const uid = user?.role === 'student' ? user.uid : null;
    if (parsed.data.expectedUid !== uid)
      return Response.json(
        { error: 'Your account changed. Reload before checking your answers.' },
        { status: 409, headers },
      );
    let result;
    try {
      result = gradePractice(parsed.data);
    } catch {
      return Response.json(
        { error: 'Answer every question in this practice set.' },
        { status: 400, headers },
      );
    }
    let saved = false;
    if (uid) {
      try {
        await writeAcademicProgress(uid, savedPractice(result, new Date()));
        saved = true;
      } catch {
        /* Return the learning feedback even if persistence is unavailable. */
      }
    }
    return Response.json(
      {
        result,
        saved,
        saveMessage: saved
          ? 'Saved to your student account.'
          : uid
            ? 'Your result could not be saved. Retry checking to save it.'
            : 'Visit-only practice. Sign in as a student to save future results.',
      },
      { headers },
    );
  } catch {
    return Response.json(
      { error: 'Practice could not be checked. Please try again.' },
      { status: 400, headers },
    );
  }
}
