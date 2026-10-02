'use client';

import { usePathname } from 'next/navigation';

// Re-mounted on every navigation (that is what template.jsx is for), so the
// "test run" curtain plays on each route change. It is pure CSS: no exit
// animations to wait for, nothing that can leave a click blocked, and it still
// clears itself if JS never loads.
const hash = (s) => [...s].reduce((a, c) => (a * 31 + c.charCodeAt(0)) >>> 0, 7);

const specName = (path) =>
  path === '/' ? 'home' : path.replace(/^\//, '').replace(/\W+/g, '-').toLowerCase();

export default function Template({ children }) {
  const pathname = usePathname();
  const ms = 180 + (hash(pathname) % 420);

  return (
    <>
      <div className="route-run" aria-hidden="true">
        <div className="route-run__term">
          <p className="route-run__l1">
            <span className="text-white/40">$</span> npx playwright test{' '}
            <span className="text-accent">{pathname}</span>
          </p>
          <p className="route-run__l2 text-white/40">Running 1 test using 1 worker</p>
          <p className="route-run__l3">
            <span className="text-success">✓</span> [chromium] › {specName(pathname)}.spec.ts{' '}
            <span className="text-white/40">({ms}ms)</span>
          </p>
          <p className="route-run__l4 text-success">1 passed</p>
        </div>
      </div>
      <div className="route-in">{children}</div>
    </>
  );
}
