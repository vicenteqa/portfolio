'use client';

import { useState } from 'react';
import Image from 'next/image';
import { AnimatePresence, motion } from 'framer-motion';
import { BsArrowUpRight, BsGithub } from 'react-icons/bs';
import { PiCaretLeftBold, PiCaretRightBold } from 'react-icons/pi';

import PageHeader from '@/components/PageHeader';
import WindowBar from '@/components/WindowBar';
import { Button } from '@/components/ui/button';

const projects = [
  {
    num: '01',
    title: 'Automate Booking of Gym Activities',
    description:
      'With this mini-project, I automated the booking of collective activities at my gym.',
    stack: [
      { name: 'Typescript' },
      { name: 'Playwright' },
      { name: 'Github Actions' },
    ],
    image: '/assets/funStuff/thumb1.png',
    article:
      'https://dev.to/vicentecph/how-i-automated-the-booking-of-group-crossfit-or-any-other-activity-classes-at-my-gym-with-playwright-15pd',
    github: 'https://github.com/vicenteqa/book-gym-class',
  },
  {
    num: '02',
    title: 'This portfolio itself!',
    description:
      'Personal portfolio done with Next.js, Tailwind CSS and tested with Playwright.',
    stack: [
      { name: 'Typescript' },
      { name: 'Playwright' },
      { name: 'Next.js' },
    ],
    image: '/assets/funStuff/thumb2.png',
    github: 'https://github.com/vicenteqa/portfolio',
  },
];

const FunStuff = () => {
  const [[index, dir], setPage] = useState([0, 1]);
  const project = projects[index];

  const go = (delta) =>
    setPage(([i]) => [(i + delta + projects.length) % projects.length, delta]);

  return (
    <section
      className="container mx-auto pb-12 outline-none"
      tabIndex={-1}
      onKeyDown={(e) => {
        if (e.key === 'ArrowRight') go(1);
        if (e.key === 'ArrowLeft') go(-1);
      }}
    >
      <PageHeader
        label="fun stuff"
        intro="Things I build when nobody is paying me to."
      >
        Side <span className="text-accent">quests</span>
      </PageHeader>

      <div className="grid xl:grid-cols-2 gap-10 xl:gap-16 items-center">
        {/* case file */}
        <div className="order-2 xl:order-none min-h-[380px]">
          <AnimatePresence mode="wait" initial={false} custom={dir}>
            <motion.div
              key={project.num}
              custom={dir}
              initial={{ opacity: 0, x: 30 * dir }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -30 * dir }}
              transition={{ duration: 0.3 }}
              className="flex flex-col gap-6"
            >
              <div className="flex items-end gap-5">
                <span className="font-display text-[110px] leading-[0.8] font-extrabold text-transparent text-outline">
                  {project.num}
                </span>
                <span className="font-mono text-xs text-white/40 pb-1">
                  / {String(projects.length).padStart(2, '0')}
                </span>
              </div>
              <h2 className="font-display text-3xl xl:text-5xl font-bold leading-[1.05]">
                {project.title}
              </h2>
              <p className="text-white/65 text-lg max-w-[520px]">{project.description}</p>
              <ul className="flex flex-wrap gap-2">
                {project.stack.map((item) => (
                  <li
                    key={item.name}
                    className="font-mono text-xs px-3 py-1.5 rounded-md border border-accent/30 bg-accent/10 text-accent"
                  >
                    {item.name}
                  </li>
                ))}
              </ul>
              <div className="flex flex-wrap gap-3 pt-2">
                {project.article && (
                  <Button asChild variant="outline">
                    <a href={project.article} target="_blank" rel="noopener noreferrer">
                      Read the article <BsArrowUpRight />
                    </a>
                  </Button>
                )}
                <Button asChild variant="primary">
                  <a href={project.github} target="_blank" rel="noopener noreferrer">
                    <BsGithub /> Source
                  </a>
                </Button>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* browser-window preview */}
        <div>
          <div className="rounded-md border border-white/10 bg-primary overflow-hidden shadow-[8px_8px_0_0_rgba(0,0,0,0.45)]">
            <WindowBar title={project.github.replace('https://', '')} />
            <div className="relative aspect-[16/10] bg-ink">
              <AnimatePresence initial={false}>
                <motion.div
                  key={project.image}
                  initial={{ opacity: 0, scale: 1.04 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.4 }}
                  className="absolute inset-0"
                >
                  <Image
                    src={project.image}
                    alt={project.title}
                    fill
                    sizes="(min-width: 1200px) 560px, 92vw"
                    className="object-cover"
                  />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          <div className="mt-5 flex items-center justify-between">
            <div className="flex gap-2" role="tablist" aria-label="Projects">
              {projects.map((p, i) => (
                <button
                  key={p.num}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={p.title}
                  onClick={() => setPage([i, i > index ? 1 : -1])}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === index ? 'w-10 bg-accent' : 'w-5 bg-white/20 hover:bg-white/40'
                  }`}
                />
              ))}
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous project"
                className="w-11 h-11 rounded border border-white/15 flex items-center justify-center text-white/70 hover:border-accent hover:text-accent transition-colors"
              >
                <PiCaretLeftBold />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next project"
                className="w-11 h-11 rounded border border-white/15 flex items-center justify-center text-white/70 hover:border-accent hover:text-accent transition-colors"
              >
                <PiCaretRightBold />
              </button>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default FunStuff;
