import { completeSignup } from '@/lib/auth/setup';
import { sameOrigin } from '@/lib/http/same-origin';

/** Token-verified account setup returns JSON, independently of the RSC/action manifest. */
export async function POST(request: Request) {
  const headers = { 'Cache-Control': 'no-store' };
  if (!sameOrigin(request))
    return Response.json({ ok: false, error: 'Not allowed.' }, { status: 403, headers });
  const result = await completeSignup(await request.json().catch(() => null));
  return Response.json(result, { status: result.ok ? 200 : 400, headers });
}
