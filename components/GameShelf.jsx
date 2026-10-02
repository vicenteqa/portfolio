'use client';

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import Image from 'next/image';
import { useReducedMotion } from 'framer-motion';
import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';
import data from '@/app/collection/games.json';

// shelf order: roughly by generation
const ORDER = ['Mega Drive', 'Xbox 360', 'PS4', 'Switch', 'PS5', 'Switch 2'];

// only used for cases that have no cover yet
const TINT = {
  'Mega Drive': ['#16161d', '#2f3550'],
  'Xbox 360': ['#10240f', '#2f6b25'],
  PS4: ['#0b1f4a', '#1b4fb4'],
  Switch: ['#4a0b12', '#c9202e'],
  PS5: ['#15151f', '#3b3f5c'],
  'Switch 2': ['#3a0a10', '#b01625'],
};

const ROW = 196; // height of one shelf row
const BOARD = 14; // thickness of the board the cases stand on

const wood = `repeating-linear-gradient(to bottom,
  transparent 0 ${ROW - BOARD}px,
  #8a5a36 ${ROW - BOARD}px ${ROW - BOARD + 2}px,
  #5a381f ${ROW - BOARD + 2}px ${ROW - 2}px,
  #160d07 ${ROW - 2}px ${ROW}px)`;

const Case = ({ game, selected, onSelect, index }) => {
  const [from, to] = TINT[game.platform];
  return (
    <div className="flex items-end pb-[14px]" style={{ height: ROW }}>
      <button
        type="button"
        onClick={() => onSelect(game)}
        aria-label={`${game.title}, ${game.platform}`}
        aria-pressed={selected}
        title={game.title}
        style={{ animationDelay: `${Math.min(index, 10) * 30}ms` }}
        className={`case-in group relative block w-[112px] h-[158px] rounded-[3px] outline-none transition-[transform,box-shadow] duration-200 hover:-translate-y-2 hover:-rotate-1 focus-visible:-translate-y-2 focus-visible:ring-2 focus-visible:ring-accent ${
          selected ? '-translate-y-2 ring-2 ring-accent' : ''
        } shadow-[3px_4px_0_rgba(0,0,0,0.5)] hover:shadow-[5px_8px_0_rgba(0,0,0,0.45)]`}
      >
        {game.cover ? (
          <Image
            src={game.cover}
            alt=""
            width={264}
            height={374}
            unoptimized
            decoding="async"
            draggable={false}
            className="w-full h-full object-cover rounded-[3px]"
          />
        ) : (
          <span
            className="flex h-full w-full flex-col justify-between rounded-[3px] p-2 text-left"
            style={{ background: `linear-gradient(160deg, ${to}, ${from})` }}
          >
            <span className="font-mono text-[9px] uppercase tracking-wider text-white/60">
              {game.platform}
            </span>
            <span className="font-display text-[13px] font-bold leading-tight text-white line-clamp-5">
              {game.title}
            </span>
          </span>
        )}
        {/* spine edge and gloss */}
        <span className="pointer-events-none absolute inset-y-0 left-0 w-[6px] rounded-l-[3px] bg-gradient-to-r from-black/45 to-transparent" />
        <span className="pointer-events-none absolute inset-0 rounded-[3px] bg-gradient-to-br from-white/15 via-transparent to-black/20" />
      </button>
    </div>
  );
};

// One shelf = one platform = one horizontally scrolling row of cases.
const ShelfRow = ({ shelf, selected, onSelect, startIndex, reduce }) => {
  const scroller = useRef(null);
  const drag = useRef(null);
  const [edges, setEdges] = useState({ left: false, right: false });

  const measure = useCallback(() => {
    const el = scroller.current;
    if (!el) return;
    setEdges({
      left: el.scrollLeft > 4,
      right: el.scrollLeft + el.clientWidth < el.scrollWidth - 4,
    });
  }, []);

  useEffect(() => {
    measure();
    const el = scroller.current;
    const ro = new ResizeObserver(measure);
    ro.observe(el);
    return () => ro.disconnect();
  }, [measure, shelf.games.length]);

  const scrollBy = (dir) => {
    const el = scroller.current;
    el.scrollBy({ left: dir * el.clientWidth * 0.8, behavior: reduce ? 'auto' : 'smooth' });
  };

  // mouse drag-to-scroll (touch already scrolls natively)
  const onPointerDown = (e) => {
    if (e.pointerType !== 'mouse' || e.button !== 0) return;
    drag.current = { x: e.clientX, left: scroller.current.scrollLeft, moved: false };
  };
  const onPointerMove = (e) => {
    const d = drag.current;
    if (!d) return;
    const dx = e.clientX - d.x;
    if (Math.abs(dx) > 5) d.moved = true;
    if (d.moved) scroller.current.scrollLeft = d.left - dx;
  };
  const endDrag = () => {
    // keep "moved" until the click that follows the drag has been swallowed
    setTimeout(() => (drag.current = null), 0);
  };

  return (
    <section
      aria-label={`${shelf.platform} shelf`}
      style={{ contentVisibility: 'auto', containIntrinsicSize: 'auto 250px' }}
    >
      <div className="mb-2 flex items-center justify-between">
        <h2 className="inline-block rounded-sm border border-amber/40 bg-amber/10 px-3 py-1 font-mono text-[11px] uppercase tracking-[0.2em] text-amber">
          {shelf.platform} · {shelf.games.length}
        </h2>
        <div className="flex gap-1.5">
          {[
            { dir: -1, label: 'Scroll left', Icon: FaChevronLeft, on: edges.left },
            { dir: 1, label: 'Scroll right', Icon: FaChevronRight, on: edges.right },
          ].map(({ dir, label, Icon, on }) => (
            <button
              key={dir}
              type="button"
              onClick={() => scrollBy(dir)}
              disabled={!on}
              aria-label={`${label}, ${shelf.platform}`}
              className="flex h-7 w-7 items-center justify-center rounded border border-white/15 text-xs text-white/70 transition-colors hover:border-accent hover:text-accent disabled:pointer-events-none disabled:opacity-25"
            >
              <Icon />
            </button>
          ))}
        </div>
      </div>

      <div className="relative rounded-md border border-black/60 shadow-[inset_0_6px_14px_rgba(0,0,0,0.55)] overflow-hidden" style={{ backgroundColor: '#24160d' }}>
        <div
          ref={scroller}
          onScroll={measure}
          onPointerDown={onPointerDown}
          onPointerMove={onPointerMove}
          onPointerUp={endDrag}
          onPointerLeave={endDrag}
          onClickCapture={(e) => {
            if (drag.current?.moved) {
              e.stopPropagation();
              e.preventDefault();
            }
          }}
          className="overflow-x-auto overscroll-x-contain snap-x snap-proximity scroll-px-4 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cursor-grab active:cursor-grabbing"
        >
          <div
            className="flex w-max min-w-full gap-x-3 px-4"
            style={{
              backgroundImage: `${wood}, repeating-linear-gradient(90deg, rgba(255,210,160,.035) 0 2px, transparent 2px 11px)`,
            }}
          >
            {shelf.games.map((g, i) => (
              <div key={g.id} className="snap-start shrink-0">
                <Case
                  game={g}
                  index={startIndex + i}
                  selected={selected?.id === g.id}
                  onSelect={onSelect}
                />
              </div>
            ))}
          </div>
        </div>
        {/* fades tell you there is more to the left / right */}
        <div className={`pointer-events-none absolute inset-y-0 left-0 w-10 bg-gradient-to-r from-[#24160d] to-transparent transition-opacity ${edges.left ? 'opacity-100' : 'opacity-0'}`} />
        <div className={`pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#24160d] to-transparent transition-opacity ${edges.right ? 'opacity-100' : 'opacity-0'}`} />
      </div>
    </section>
  );
};

