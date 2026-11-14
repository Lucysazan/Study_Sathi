import Link from 'next/link';
import { DiscoveryGuide } from '@/components/home/DiscoveryGuide';
import { HomeHero } from '@/components/home/HomeHero';
import { GradeGrid } from '@/components/academic/LibraryNavigation';
import { schoolLibrary } from '@/lib/academic/library';
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <DiscoveryGuide />
      <section className="site-container section school-library">
        <div className="eyebrow">TEXTBOOKS AND VIDEO LESSONS</div>
        <h2>Select your class</h2>
        <p>
          {schoolLibrary.books.length} government-hosted PDFs and {schoolLibrary.playlists.length}{' '}
          NCED Virtual playlists, organized by class and subject.
        </p>
        <GradeGrid />
      </section>
      <section className="soft-section">
        <div className="site-container section">
          <h2>Read. Watch. Practise.</h2>
          <div className="academic-grid">
            <article className="learning-card">
              <h3>Read your textbook</h3>
              <p>
                Open a government PDF in our reader, jump to a page, or open the original to save
                it.
              </p>
            </article>
            <article className="learning-card">
              <h3>Watch the subject playlist</h3>
              <p>
                Play NCED Virtual lessons here, search indexed lesson titles and use the full
                playlist menu.
              </p>
            </article>
            <article className="learning-card">
              <h3>Check your understanding</h3>
              <p>
                Try our original Grade 9 mathematics practice pilot and get suggestions on what to
                revise.
              </p>
              <Link href="/study/9/mathematics#practice-topics">Open practice</Link>
            </article>
          </div>
        </div>
      </section>
      <section className="site-container section">
        <h2>Your learning space</h2>
        <div className="academic-actions">
          <Link className="button" href="/learn">
            My learning
          </Link>
          <Link className="button secondary" href="/resources">
            Supporting resources
          </Link>
          <Link className="button secondary" href="/safety-mission">
            Digital safety practice
          </Link>
          <Link className="button secondary" href="/study/sources">
            Sources and coverage
          </Link>
        </div>
      </section>
    </>
  );
}
