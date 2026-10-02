'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import {
  animate,
  motion,
  useMotionValue,
  useReducedMotion,
} from 'framer-motion';
import { FaChevronDown, FaChevronUp, FaPlay } from 'react-icons/fa';

const STEP = 30; // px of each sleeve left visible behind the front one
const BEHIND = 6; // sleeves rendered behind the active one
const FLIPPED = 2; // sleeves kept mounted after being flipped past
const PANEL_H = 112;
const CARD_BOTTOM = 72; // card base sits this far above the crate bottom
const LIFT = 70; // how far the pulled sleeve rises
const SNAP_RADIUS = 0.5; // of platter width: how close the drop must be

const pad = (n) => String(n).padStart(2, '0');

// Black vinyl with grooves, a sheen and the album cover as the centre label.
const Vinyl = ({ album, spinning }) => (
  <motion.div
    aria-hidden
    className="absolute inset-0 rounded-full shadow-2xl"
    style={{
      background:
        'repeating-radial-gradient(circle at center, #080b0f 0 2px, #141b23 3px 4px)',
    }}
    animate={{ rotate: spinning ? 360 : 0 }}
    transition={
      spinning
        ? { repeat: Infinity, duration: 3.5, ease: 'linear' }
        : { duration: 0 }
    }
  >
    <div
      className="absolute inset-0 rounded-full"
      style={{
        background:
          'conic-gradient(from 30deg, transparent 0 20%, rgba(255,255,255,.10) 28%, transparent 36% 70%, rgba(255,255,255,.08) 78%, transparent 86%)',
      }}
    />
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[34%] aspect-square rounded-full overflow-hidden bg-accent">
      <Image
        src={album.cover}
        alt=""
        fill
        sizes="120px"
        draggable={false}
        className="object-cover"
      />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[12%] aspect-square rounded-full bg-primary" />
    </div>
  </motion.div>
);

// Classic S-less straight arm: chrome tube, counterweight, headshell.
// Drawn on the plinth (100x100 box); pivot at (88,16). Rotation 0 = needle on
// the record, negative swings it out to the rest on the right.
const Tonearm = ({ playing, reduce }) => (
  <motion.div
    aria-hidden
    className="absolute inset-0 pointer-events-none z-10"
    style={{ transformOrigin: '88% 16%' }}
    initial={false}
    animate={{ rotate: playing ? 0 : -30 }}
    transition={
      reduce
        ? { duration: 0 }
        : { type: 'spring', stiffness: 70, damping: 14, delay: playing ? 0.15 : 0 }
    }
  >
    <svg viewBox="0 0 100 100" className="w-full h-full overflow-visible">
      <defs>
        <linearGradient id="chrome" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0" stopColor="#7d8d9e" />
          <stop offset="0.45" stopColor="#f4f8fc" />
          <stop offset="1" stopColor="#8697a8" />
        </linearGradient>
        <radialGradient id="chromeDisc" cx="0.35" cy="0.3" r="0.9">
          <stop offset="0" stopColor="#fbfdff" />
          <stop offset="0.6" stopColor="#9fb0c1" />
          <stop offset="1" stopColor="#5d6d7e" />
        </radialGradient>
      </defs>
      <g transform="rotate(25.7 88 16)">
        {/* counterweight */}
        <rect x="83.5" y="3" width="9" height="9" rx="2" fill="url(#chrome)" stroke="#4a5866" strokeWidth="0.4" />
        <rect x="83.5" y="6.5" width="9" height="1" fill="#2c3641" opacity="0.5" />
        {/* tube */}
        <rect x="86.9" y="12" width="2.2" height="58" rx="1.1" fill="url(#chrome)" stroke="#4a5866" strokeWidth="0.3" />
        {/* headshell */}
        <path d="M85 69 L91.5 69 L90.6 79 L85.9 79 Z" fill="#1d2630" stroke="#4a5866" strokeWidth="0.4" />
        <rect x="86.2" y="70" width="4" height="1.6" fill="#29d4ff" />
        <rect x="87.8" y="79" width="0.8" height="2.2" fill="#cfd9e3" />
      </g>
      {/* pivot base */}
      <circle cx="88" cy="16" r="9.5" fill="url(#chromeDisc)" stroke="#3a4654" strokeWidth="0.5" />
      <circle cx="88" cy="16" r="5.2" fill="#202a35" stroke="#7d8d9e" strokeWidth="0.5" />
      <circle cx="88" cy="16" r="1.8" fill="url(#chromeDisc)" />
    </svg>
  </motion.div>
);

