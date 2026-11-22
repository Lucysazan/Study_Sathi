import { Suspense } from 'react';
import { LibrarySync } from '@/components/layout/LibrarySync';
import type { Metadata } from 'next';
import { Jost, Mukta, Newsreader } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { StorageNotice, Toast } from '@/components/layout/GuestFeedback';
import { Header } from '@/components/layout/Header';
import { RouteChrome } from '@/components/layout/RouteChrome';
import { SiteMotion } from '@/components/motion/SiteMotion';
import './globals.css';
import '../styles/paper-deck.css';

// Self-hosted by next/font (no request to Google from the browser).
// Jost: geometric display + body. Newsreader: small serif titles. Mukta: Devanagari (नेपाली).
const jost = Jost({ subsets: ['latin'], variable: '--font-jost', display: 'swap' });
const newsreader = Newsreader({
  subsets: ['latin'],
  variable: '--font-newsreader',
  display: 'swap',
  style: ['normal', 'italic'],
});
const mukta = Mukta({
  subsets: ['devanagari'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-mukta',
  display: 'swap',
});

/** Runs before paint: hide reveal-on-scroll content only when JS runs and motion is allowed. */
const motionBoot = `try{if(!matchMedia('(prefers-reduced-motion: reduce)').matches)document.documentElement.dataset.motion='on'}catch(e){}`;

export const metadata: Metadata = {
  title: { default: 'StudySathi', template: '%s · StudySathi' },
  description:
    'Free, curated learning resources and guided learning paths for children aged 10–16 in Nepal.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html
      lang="en"
      className={`${jost.variable} ${newsreader.variable} ${mukta.variable}`}
      suppressHydrationWarning
    >
      <head>
        <script dangerouslySetInnerHTML={{ __html: motionBoot }} />
      </head>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Suspense fallback={<Header />}>
          <RouteChrome>
            <Header />
          </RouteChrome>
        </Suspense>
        <Suspense fallback={null}>
          <LibrarySync />
        </Suspense>
        <StorageNotice />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Suspense fallback={<Footer />}>
          <RouteChrome>
            <Footer />
          </RouteChrome>
        </Suspense>
        <Toast />
        <SiteMotion />
      </body>
    </html>
  );
}
