import { Fira_Code, Syne, DM_Sans } from 'next/font/google';
import './globals.css';

//Components
import Header from '@/components/Header';
import PageTransition from '@/components/PageTransition';
import StairTransition from '@/components/StairTransition';

const firaCode = Fira_Code({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-firaCode',
});

const syne = Syne({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  variable: '--font-syne',
});

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700'],
  variable: '--font-dmSans',
});

export const metadata = {
  title: 'Vicente Ruiz - Portfolio',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${firaCode.variable} ${syne.variable} ${dmSans.variable}`}>
        <Header />
        <StairTransition></StairTransition>
        <PageTransition>{children}</PageTransition>
      </body>
    </html>
  );
}
