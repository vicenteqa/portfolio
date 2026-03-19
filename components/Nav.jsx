'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const links = [
  { name: 'home', path: '/' },
  { name: 'resume', path: '/resume' },
  { name: 'fun stuff', path: '/funStuff' },
  { name: 'music', path: '/music' },
];

const Nav = () => {
  const pathname = usePathname();
  return (
    <nav className="flex gap-8">
      {links.map((link, index) => {
        const isActive = link.path === pathname;
        return (
          <Link
            href={link.path}
            key={index}
            className={`${
              isActive && 'text-accent border-b-2 border-accent'
            } capitalize font-display font-medium hover:text-accent transition-all duration-300 pb-1 relative group`}
          >
            {link.name}
            {/* Animated underline */}
            {!isActive && (
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full"></span>
            )}
          </Link>
        );
      })}
    </nav>
  );
};

export default Nav;