const GameShelf = () => {
  const reduce = useReducedMotion();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState(null);

  const shelves = useMemo(() => {
    const byPlatform = new Map();
    for (const g of data.games) {
      if (!byPlatform.has(g.platform)) byPlatform.set(g.platform, []);
      byPlatform.get(g.platform).push(g);
    }
    return ORDER.filter((p) => byPlatform.has(p)).map((p) => ({
      platform: p,
      games: byPlatform.get(p).sort((a, b) => a.title.localeCompare(b.title)),
    }));
  }, []);

  const visible = filter === 'all' ? shelves : shelves.filter((s) => s.platform === filter);
  const anyCover = data.games.some((g) => g.cover);
  let n = 0;

  return (
    <div>
      {/* filters */}
      <div className="mb-5 flex flex-wrap gap-2 font-mono text-xs" role="group" aria-label="Filter by platform">
        {['all', ...shelves.map((s) => s.platform)].map((p) => (
          <button
            key={p}
            type="button"
            onClick={() => setFilter(p)}
            aria-pressed={filter === p}
            className={`rounded border px-3 py-1.5 transition-colors ${
              filter === p
                ? 'border-accent/60 bg-accent/10 text-accent'
                : 'border-white/10 text-white/60 hover:border-accent/40 hover:text-white'
            }`}
          >
            {p === 'all' ? `all (${data.games.length})` : p}
          </button>
        ))}
      </div>

      {/* label of the selected case: fixed height so the shelves below never move */}
      <div
        className="mb-6 h-[156px] overflow-hidden rounded-md border border-white/10 bg-primary/70 p-4 font-mono text-[13px] leading-6"
        aria-live="polite"
      >
        {selected ? (
          <>
            <p className="truncate text-white/40">
              <span className="text-success">vicente@portfolio</span>:
              <span className="text-accent">~/collection/games</span>$ cat{' '}
              {selected.id}.txt
            </p>
            <p className="line-clamp-2">
              <span className="text-white/40">title:    </span>
              <span className="text-white">{selected.title}</span>
            </p>
            <p className="truncate">
              <span className="text-white/40">platform: </span>
              <span className="text-accent">{selected.platform}</span>
              {selected.year && (
                <>
                  <span className="text-white/40">   year: </span>
                  {selected.year}
                </>
              )}
            </p>
            {selected.note && (
              <p className="truncate">
                <span className="text-white/40">note:     </span>
                {selected.note}
              </p>
            )}
          </>
        ) : (
          <p className="text-white/40">
            <span className="text-success">vicente@portfolio</span>:
            <span className="text-accent">~/collection/games</span>$ ls{' '}
            <span className="animate-blink">_</span>
            <br />
            pick a game to read its label
          </p>
        )}
      </div>

      {/* shelves: one row per platform */}
      <div className="space-y-7">
        {visible.map((shelf) => {
          const startIndex = n;
          n += shelf.games.length;
          return (
            <ShelfRow
              key={shelf.platform}
              shelf={shelf}
              startIndex={startIndex}
              reduce={reduce}
              selected={selected}
              onSelect={setSelected}
            />
          );
        })}
      </div>

      {anyCover && (
        <p className="mt-8 font-mono text-[11px] text-white/30">
          Game data and cover art from{' '}
          <a href="https://www.igdb.com" target="_blank" rel="noopener noreferrer" className="underline underline-offset-2 hover:text-accent">
            IGDB
          </a>
          .
        </p>
      )}
    </div>
  );
};

export default GameShelf;
