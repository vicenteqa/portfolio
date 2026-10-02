'use client';

import Link from 'next/link';
import { motion, useReducedMotion } from 'framer-motion';
import WindowBar from './WindowBar';

// The home page "test report": real facts about me, written as passing tests.
const tests = [
  { name: 'builds reliable automation', meta: 'Playwright · Cypress' },
  { name: 'validates releases on Azure', meta: 'Terraform · Ansible' },
  { name: 'ships quality through CI/CD', meta: 'GitHub Actions · Helm' },
  { name: 'makes flaky tests visible', meta: 'dashboard · alerts' },
  { name: 'runs E2E 60% faster', meta: 'parallelization' },
  { name: 'works AI-first', meta: 'coding agents' },
  { name: 'collects vinyl records', meta: '→ /music', href: '/music' },
];

const START = 1.1; // wait for the route curtain

const Tick = ({ delay, reduce }) => (
  <motion.span
    initial={reduce ? false : { scale: 0, rotate: -40 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ delay, type: 'spring', stiffness: 500, damping: 18 }}
    className="inline-block w-4 text-success"
    aria-hidden
  >
    ✓
  </motion.span>
);

const ReportCard = ({ className = '' }) => {
  const reduce = useReducedMotion();
  const d = (i) => (reduce ? 0 : START + i * 0.14);

  return (
    <motion.section
      aria-label="Test report"
      initial={reduce ? false : { opacity: 0, y: 24, rotate: -1.5 }}
      animate={{ opacity: 1, y: 0, rotate: -1.5 }}
      transition={{ delay: reduce ? 0 : START - 0.2, duration: 0.6, ease: [0.2, 0.7, 0.2, 1] }}
      className={`rounded-md border border-white/10 bg-primary/90 shadow-[8px_8px_0_0_rgba(0,0,0,0.45)] overflow-hidden font-mono text-[12px] ${className}`}
    >
      <WindowBar title="vicente@portfolio: ~/vicente.spec.ts" />

      <ul className="px-4 py-3 space-y-1.5">
        {tests.map((t, i) => {
          const row = (
            <>
              <span className="flex items-baseline gap-2 min-w-0">
                <Tick delay={d(i)} reduce={reduce} />
                <span className="truncate text-white/85">{t.name}</span>
              </span>
              <span className={`shrink-0 ${t.href ? 'text-accent' : 'text-white/35'}`}>{t.meta}</span>
            </>
          );
          const cls = 'flex items-baseline justify-between gap-3';
          return (
            <motion.li
              key={t.name}
              initial={reduce ? false : { opacity: 0, x: -8 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: d(i), duration: 0.3 }}
            >
              {t.href ? (
                <Link href={t.href} className={`${cls} hover:text-accent group`}>
                  {row}
                </Link>
              ) : (
                <div className={cls}>{row}</div>
              )}
            </motion.li>
          );
        })}
        <motion.li
          initial={reduce ? false : { opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: d(tests.length), duration: 0.3 }}
        >
          <Link href="/contact" className="flex items-baseline justify-between gap-3 group">
            <span className="flex items-baseline gap-2 text-amber">
              <span className="inline-block w-4" aria-hidden>
                ↷
              </span>
              <span className="group-hover:underline underline-offset-4">your next release</span>
            </span>
            <span className="text-amber/70">
              pending<span className="animate-blink">_</span>
            </span>
          </Link>
        </motion.li>
      </ul>

      <div className="px-4 py-2.5 border-t border-white/10 bg-black/20 flex justify-between text-white/50">
        <span>
          <span className="text-success">{tests.length} passed</span> ·{' '}
          <span className="text-amber">1 pending</span>
        </span>
        <span>0 failed</span>
      </div>
    </motion.section>
  );
};

export default ReportCard;
