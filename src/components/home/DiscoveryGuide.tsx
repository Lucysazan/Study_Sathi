import Link from 'next/link';
import Image from 'next/image';
import { BookOpen, Gamepad2, Map, Play, ArrowRight } from 'lucide-react';
import { GamePreview } from '@/components/study/GamePreview';

export function DiscoveryGuide() {
  return (
    <section className="site-container section discovery-guide">
      <div className="eyebrow">MANY WAYS TO LEARN</div>
      <h2>Find what sparks your curiosity</h2>
      <p>Books, games and small discoveries. Every starting point is free.</p>
      <div className="discovery-doors">
        {[
          {
            href: '/study',
            title: 'My class corner',
            text: 'Choose a class. Find books and video lessons.',
            Icon: BookOpen,
            colour: 'mint',
            photo: 'study-group.jpg',
          },
          {
            href: '/play',
            title: 'Play and discover',
            text: 'Build, balance and explore with hands-on games.',
            Icon: Gamepad2,
            colour: 'lilac',
            photo: 'science-discovery.jpg',
          },
          {
            href: '/learning-paths',
            title: 'Follow a trail',
            text: 'Small steps. A clear route. Go at your own pace.',
            Icon: Map,
            colour: 'peach',
            photo: 'learning-together.jpg',
          },
          {
            href: '/resources',
            title: 'Curiosity corner',
            text: 'Explore English, nature, numbers and more.',
            Icon: Play,
            colour: 'yellow',
            photo: 'library-books.jpg',
          },
        ].map(({ href, title, text, Icon, colour, photo }) => (
          <Link key={href} href={href} className={`discovery-door ${colour}`}>
            <div className="door-photo">
              <Image
                src={`/images/home/${photo}`}
                alt=""
                fill
                sizes="(max-width: 600px) 100vw, (max-width: 1000px) 50vw, 25vw"
              />
            </div>
            <span className="door-icon">
              <Icon size={22} aria-hidden="true" />
            </span>
            <h3>{title}</h3>
            <p>{text}</p>
            <span className="door-action">
              Let&apos;s explore <ArrowRight size={18} aria-hidden="true" />
            </span>
          </Link>
        ))}
      </div>
      <div className="discovery-language">
        <div className="language-photo">
          <Image
            src="/images/home/study-group.jpg"
            alt="Learners reading and taking notes together"
            fill
            sizes="(max-width: 600px) 100vw, 35vw"
          />
        </div>
        <div>
          <div className="eyebrow">WORDS AND STORIES</div>
          <h2>A little English adventure</h2>
          <p>Read a short passage. Find the main idea. Try the reading activity right here.</p>
          <Link className="button secondary" href="/play/reading">
            Be a story detective <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
      </div>
      <div className="discovery-spotlight">
        <div>
          <div className="eyebrow">TRY A TINY EXPERIMENT</div>
          <h2>Can you make the bulb glow?</h2>
          <p>Tap the switch. Then open the full circuit game and build your own.</p>
          <Link className="button" href="/play/circuits">
            Build a circuit <ArrowRight size={18} aria-hidden="true" />
          </Link>
        </div>
        <GamePreview id="circuits" />
      </div>
    </section>
  );
}
