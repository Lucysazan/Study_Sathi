import { requireRole } from '@/lib/auth/session';
import { getAcademicTextbook } from '@/lib/academic/source.server';
import { TextbookForm } from '@/components/academic/TextbookForm';

export default async function AcademicAdmin() {
  await requireRole(['admin'], '/admin/academic');
  const textbook = await getAcademicTextbook();
  return (
    <section className="admin-card">
      <h1>Academic sources</h1>
      <p>
        Connect a verified official textbook to the mathematics pilot. Original topic content
        remains in the reviewed code catalog for this release.
      </p>
      <TextbookForm initial={textbook} />
    </section>
  );
}
