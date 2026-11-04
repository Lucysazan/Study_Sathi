import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'StudySathi',
  description: 'Free learning resources for curious minds in Nepal.',
};

export default function RootLayout({ children }: LayoutProps<'/'>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
