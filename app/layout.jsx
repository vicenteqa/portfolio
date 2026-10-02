import { Bricolage_Grotesque, Hanken_Grotesk, Fira_Code } from 'next/font/google';
import './globals.css';

//Components
import Header from '@/components/Header';
import StatusBar from '@/components/StatusBar';
import CommandPalette from '@/components/CommandPalette';
import Analytics from '@/components/Analytics';

const display = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-display',
  display: 'swap',
});

const body = Hanken_Grotesk({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
});

const mono = Fira_Code({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-mono',
  display: 'swap',
});

export const metadata = {
  title: 'Vicente Ruiz - Portfolio',
  description:
    'Software Development Engineer in Test. Test automation, quality engineering and a vinyl collection.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${display.variable} ${body.variable} ${mono.variable}`}>
        <Header />
        <main className="relative pb-14">{children}</main>
        <StatusBar />
        <CommandPalette />
        <Analytics />
      </body>
    </html>
  );
}
