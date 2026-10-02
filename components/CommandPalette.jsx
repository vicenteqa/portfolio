'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Dialog from '@radix-ui/react-dialog';
import { FiArrowUpRight, FiCornerDownLeft, FiDownload, FiSearch } from 'react-icons/fi';
import { routes, socials } from '@/lib/routes';

const pages = routes.map((r) => ({
  id: r.path,
  group: 'Go to',
  label: r.name,
  hint: r.path,
  keywords: r.name,
  run: (router) => router.push(r.path),
}));

const actions = [
  {
    id: 'cv',
    group: 'Do',
    label: 'download CV',
    hint: 'pdf',
    keywords: 'resume cv pdf',
    icon: FiDownload,
    run: () => window.open(socials.cv, '_blank', 'noopener'),
  },
  {
    id: 'github',
    group: 'Do',
    label: 'open GitHub',
    hint: 'vicenteqa',
    keywords: 'code repos',
    icon: FiArrowUpRight,
    run: () => window.open(socials.github, '_blank', 'noopener'),
  },
  {
    id: 'linkedin',
    group: 'Do',
    label: 'open LinkedIn',
    hint: 'vrcuadrado',
    keywords: 'profile network',
    icon: FiArrowUpRight,
    run: () => window.open(socials.linkedin, '_blank', 'noopener'),
  },
];

const all = [...pages, ...actions];

const CommandPalette = () => {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [index, setIndex] = useState(0);
  const listRef = useRef(null);

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return all;
    return all.filter((i) => `${i.label} ${i.keywords}`.toLowerCase().includes(q));
  }, [query]);

  const openPalette = useCallback(() => {
    setQuery('');
    setIndex(0);
    setOpen(true);
  }, []);

  // global shortcuts: Ctrl/Cmd+K anywhere, "/" when not typing
  useEffect(() => {
    const onKey = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setOpen((o) => {
          if (!o) {
            setQuery('');
            setIndex(0);
          }
          return !o;
        });
        return;
      }
      const t = e.target;
      const typing =
        t instanceof HTMLElement &&
        (t.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(t.tagName));
      if (e.key === '/' && !typing && !e.ctrlKey && !e.metaKey && !e.altKey) {
        e.preventDefault();
        openPalette();
      }
    };
    window.addEventListener('keydown', onKey);
    window.addEventListener('palette:open', openPalette);
    return () => {
      window.removeEventListener('keydown', onKey);
      window.removeEventListener('palette:open', openPalette);
    };
  }, [openPalette]);

  useEffect(() => {
    const el = listRef.current?.querySelector('[data-active="true"]');
    el?.scrollIntoView({ block: 'nearest' });
  }, [index, results]);

  const choose = (item) => {
    if (!item) return;
    setOpen(false);
    item.run(router);
  };

  const onKeyDown = (e) => {
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setIndex((i) => (results.length ? (i + 1) % results.length : 0));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setIndex((i) => (results.length ? (i - 1 + results.length) % results.length : 0));
    } else if (e.key === 'Enter') {
      e.preventDefault();
      choose(results[index]);
    }
  };

  let lastGroup = null;

  return (
    <Dialog.Root open={open} onOpenChange={setOpen}>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[90] bg-ink/70 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" />
        <Dialog.Content
          onOpenAutoFocus={(e) => {
            e.preventDefault();
            document.getElementById('palette-input')?.focus();
          }}
          className="fixed z-[91] left-1/2 top-[14vh] -translate-x-1/2 w-[min(92vw,560px)] rounded-md border border-white/10 bg-primary shadow-[8px_8px_0_0_rgba(0,0,0,0.45)] overflow-hidden data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=open]:slide-in-from-top-2"
        >
          <Dialog.Title className="sr-only">Command palette</Dialog.Title>
          <Dialog.Description className="sr-only">
            Type to filter, use the arrow keys and Enter to go to a page or run an action.
          </Dialog.Description>

          <div className="flex items-center gap-3 px-4 border-b border-white/10">
            <FiSearch className="text-white/40" />
            <input
              id="palette-input"
              value={query}
              onChange={(e) => {
                setQuery(e.target.value);
                setIndex(0);
              }}
              onKeyDown={onKeyDown}
              placeholder="Jump to a page or run an action…"
              role="combobox"
              aria-expanded="true"
              aria-controls="palette-list"
              aria-activedescendant={results[index] ? `palette-${results[index].id}` : undefined}
              autoComplete="off"
              spellCheck={false}
              className="flex-1 h-14 bg-transparent outline-none font-mono text-sm placeholder:text-white/30"
            />
            <kbd className="font-mono text-[10px] text-white/40 px-1.5 py-0.5 rounded bg-white/5">
              esc
            </kbd>
          </div>

          <ul
            id="palette-list"
            role="listbox"
            ref={listRef}
            className="max-h-[50vh] overflow-y-auto p-2"
          >
            {results.length === 0 && (
              <li className="px-3 py-8 text-center font-mono text-sm text-white/40">
                0 tests matched “{query}”
              </li>
            )}
            {results.map((item, i) => {
              const header = item.group !== lastGroup;
              lastGroup = item.group;
              const Icon = item.icon;
              const active = i === index;
              return (
                <li key={item.id} role="presentation">
                  {header && (
                    <p className="px-3 pt-3 pb-1 font-mono text-[10px] uppercase tracking-[0.2em] text-white/30">
                      {item.group}
                    </p>
                  )}
                  <button
                    type="button"
                    id={`palette-${item.id}`}
                    role="option"
                    aria-selected={active}
                    data-active={active}
                    tabIndex={-1}
                    onMouseMove={() => setIndex(i)}
                    onClick={() => choose(item)}
                    className={`w-full flex items-center justify-between gap-3 px-3 py-2.5 rounded text-left transition-colors ${
                      active ? 'bg-accent/15 text-accent' : 'text-white/80'
                    }`}
                  >
                    <span className="flex items-center gap-3 font-display text-base capitalize">
                      {Icon && <Icon className="text-sm opacity-70" />}
                      {item.label}
                    </span>
                    <span className="flex items-center gap-2 font-mono text-xs text-white/40">
                      {item.hint}
                      {active && <FiCornerDownLeft />}
                    </span>
                  </button>
                </li>
              );
            })}
          </ul>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default CommandPalette;
