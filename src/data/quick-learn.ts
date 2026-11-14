import 'server-only';
import entries from './quick-learn.json';
import { approvedVideos, quickVideoSchema } from '@/lib/quick-learn/catalog';
// Fail a release with malformed/duplicate records instead of silently hiding editorial errors.
const checked = entries.map((entry) => quickVideoSchema.parse(entry));
if (new Set(checked.map((v) => v.videoId)).size !== checked.length)
  throw Error('Duplicate Quick Learn video IDs');
export const quickVideos = approvedVideos(checked);
