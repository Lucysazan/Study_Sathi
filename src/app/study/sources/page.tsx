import type { Metadata } from 'next';
import Link from 'next/link';
import { schoolGrades, schoolLibrary, gradeSubjects } from '@/lib/academic/library';
export const metadata: Metadata = { title: 'School library sources and coverage' };
export default function Sources() {
  return (
    <section className="site-container section school-library">
      <Link href="/study">Back to all classes</Link>
      <h1>Sources and catalog coverage</h1>
      <p>
        Our library connects government-hosted textbooks and NCED Virtual teaching playlists.
        Original files and videos remain with their providers. StudySathi is independent and does
        not claim a provider partnership or endorsement.
      </p>
      <h2>Textbooks</h2>
      <p>
        {schoolLibrary.books.length} PDF links were checked for successful responses and PDF content
        type on {schoolLibrary.checked}. Titles and source links come from CDC listings and indexed
        government PDF records. Editions are shown as listed; we do not claim every item matches the
        latest curriculum.
      </p>
      <a
        href="https://moecdc.gov.np/category/textbook--g-/"
        target="_blank"
        rel="noopener noreferrer"
      >
        CDC textbook catalog
      </a>
      <h2>Teaching videos</h2>
      <p>
        {schoolLibrary.playlists.length} playlists from NCED Virtual, with{' '}
        {schoolLibrary.playlists.reduce((sum, item) => sum + item.videos.length, 0)} lesson entries
        indexed on {schoolLibrary.checked}. Playlist ownership was checked against the NCED Virtual
        channel. Older-course playlists explicitly labeled OLD were excluded.
      </p>
      <a
        href="https://www.youtube.com/@NCEDVirtual/playlists"
        target="_blank"
        rel="noopener noreferrer"
      >
        NCED Virtual playlists
      </a>
      <p>
        The lesson browser is a dated index, sometimes limited to the first 100 entries. The
        embedded YouTube player loads the provider’s full playlist. Entries, visibility and
        embedding permissions may change.
      </p>
      <h2>Coverage by class</h2>
      <div className="coverage-table-wrap">
        <table className="coverage-table">
          <thead>
            <tr>
              <th>Class</th>
              <th>Subjects</th>
              <th>PDFs</th>
              <th>Playlists</th>
            </tr>
          </thead>
          <tbody>
            {schoolGrades.map((grade) => (
              <tr key={grade}>
                <th>
                  <Link href={`/study/${grade}`}>{grade}</Link>
                </th>
                <td>{gradeSubjects(grade).length}</td>
                <td>{schoolLibrary.books.filter((item) => item.grade === grade).length}</td>
                <td>{schoolLibrary.playlists.filter((item) => item.grade === grade).length}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p>
        Coverage varies by subject, language and edition. A grade tile does not mean every subject
        or chapter is present. Missing verified materials are not replaced with invented links.
      </p>
      <h2>Viewing and downloading</h2>
      <p>
        PDFs load directly from government servers into your browser. Use the original link if
        inline reading is unsupported. Saving uses your browser’s PDF controls. Videos use YouTube’s
        supported player with source credits; no video download or rehosting is provided.
      </p>
      <h2>Our own practice</h2>
      <p>
        Grade 9 Mathematics includes three original StudySathi practice units. They remain separate
        from provider content and await teacher review. Practice scores are not a mastery
        certificate.
      </p>
      <h2>OLE Nepal reference</h2>
      <p>
        The class/subject browsing pattern inspired this update. OLE’s artwork, PDF collection and
        activities have not been copied. No OLE API or partnership is claimed.
      </p>
    </section>
  );
}
