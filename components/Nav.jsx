'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routes } from '@/lib/routes';

// contact lives behind the header button
const links = routes.filter((r) => r.path !== '/contact');

const Nav = () => {
  const pathname = usePathname();
  return (
    <nav className="flex gap-7" aria-label="Main">
      {links.map((link) => {
        const isActive = link.path === pathname;
        return (
          <Link
            href={link.path}
            key={link.path}
            aria-current={isActive ? 'page' : undefined}
            className={`group relative flex items-baseline font-mono text-sm py-1 transition-colors duration-300 ${
              isActive ? 'text-accent' : 'text-white/70 hover:text-white'
            }`}
          >
            {link.name}
            <span
              className={`absolute -bottom-0.5 left-0 h-px bg-accent transition-all duration-300 ${
                isActive ? 'w-full' : 'w-0 group-hover:w-full'
              }`}
            />
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
