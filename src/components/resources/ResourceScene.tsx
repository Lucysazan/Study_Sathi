/** Original generated storybook artwork, shared as a compact six-scene sheet. */
export function ResourceScene({ category, resourceId }: { category: string; resourceId?: string }) {
  const variants: Record<string, number> = {
    'Life Skills': 3,
    'Digital Safety': 1,
    'Financial Literacy': 5,
    Environment: 4,
    'Learning Games': 5,
  };
  const scene =
    resourceId === 'english-adventure'
      ? 2
      : resourceId === 'maths-world'
        ? 5
        : (variants[category] ?? (Number(resourceId || 0) % 3 || 0));
  const x = (scene % 3) * 512,
    y = Math.floor(scene / 3) * 512;
  return (
    <div className="resource-scene storybook-art" aria-hidden="true">
      <svg viewBox={`${x} ${y} 512 512`} preserveAspectRatio="xMidYMid slice">
        <image href="/images/learning-worlds-v1.webp" width="1536" height="1024" />
      </svg>
    </div>
  );
}
