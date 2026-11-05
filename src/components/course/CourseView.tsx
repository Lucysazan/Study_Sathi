'use client';

import { startTransition, useEffect } from 'react';
import { recordCourseView } from '@/app/learn/courses/views';

export function CourseView({ courseId }: { courseId: string }) {
  useEffect(() => {
    startTransition(async () => {
      await recordCourseView(courseId);
    });
  }, [courseId]);
  return null;
}
