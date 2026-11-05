'use client';

import Image from 'next/image';
import { useState } from 'react';
import { safeMediaUrl } from '@/lib/course/media';

export function CourseCover({ src, alt }: { src: string; alt: string }) {
  const url = safeMediaUrl(src);
  return url ? <CoverImage key={url} src={url} alt={alt} /> : null;
}
function CoverImage({ src, alt }: { src: string; alt: string }) {
  const [failed, setFailed] = useState(false);
  return failed ? (
    <p>Cover image unavailable.</p>
  ) : (
    <Image
      className="course-cover"
      src={src}
      alt={alt}
      width={960}
      height={540}
      unoptimized
      onError={() => setFailed(true)}
    />
  );
}
