import Link from 'next/link';
import Image from 'next/image';
import { HeartHandshake, BookOpen, ArrowRight } from 'lucide-react';
import { QuickPreview } from '@/components/quick-learn/QuickPreview';
import { DiscoveryGuide } from '@/components/home/DiscoveryGuide';
import { HomeHero } from '@/components/home/HomeHero';
import { GradeGrid } from '@/components/academic/LibraryNavigation';
export default function HomePage() {
  return (
    <>
      <HomeHero />
      <div className="site-container community-promise" aria-label="Our learning promise">
        <div>
          <HeartHandshake size={25} aria-hidden="true" />
          <p>
            <strong>Learning belongs to everyone</strong>
            <span>A free place for learners, families and educators.</span>
          </p>
        </div>
        <div>
          <BookOpen size={25} aria-hidden="true" />
          <p>
            <strong>Your pace. Your starting point.</strong>
            <span>Read a chapter, watch a lesson or try something new.</span>
          </p>
        </div>
        <Link href="/about">
          Meet StudySathi <ArrowRight size={17} aria-hidden="true" />
        </Link>
      </div>
      <section
        id="choose-class"
        className="site-container section school-library home-class-library"
      >
        <div className="eyebrow">TEXTBOOKS AND VIDEO LESSONS</div>
        <h2>Select your class</h2>
        <p>Start with your class. Find free textbooks and video lessons, organized by subject.</p>
        <GradeGrid />
      </section>
      <DiscoveryGuide />
      <QuickPreview />
      <section className="soft-section">
        <div className="site-container section">
          <h2>Read. Watch. Practise.</h2>
          <div className="academic-grid">
            <article className="learning-card">
              <div className="home-step-photo">
                <Image
                  src="/images/home/library-books.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 600px) 100vw, 33vw"
                />
              </div>
              <h3>Read your textbook</h3>
              <p>
                Open a government PDF in our reader, jump to a page, or open the original to save
                it.
              </p>
            </article>
            <article className="learning-card">
              <div className="home-step-photo">
                <Image
                  src="/images/home/study-group.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 600px) 100vw, 33vw"
                />
              </div>
              <h3>Watch the subject playlist</h3>
              <p>
                Play NCED Virtual lessons here, search indexed lesson titles and use the full
                playlist menu.
              </p>
            </article>
            <article className="learning-card">
              <div className="home-step-photo">
                <Image
                  src="/images/home/science-discovery.jpg"
                  alt=""
                  fill
                  sizes="(max-width: 600px) 100vw, 33vw"
                />
              </div>
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
        <h2>Keep learning, together</h2>
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
      <details className="site-container home-photo-credits">
        <summary>Photography credits</summary>
        <p>
          Illustrative stock photography from Pexels:{' '}
          <a href="https://www.pexels.com/photo/students-doing-their-classwork-together-5306450/">
            Antoni Shkraba
          </a>
          ,{' '}
          <a href="https://www.pexels.com/photo/students-studying-together-8457292/">
            Norma Mortenson
          </a>
          ,{' '}
          <a href="https://www.pexels.com/photo/a-smart-boy-doing-a-science-experiment-8471836/">
            MART PRODUCTION
          </a>{' '}
          and <a href="https://www.pexels.com/photo/books-in-library-3747531/">Polina Zimmerman</a>.
        </p>
      </details>
    </>
  );
}
