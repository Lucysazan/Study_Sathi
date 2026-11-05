import { CourseCover } from '@/components/course/CourseCover';
import { courseCategories } from '@/lib/course/draft';
import type { Metadata } from 'next';
import Link from 'next/link';
import { Suspense } from 'react';
import { PortalLoading } from '@/components/portal/PortalShell';
import { adminDb } from '@/lib/firebase/admin';
import { requireRole } from '@/lib/auth/session';

export const metadata: Metadata = { title: 'Course catalog', robots: { index: false } };

const validCategories = courseCategories;

export type CourseCatalogItem = {
  id: string;
  title: string;
  summary: string;
  category: string;
  ageRange: string;
  budget: string;
  status: 'published';
  updatedAt: string | null;
  language: string;
  coverImageUrl: string;
  coverAlt: string;
};

async function listPublishedCourses(category?: string, age?: string): Promise<CourseCatalogItem[]> {
  await requireRole(['student'], '/learn/courses');

  let query = adminDb().collection('courses').where('status', '==', 'published');

  if (category && validCategories.includes(category as (typeof validCategories)[number])) {
    query = query.where('category', '==', category);
  }

  const snap = await query.orderBy('updatedAt', 'desc').get();

  return snap.docs
    .map((doc) => ({
      id: doc.id,
      title: String(doc.get('title') ?? 'Untitled course'),
      summary: String(doc.get('summary') ?? 'No summary yet.'),
      category: String(doc.get('category') ?? 'digital-skills'),
      ageRange: String(doc.get('ageRange') ?? 'All ages'),
      budget: String(doc.get('budget') ?? 'Flexible'),
      status: 'published' as const,
      language: typeof doc.get('language') === 'string' ? doc.get('language') : '',
      coverImageUrl: typeof doc.get('coverImageUrl') === 'string' ? doc.get('coverImageUrl') : '',
      coverAlt: typeof doc.get('coverAlt') === 'string' ? doc.get('coverAlt') : '',
      updatedAt: doc.get('updatedAt')?.toDate ? doc.get('updatedAt').toDate().toISOString() : null,
    }))
    .filter((course) => {
      if (!age) return true;
      return (
        course.ageRange.toLowerCase().includes(age.toLowerCase()) ||
        course.ageRange.toLowerCase() === 'all ages'
      );
    })
    .sort((a, b) => {
      const aTime = a.updatedAt ? Date.parse(a.updatedAt) : 0;
      const bTime = b.updatedAt ? Date.parse(b.updatedAt) : 0;
      return bTime - aTime;
    });
}

async function LearnCoursesBody({ searchParams }: PageProps<'/learn/courses'>) {
  const [params, courses] = await Promise.all([searchParams, listPublishedCourses()]);
  const selectedCategory = typeof params.category === 'string' ? params.category : '';
  const selectedAge = typeof params.age === 'string' ? params.age : '';

  const filteredCourses =
    selectedCategory || selectedAge
      ? await listPublishedCourses(selectedCategory, selectedAge)
      : courses;

  return (
    <section className="site-container section portal-welcome">
      <div className="eyebrow">COURSE CATALOG</div>
      <h1 className="detail-title">Published courses</h1>
      <p className="page-intro" style={{ marginBottom: '1.25rem' }}>
        Explore the newest learning experiences available to students.
      </p>

      <div className="portal-actions" style={{ justifyContent: 'flex-start', flexWrap: 'wrap' }}>
        <Link href="/learn" className="button secondary">
          Back to learning hub
        </Link>
      </div>

      <div className="module-card" style={{ padding: '1rem 1.25rem', marginTop: '1.25rem' }}>
        <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <Link
            href="/learn/courses"
            className={selectedCategory || selectedAge ? 'button secondary' : 'button primary'}
          >
            All courses
          </Link>
          {validCategories.map((value) => (
            <Link
              key={value}
              href={`/learn/courses?category=${encodeURIComponent(value)}`}
              className={selectedCategory === value ? 'button primary' : 'button secondary'}
            >
              {value.replace('-', ' ')}
            </Link>
          ))}
        </div>
      </div>

      {filteredCourses.length === 0 ? (
        <div className="notice" style={{ marginTop: '1.25rem' }}>
          <div>
            <h3>No published courses yet</h3>
            <p>
              New course drafts will show up here once an admin approves them and they are
              published.
            </p>
          </div>
        </div>
      ) : (
        <div className="admin-list" style={{ marginTop: '1.5rem' }}>
          {filteredCourses.map((course) => (
            <article key={course.id} className="module-card" style={{ padding: '1rem 1.25rem' }}>
              <div
                style={{
                  display: 'flex',
                  justifyContent: 'space-between',
                  gap: '1rem',
                  flexWrap: 'wrap',
                }}
              >
                <div>
                  <div className="eyebrow">{course.category.replace('-', ' ')}</div>
                  <h3 style={{ margin: '0.25rem 0 0' }}>{course.title}</h3>
                </div>
                <span className="chip chip-muted">{course.ageRange}</span>
              </div>

              <CourseCover src={course.coverImageUrl} alt={course.coverAlt || course.title} />
              <p>Language: {course.language || 'Not specified'}</p>
              <p style={{ margin: '0.75rem 0 0' }}>{course.summary}</p>

              <div
                style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', marginTop: '0.75rem' }}
              >
                <span className="chip chip-muted">Budget: {course.budget}</span>
                <span className="chip chip-muted">Status: {course.status}</span>
              </div>

              <div
                className="portal-actions"
                style={{ justifyContent: 'flex-start', marginTop: '1rem' }}
              >
                <Link href={`/learn/courses/${course.id}`} className="button secondary">
                  Open course
                </Link>
              </div>
            </article>
          ))}
        </div>
      )}
    </section>
  );
}

export async function LearnCoursesPage(props: PageProps<'/learn/courses'>) {
  return (
    <Suspense fallback={<PortalLoading />}>
      <LearnCoursesBody {...props} />
    </Suspense>
  );
}

export default function LearnCoursesRoute(props: PageProps<'/learn/courses'>) {
  return <LearnCoursesPage {...props} />;
}
