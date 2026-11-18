import { ArrowRight, BookOpen, CheckCircle2, HeartHandshake } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export function HomeHero() {
  return (
    <section className="hero site-container community-hero">
      <div className="hero-copy">
        <div className="community-kicker">
          <HeartHandshake size={17} aria-hidden="true" /> A FREE LEARNING SPACE FOR OUR COMMUNITY
        </div>
        <h1>
          Free learning.
          <br />
          <span>Endless possibility.</span>
        </h1>
        <p>
          For every curious mind in Nepal. Explore textbooks, video lessons and playful activities,
          at your own pace.
        </p>
        <div className="hero-buttons">
          <Link className="button" href="#choose-class">
            Find my class <ArrowRight size={18} aria-hidden="true" />
          </Link>
          <Link className="button secondary" href="/play">
            Play and Learn <BookOpen size={18} aria-hidden="true" />
          </Link>
        </div>
        <div className="hero-notes">
          {['Free to explore', 'No sign-up to start', 'Classes 1–12'].map((note) => (
            <span key={note}>
              <CheckCircle2 size={16} aria-hidden="true" /> {note}
            </span>
          ))}
        </div>
      </div>
      <figure className="community-photo">
        <Image
          src="/images/home/learning-together.jpg"
          alt="Students sharing a laptop and studying together in a library"
          fill
          sizes="(max-width: 800px) 100vw, 50vw"
          preload
        />
        <figcaption>
          <span>LEARN. EXPLORE. GROW TOGETHER.</span>
          <strong>
            A little support.
            <br />A world of discovery.
          </strong>
        </figcaption>
      </figure>
    </section>
  );
}
