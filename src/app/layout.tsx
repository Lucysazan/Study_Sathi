import { Suspense } from 'react';
import { LibrarySync } from '@/components/layout/LibrarySync';
import type { Metadata } from 'next';
import { Inter, Plus_Jakarta_Sans } from 'next/font/google';
import { Footer } from '@/components/layout/Footer';
import { StorageNotice, Toast } from '@/components/layout/GuestFeedback';
import { Header } from '@/components/layout/Header';
import './globals.css';

// Self-hosted by next/font (no request to Google from the browser).
// Variable fonts, so the prototype's in-between weights (650, 750) render as designed.
const inter = Inter({ subsets: ['latin'], variable: '--font-inter', display: 'swap' });
const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-jakarta',
  display: 'swap',
});

export const metadata: Metadata = {
  title: { default: 'StudySathi', template: '%s · StudySathi' },
  description:
    'Free, curated learning resources and guided learning paths for children aged 10–16 in Nepal.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en" className={`${inter.variable} ${jakarta.variable}`}>
      <body>
        <a className="skip-link" href="#main">
          Skip to content
        </a>
        <Header />
        <Suspense fallback={null}>
          <LibrarySync />
        </Suspense>
        <StorageNotice />
        <main id="main" tabIndex={-1}>
          {children}
        </main>
        <Footer />
        <Toast />
      </body>
    </html>
  );
}
