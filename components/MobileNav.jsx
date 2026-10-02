'use client';

import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { CiMenuFries } from 'react-icons/ci';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { routes } from '@/lib/routes';

const MobileNav = () => {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  // The sheet is a portal that outlives a client-side navigation: if it is not
  // closed explicitly it keeps covering the new page and the menu looks dead.
  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger
        className="w-10 h-10 rounded border border-white/10 flex justify-center items-center hover:border-accent/50 transition-colors"
        aria-label="Open menu"
      >
        <CiMenuFries className="text-[24px] text-accent" />
      </SheetTrigger>
      <SheetContent className="flex flex-col bg-ink/95 border-l border-white/10">
        <SheetTitle className="sr-only">Menu</SheetTitle>
        <SheetDescription className="sr-only">Site navigation</SheetDescription>
        <p className="eyebrow mt-16 mb-6">{'// menu'}</p>
        <nav className="flex flex-col" aria-label="Mobile">
          {routes.map((link) => {
            const isActive = link.path === pathname;
            return (
              <Link
                href={link.path}
                key={link.path}
                onClick={() => setOpen(false)}
                aria-current={isActive ? 'page' : undefined}
                className={`flex items-baseline py-4 border-b border-white/10 font-display text-3xl font-bold capitalize transition-colors ${
                  isActive ? 'text-accent' : 'text-white hover:text-accent'
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
