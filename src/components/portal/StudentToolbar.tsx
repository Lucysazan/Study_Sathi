import Link from 'next/link';
import { getStudentIdentity } from '@/lib/gamification/account';
import { avatarGlyphs } from '@/lib/avatars';
import { SignOutButton } from '@/components/auth/SignOutButton';

export async function StudentToolbar() {
  const student = await getStudentIdentity();
  return (
    <div
      className="site-container portal-actions"
      aria-label="Learning account"
      style={{ flexWrap: 'wrap' }}
    >
      <Link href="/learn">My learning</Link>
      <span>
        {student.xp} XP · Level {student.level}
      </span>
      <Link href="/learn/profile">
        <span aria-hidden="true">{avatarGlyphs[student.avatarId] ?? avatarGlyphs.leaf}</span>{' '}
        {student.nickname}: edit profile
      </Link>
      <Link href="/saved">Saved resources</Link>
      <SignOutButton />
    </div>
  );
}
