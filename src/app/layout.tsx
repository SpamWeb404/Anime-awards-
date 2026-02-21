import type { Metadata } from 'next';
import { Inter } from 'next/font/google';
import './globals.css';
import { Providers } from '@/components/providers';
import { ChibiSamaOverlay } from '@/components/chibisama/ChibiSamaOverlay';

const inter = Inter({ subsets: ['latin'] });

export const metadata: Metadata = {
  title: 'Isekai Awards - The Ledger of Souls',
  description:
    'An immersive anime awards experience. Bind your soul to your favorite nominees and journey through the realm with Chibi-sama as your guide.',
  keywords: ['anime', 'awards', 'isekai', 'voting', 'chibi-sama'],
  authors: [{ name: 'Isekai Awards Team' }],
  openGraph: {
    title: 'Isekai Awards - The Ledger of Souls',
    description: 'Your soul has been summoned. The realm awaits your judgment.',
    type: 'website',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={inter.className}>
        <Providers>
          {children}
          <ChibiSamaOverlay />
        </Providers>
      </body>
    </html>
  );
}
