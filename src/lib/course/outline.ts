import { z } from 'zod';
import { courseModuleSchema, type CourseOutline } from './draft';

// Accept the array shape written by older editor versions without rewriting live data.
export function readCourseOutline(value: unknown): CourseOutline | null {
  const schema = z.object({ modules: z.array(courseModuleSchema).max(12) });
  const parsed = schema.safeParse(Array.isArray(value) ? { modules: value } : value);
  return parsed.success ? parsed.data : null;
}
