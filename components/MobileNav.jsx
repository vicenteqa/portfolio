'use client';

import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CiMenuFries } from 'react-icons/ci';
import { Button } from './ui/button';

const links = [
  { name: 'home', path: '/' },
  { name: 'resume', path: '/resume' },
  { name: 'services', path: '/services' },
  { name: 'fun stuff', path: '/funStuff' },
  { name: 'music', path: '/music' },
  { name: 'contact', path: '/contact' },
];

const MobileNav = () => {
  const pathname = usePathname();
  return (
    <Sheet>
      <SheetTrigger className="flex justify-center items-center">
        <CiMenuFries className="text-[32px] text-accent" />
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-primary/95 backdrop-blur-xl border-l border-white/10">
        {/* logo */}
        <div className="mt-20 mb-16 text-center">
          <Link href="/">
            <h1 className="text-4xl font-display font-bold">
              Vicente<span className="text-accent">.</span>
            </h1>
          </Link>
        </div>
        {/*nav*/}
        <nav className="flex flex-col justify-center items-center gap-6">
          {links.map((link, index) => {
            const isActive = link.path === pathname;
            return (
              <Link
                href={link.path}
                key={index}
                className={`${
                  isActive && 'text-accent bg-accent/10 px-8 py-3 rounded-full'
                } text-xl capitalize font-display font-medium hover:text-accent transition-all duration-300 hover:scale-110 active:scale-95 ${
                  !isActive && 'px-8 py-3'
                }`}
              >
                {link.name}
              </Link>
            );
          })}
        </nav>
      </SheetContent>
    </Sheet>
  );
};

export default MobileNav;
