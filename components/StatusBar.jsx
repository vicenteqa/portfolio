'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { routes } from '@/lib/routes';

// A tmux-style status line: session name, window list (the site nav) and a
// right-hand segment. Hidden on small screens.
const StatusBar = () => {
  const pathname = usePathname();
  const windows = routes.filter((r) => r.path !== '/contact');
  const here = routes.find((r) => r.path === pathname);

  return (
    <footer className="hidden md:flex fixed bottom-0 inset-x-0 z-30 h-7 items-stretch justify-between bg-[#0d151d] border-t border-white/10 font-mono text-[11px] text-white/60">
      <div className="flex items-stretch">
        <span className="flex items-center px-3 bg-success text-ink font-semibold">
          [portfolio]
        </span>
        <nav aria-label="Windows" className="flex items-stretch">
          {windows.map((w) => {
            const active = w.path === pathname;
            return (
              <Link
                key={w.path}
                href={w.path}
                aria-current={active ? 'page' : undefined}
                className={`flex items-center px-3 transition-colors ${
                  active ? 'bg-accent text-ink font-semibold' : 'hover:bg-white/10 hover:text-white'
                }`}
              >
                {w.name.replace(' ', '-')}
                {active ? '*' : ''}
              </Link>
            );
          })}
        </nav>
      </div>
      <div className="flex items-stretch">
        <span className="flex items-center px-3">{here ? here.path : pathname}</span>
        <span className="flex items-center px-3 bg-white/5">Ctrl-k: jump</span>
        <span className="flex items-center px-3 bg-success/90 text-ink font-semibold">
          vicente@portfolio
        </span>
      </div>
    </footer>
  );
};

export default StatusBar;
