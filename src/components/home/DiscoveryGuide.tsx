import Link from 'next/link';
import { BookOpen, Gamepad2, Map, Play, ArrowRight } from 'lucide-react';
import { GamePreview } from '@/components/study/GamePreview';

export function DiscoveryGuide() {
  return (
    <section className="site-container section discovery-guide">
      <div className="eyebrow">WHAT SHALL WE DISCOVER TODAY?</div>
      <h2>Pick your kind of adventure</h2>
      <p>A book, a little experiment or a trail to follow. You choose.</p>
      <div className="discovery-doors">
        {[
          {
            href: '/study',
            title: 'My class corner',
            text: 'Choose a class. Find books and video lessons.',
            Icon: BookOpen,
            colour: 'mint',
          },
          {
            href: '/play',
            title: 'Play and discover',
            text: 'Build, balance and explore with hands-on games.',
            Icon: Gamepad2,
            colour: 'lilac',
          },
          {
            href: '/learning-paths',
            title: 'Follow a trail',
            text: 'Small steps. A clear route. Go at your own pace.',
            Icon: Map,
            colour: 'peach',
          },
          {
            href: '/resources',
            title: 'Curiosity corner',
            text: 'Explore English, nature, numbers and more.',
            Icon: Play,
            colour: 'yellow',
          },
        ].map(({ href, title, text, Icon, colour }) => (
          <Link key={href} href={href} className={`discovery-door ${colour}`}>
            <span className="door-icon">
              <Icon size={42} aria-hidden="true" />
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
        <span aria-hidden="true" className="language-art">
          Aa <span>hello!</span>
        </span>
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