const CrateDigger = ({ albums }) => {
  const [active, setActive] = useState(0);
  const [pulled, setPulled] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [over, setOver] = useState(false);
  const [onPlatter, setOnPlatter] = useState(null);
  const reduce = useReducedMotion();
  const crateRef = useRef(null);
  const discRef = useRef(null);
  const platterRef = useRef(null);
  const touchY = useRef(null);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const last = albums.length - 1;
  const current = albums[active];

  const go = useCallback(
    (delta) => {
      setPulled(false);
      setActive((i) => (i + delta + albums.length) % albums.length);
    },
    [albums.length]
  );

  // Wheel: non-passive so we can keep the page from scrolling while digging.
  // The crate loops, so there is no end to release the event at.
  useEffect(() => {
    const el = crateRef.current;
    if (!el) return;
    let acc = 0;
    let lock = 0;
    const onWheel = (e) => {
      e.preventDefault();
      const now = performance.now();
      if (now - lock < 110) return;
      acc += e.deltaY;
      if (Math.abs(acc) > 40) {
        go(Math.sign(acc));
        acc = 0;
        lock = now;
      }
    };
    el.addEventListener('wheel', onWheel, { passive: false });
    return () => el.removeEventListener('wheel', onWheel);
  }, [go]);

  const centerOf = (el) => {
    const r = el.getBoundingClientRect();
    return { x: r.left + r.width / 2, y: r.top + r.height / 2, w: r.width };
  };

  // Slide the pulled record onto the platter; the spinning record then links out.
  const placeOnPlatter = useCallback(() => {
    const disc = discRef.current;
    const platter = platterRef.current;
    if (!disc || !platter) return;
    const album = current;
    const d = centerOf(disc);
    const p = centerOf(platter);

    setDragging(false);
    setOver(false);
    const to = reduce ? { duration: 0 } : { type: 'spring', stiffness: 220, damping: 24 };
    Promise.all([
      animate(x, x.get() + (p.x - d.x), to),
      animate(y, y.get() + (p.y - d.y), to),
    ]).then(() => {
      setOnPlatter(album);
      setPulled(false);
      x.set(0);
      y.set(0);
    });
  }, [current, reduce, x, y]);

  const nearPlatter = () => {
    const d = centerOf(discRef.current);
    const p = centerOf(platterRef.current);
    return Math.hypot(d.x - p.x, d.y - p.y) < p.w * SNAP_RADIUS;
  };

  const onDrag = () => {
    if (discRef.current && platterRef.current) setOver(nearPlatter());
  };

  const onDragEnd = () => {
    if (nearPlatter()) {
      placeOnPlatter();
    } else {
      setDragging(false);
      setOver(false);
      animate(x, 0, { type: 'spring', stiffness: 260, damping: 26 });
      animate(y, 0, { type: 'spring', stiffness: 260, damping: 26 });
    }
  };

  const onKeyDown = (e) => {
    const toggle = () => (pulled ? placeOnPlatter() : setPulled(true));
    const keys = {
      ArrowDown: () => go(1),
      ArrowRight: () => go(1),
      ArrowUp: () => go(-1),
      ArrowLeft: () => go(-1),
      Home: () => (setPulled(false), setActive(0)),
      End: () => (setPulled(false), setActive(last)),
      Enter: toggle,
      ' ': toggle,
      Escape: () => setPulled(false),
    };
    if (keys[e.key]) {
      e.preventDefault();
      keys[e.key]();
    }
  };

  const onTouchStart = (e) => {
    touchY.current = e.touches[0].clientY;
  };
  const onTouchMove = (e) => {
    if (touchY.current === null) return;
    const ty = e.touches[0].clientY;
    const dy = touchY.current - ty;
    if (Math.abs(dy) > 36) {
      go(Math.sign(dy));
      touchY.current = ty;
    }
  };

  const spring = reduce
    ? { duration: 0 }
    : { type: 'spring', stiffness: 260, damping: 26, mass: 0.8 };

  return (
    <div
      className="flex flex-col items-center"
      style={{ '--s': 'min(68vw, 300px)' }}
    >
      <div className="flex flex-col xl:flex-row items-center xl:items-end gap-12 xl:gap-16">
        {/* ---------- crate ---------- */}
        <div
          ref={crateRef}
          tabIndex={0}
          role="group"
          aria-roledescription="record crate"
          aria-label="Vinyl crate. Use arrow keys to flip through records, Enter to pull one out and Enter again to put it on the turntable."
          onKeyDown={onKeyDown}
          onTouchStart={onTouchStart}
          onTouchMove={onTouchMove}
          onTouchEnd={() => (touchY.current = null)}
          className="relative select-none outline-none focus-visible:ring-2 focus-visible:ring-accent/60 rounded-md"
          style={{
            width: 'var(--s)',
            height: `calc(var(--s) + ${BEHIND * STEP}px + ${CARD_BOTTOM}px + 40px)`,
            perspective: 1100,
            zIndex: 10, // keep the dragged record above the turntable
            touchAction: 'none',
          }}
        >
          {albums.map((album, i) => {
            // circular offset from the active record: 0..BEHIND behind it,
            // -FLIPPED..-1 already flipped past
            const n = albums.length;
            const m = (((i - active) % n) + n) % n;
            const d = m >= n - FLIPPED ? m - n : m;
            if (d < -FLIPPED || d > BEHIND) return null;

            const isActive = d === 0;
            const isPulled = isActive && pulled;

            // sleeves further back are darkened with an opacity layer: far cheaper to
            // animate than a CSS filter on 9 images at once
            const dim = d < 0 ? 0.4 : isActive ? 0 : d * 0.09;
            let target;
            if (d < 0) {
              // flipped forward, falling toward the viewer
              target = {
                y: 130,
                rotateX: -80,
                scale: 1,
                opacity: 0,
              };
            } else if (isActive) {
              target = {
                y: isPulled ? -LIFT : 0,
                rotateX: 0,
                scale: isPulled ? 1.04 : 1,
                opacity: 1,
              };
            } else {
              target = {
                y: -d * STEP,
                rotateX: 0,
                scale: 1 - d * 0.035,
                opacity: 1,
              };
            }

            return (
              <motion.button
                key={album.id}
                type="button"
                tabIndex={-1}
                aria-label={`${album.name} by ${album.artists}`}
                onClick={() => {
                  if (d > 0) {
                    setActive(i);
                    setPulled(false);
                  } else if (isActive) {
                    setPulled((p) => !p);
                  }
                }}
                initial={false}
                animate={target}
                whileHover={isActive && !pulled && !reduce ? { y: -14 } : undefined}
                transition={spring}
                className="absolute left-0 w-full aspect-square block"
                style={{
                  bottom: CARD_BOTTOM,
                  transformOrigin: 'bottom center',
                  // active 20 > pulled record 15 > sleeves behind (<10)
                  zIndex: d < 0 ? 12 : 20 - (d === 0 ? 0 : 10 + d),
                  pointerEvents: d < 0 ? 'none' : 'auto',
                }}
              >
                <div className="relative w-full h-full overflow-hidden rounded-md border border-white/10 bg-primary shadow-[0_8px_24px_rgba(0,0,0,0.55)]">
                  <Image
                    src={album.cover}
                    alt=""
                    fill
                    sizes="300px"
                    priority={i < 3}
                    draggable={false}
                    className="object-cover"
                  />
                  {/* sleeve label, only readable on the visible strip */}
                  <div
                    className={`absolute inset-x-0 top-0 px-3 flex items-center bg-gradient-to-b from-black/80 to-transparent text-left text-[11px] font-body text-white/90 truncate transition-opacity duration-300 ${
                      d > 0 ? 'opacity-100' : 'opacity-0'
                    }`}
                    style={{ height: STEP }}
                  >
                    <span className="truncate">
                      {album.artists} <span className="text-white/50">·</span>{' '}
                      {album.name}
                    </span>
                  </div>
                  <motion.span
                    aria-hidden
                    className="pointer-events-none absolute inset-0 bg-black"
                    initial={false}
                    animate={{ opacity: dim }}
                    transition={spring}
                  />
                </div>
              </motion.button>
            );
          })}

          {/* the record pulled out of the sleeve: drag it onto the turntable */}
          {pulled && (
            <motion.div
              key={current.id}
              ref={discRef}
              drag
              dragMomentum={false}
              dragElastic={0.12}
              style={{
                x,
                y,
                position: 'absolute',
                left: '4%',
                width: '92%',
                aspectRatio: '1',
                // sits where the in-sleeve disc ends up once the sleeve is lifted
                bottom: `calc(var(--s) * 0.48 + ${CARD_BOTTOM + LIFT}px)`,
                zIndex: dragging ? 50 : 15,
                cursor: dragging ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              whileDrag={{ scale: 1.06 }}
              onDragStart={() => setDragging(true)}
              onDrag={onDrag}
              onDragEnd={onDragEnd}
              onTap={placeOnPlatter}
              onTouchStart={(e) => e.stopPropagation()}
              onTouchMove={(e) => e.stopPropagation()}
              role="button"
              aria-label={`Drag ${current.name} onto the turntable, or press Enter, to put it on the turntable`}
            >
              <Vinyl album={current} spinning={!reduce} />
            </motion.div>
          )}

          {/* crate front panel: hides the bottom of the records, shows the info */}
          <div
            className="absolute -inset-x-3.5 bottom-0 z-40 rounded-md border border-white/10 px-5 py-4 flex items-center gap-3 shadow-[0_-14px_30px_rgba(0,0,0,0.55)]"
            style={{
              height: PANEL_H,
              backgroundColor: '#0f1822',
              backgroundImage:
                'repeating-linear-gradient(90deg, rgba(255,255,255,.035) 0 2px, transparent 2px 9px), linear-gradient(to bottom, #1c2a39, #0d141c)',
            }}
          >
            <div className="min-w-0 flex-1" aria-live="polite">
              <p className="font-mono text-[11px] tracking-[0.2em] text-accent mb-1">
                NO. {pad(active + 1)} / {pad(albums.length)}
              </p>
              <p className="font-display font-bold text-white text-base leading-tight line-clamp-1">
                {current.name}
              </p>
              <p className="font-body text-xs text-white/60 line-clamp-1">
                {current.artists}
              </p>
            </div>

            <div className="flex flex-col gap-1">
              <button
                type="button"
                onClick={() => go(-1)}
                aria-label="Previous record"
                className="w-8 h-8 rounded-full bg-white/5 text-white/80 flex items-center justify-center hover:bg-accent/20 hover:text-accent transition-colors"
              >
                <FaChevronUp className="text-xs" />
              </button>
              <button
                type="button"
                onClick={() => go(1)}
                aria-label="Next record"
                className="w-8 h-8 rounded-full bg-white/5 text-white/80 flex items-center justify-center hover:bg-accent/20 hover:text-accent transition-colors"
              >
                <FaChevronDown className="text-xs" />
              </button>
            </div>

            <a
              href={current.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`Open ${current.name}`}
              className="w-11 h-11 rounded-full bg-accent text-primary flex items-center justify-center hover:bg-accent-hover transition-colors"
            >
              <FaPlay className="text-lg ml-0.5" />
            </a>
          </div>
        </div>

        {/* ---------- turntable ---------- */}
        <div className="flex flex-col items-center xl:mb-2">
          {/* walnut plinth */}
          <div
            className={`relative rounded-md border border-black/60 transition-shadow duration-200 ${
              over
                ? 'shadow-[0_0_44px_rgba(41,212,255,0.4)]'
                : 'shadow-[0_18px_34px_rgba(0,0,0,0.6)]'
            }`}
            style={{
              width: 'calc(var(--s) * 1.22)',
              height: 'calc(var(--s) * 1.22)',
              backgroundColor: '#3a2415',
              backgroundImage:
                'repeating-linear-gradient(92deg, rgba(0,0,0,.16) 0 1px, transparent 1px 6px), repeating-linear-gradient(88deg, rgba(255,210,160,.05) 0 2px, transparent 2px 13px), linear-gradient(135deg, #5d3b22, #3a2415 55%, #2b1a0f)',
            }}
          >
            <span
              aria-hidden
              className="absolute inset-0 rounded-md pointer-events-none"
              style={{ boxShadow: 'inset 0 1px 0 rgba(255,225,190,.18), inset 0 -2px 6px rgba(0,0,0,.45)' }}
            />

            {/* platter + record: centred, same size as the pulled record */}
            <div
              ref={platterRef}
              className="absolute"
              style={{
                width: 'var(--s)',
                height: 'var(--s)',
                left: 'calc(var(--s) * 0.11)',
                top: 'calc(var(--s) * 0.11)',
              }}
            >
              {/* aluminium platter with strobe dots on its rim */}
              <div
                className="absolute inset-0 rounded-full"
                style={{
                  background:
                    'radial-gradient(circle at 35% 30%, #e9eff5, #9aabbb 55%, #6b7c8d)',
                  boxShadow: '0 4px 14px rgba(0,0,0,.55), inset 0 0 0 1px rgba(0,0,0,.35)',
                }}
              >
                <div
                  className="absolute inset-[1.2%] rounded-full opacity-60"
                  style={{
                    background:
                      'repeating-conic-gradient(#1b232c 0 1.2deg, transparent 1.2deg 4.8deg)',
                    WebkitMask: 'radial-gradient(circle, transparent 94.5%, #000 95%)',
                    mask: 'radial-gradient(circle, transparent 94.5%, #000 95%)',
                  }}
                />
              </div>
              {/* rubber mat */}
              <div className="absolute inset-[4.5%] rounded-full bg-[#17191c] shadow-[inset_0_2px_8px_rgba(0,0,0,.8)] flex items-center justify-center">
                {!onPlatter && (
                  <div
                    className={`w-[62%] aspect-square rounded-full border-2 border-dashed flex items-end justify-center text-center px-6 pb-[16%] font-mono text-[10px] tracking-[0.15em] transition-colors duration-200 ${
                      over ? 'border-accent text-accent' : 'border-white/15 text-white/25'
                    }`}
                  >
                    DROP A RECORD HERE
                  </div>
                )}
              </div>
              {/* the record: spinning, and the link to the album */}
              {onPlatter && (
                <a
                  href={onPlatter.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`Open ${onPlatter.name} by ${onPlatter.artists}`}
                  title="Play"
                  data-umami-event="open-album"
                  className="group absolute inset-[4%] rounded-full cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent transition-shadow hover:shadow-[0_0_0_2px_rgba(41,212,255,0.7),0_0_28px_rgba(41,212,255,0.35)]"
                >
                  <Vinyl album={onPlatter} spinning={!reduce} />
                  <span className="absolute inset-0 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 group-focus-visible:opacity-100 transition-opacity bg-black/40 pointer-events-none">
                    <FaPlay className="text-accent text-3xl ml-1" />
                  </span>
                </a>
              )}
              {/* spindle */}
              <div
                aria-hidden
                hidden={!!onPlatter}
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3.4%] aspect-square rounded-full pointer-events-none"
                style={{ background: 'radial-gradient(circle at 35% 30%, #fff, #8fa0b2 70%)' }}
              />
            </div>

            {/* controls strip: power knob, LED, speed buttons */}
            <div
              aria-hidden
              className="absolute flex items-center justify-between"
              style={{
                left: 'calc(var(--s) * 0.09)',
                right: 'calc(var(--s) * 0.09)',
                bottom: 'calc(var(--s) * 0.022)',
              }}
            >
              <div className="flex items-center gap-3">
                <div
                  className="w-6 h-6 rounded-full border border-black/50 relative"
                  style={{ background: 'radial-gradient(circle at 35% 30%, #f4f8fc, #7d8d9e)' }}
                >
                  <span className="absolute left-1/2 top-[3px] -translate-x-1/2 w-[2px] h-2 rounded bg-[#1d2630]" />
                </div>
                <span
                  className={`w-2 h-2 rounded-full transition-colors ${
                    onPlatter
                      ? 'bg-accent shadow-[0_0_8px_#29d4ff]'
                      : 'bg-[#16303a]'
                  }`}
                />
              </div>
              <div className="flex gap-1.5 font-mono text-[9px]">
                <span className="px-1.5 py-0.5 rounded-sm bg-[#cfd9e3] text-[#1d2630] shadow-[inset_0_-1px_0_rgba(0,0,0,.3)]">33</span>
                <span className="px-1.5 py-0.5 rounded-sm bg-[#2a3441] text-white/50 shadow-[inset_0_1px_0_rgba(255,255,255,.1)]">45</span>
              </div>
            </div>

            {/* arm rest + tonearm */}
            <div
              aria-hidden
              className="absolute rounded-sm bg-[#1d2630] border border-black/50"
              style={{ right: '1.5%', top: '66%', width: '3.2%', height: '9%' }}
            />
            <Tonearm playing={!!onPlatter} reduce={reduce} />
          </div>

          <div
            className="mt-4 h-14 text-center"
            style={{ width: 'calc(var(--s) * 1.22)' }}
            aria-live="polite"
          >
            {onPlatter ? (
              <>
                <p className="font-mono text-[11px] tracking-[0.2em] text-accent">
                  NOW SPINNING
                </p>
                <p className="font-body text-xs text-white/70 line-clamp-1">
                  {onPlatter.artists} · {onPlatter.name}
                </p>
                <p className="mt-1 font-body text-[11px] text-white/40">
                  Click the record to play it ·{' '}
                  <button
                    type="button"
                    onClick={() => setOnPlatter(null)}
                    className="text-white/60 hover:text-white underline underline-offset-2"
                  >
                    Lift record
                  </button>
                </p>
              </>
            ) : (
              <p className="font-mono text-[11px] tracking-[0.2em] text-white/30 pt-2">
                TURNTABLE
              </p>
            )}
          </div>
        </div>
      </div>

      <p className="mt-8 text-center text-xs font-body text-white/40 max-w-sm">
        Scroll, swipe or use the arrow keys to dig. Click the front record to
        pull it out, then drag the vinyl onto the turntable. Click the
        spinning record to play it.
      </p>
    </div>
  );
};

export default CrateDigger;
