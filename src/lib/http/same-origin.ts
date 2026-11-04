function normalizeHost(hostname: string): string {
  const normalized = hostname.toLowerCase();
  if (normalized === '0.0.0.0' || normalized === '::' || normalized === '[::]') {
    return 'localhost';
  }
  if (normalized === '::1' || normalized === '[::1]') {
    return 'localhost';
  }
  return normalized;
}

export function sameOrigin(request: Request): boolean {
  const originHeader = request.headers.get('origin');
  if (!originHeader) return false;

  const origin = new URL(originHeader);
  const requestUrl = new URL(request.url);

  return (
    origin.protocol === requestUrl.protocol &&
    origin.port === requestUrl.port &&
    normalizeHost(origin.hostname) === normalizeHost(requestUrl.hostname)
  );
}
