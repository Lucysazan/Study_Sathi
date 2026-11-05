import type { Metadata } from 'next';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { Suspense } from 'react';
import { PortalHeader } from '@/components/admin/PortalHeader';
import { PortalLoading } from '@/components/portal/PortalShell';
import { getCourseForAdmin } from '@/lib/admin/courses';
import { CourseReviewDetail } from './CourseReviewDetail';

export const metadata: Metadata = { title: 'Course review detail · Admin', robots: { index: false } };

async function AdminCourseDetailBody({ params }: PageProps<'/admin/courses/[id]'>) {
  const { id } = await params;
  const course = await getCourseForAdmin(id);
  if (!course) notFound();

  return (
    <>
      <PortalHeader
        eyebrow="COURSE REVIEW"
        title={`Review “${course.title}”`}
        intro="Check the course outline, leave notes for the creator, and update the status when it is ready."
      />

      <div className="portal-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <Link href="/admin/courses" className="button secondary" aria-label="Back to course review queue">
          <ArrowLeft size={18} aria-hidden="true" />
          Back to queue
        </Link>
      </div>

      <CourseReviewDetail course={course} />
    </>
  );
}

export async function AdminCourseDetailPage(props: PageProps<'/admin/courses/[id]'>) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <AdminCourseDetailBody {...props} />
    </Suspense>
  );
}

export default function AdminCourseDetailRoute(props: PageProps<'/admin/courses/[id]'>) {
  return <AdminCourseDetailPage {...props} />;
}
