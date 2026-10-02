'use client';

import Image from 'next/image';

// The avatar is the label of a record. Only the sheen spins: the grooves are
// rotation-invariant, so turning them would show nothing.
const HeroRecord = () => (
  <div
    className="relative aspect-square w-full"
    data-testid="photo-container"
    role="img"
    aria-label="Illustrated portrait of Vicente Ruiz on a vinyl record label"
  >
    {/* glow */}
    <div className="absolute -inset-6 rounded-full bg-accent/10 blur-3xl" />

    {/* vinyl */}
    <div
      className="absolute inset-0 rounded-full shadow-[8px_8px_0_0_rgba(0,0,0,0.45)]"
      style={{
        background:
          'repeating-radial-gradient(circle at center, #05080c 0 2px, #101820 3px 4px)',
      }}
    >
      <div
        className="absolute inset-0 rounded-full animate-[spin360_9s_linear_infinite]"
        style={{
          background:
            'conic-gradient(from 20deg, transparent 0 18%, rgba(255,255,255,.14) 26%, transparent 34% 68%, rgba(41,212,255,.16) 76%, transparent 84%)',
        }}
      />
      {/* bright rim */}
      <div className="absolute inset-0 rounded-full ring-1 ring-white/10" />
      {/* run-out groove */}
      <div className="absolute inset-[34%] rounded-full ring-1 ring-white/5" />
    </div>

    {/* ring of text between grooves and label */}
    <svg viewBox="0 0 200 200" className="absolute inset-0 w-full h-full" aria-hidden>
      <defs>
        <path id="ring" d="M100,100 m-66,0 a66,66 0 1,1 132,0 a66,66 0 1,1 -132,0" />
      </defs>
      <text
        fill="rgba(255,255,255,0.35)"
        fontSize="6.4"
        letterSpacing="2.4"
        fontFamily="var(--font-mono), monospace"
      >
        <textPath href="#ring">
          VICENTE RUIZ · SOFTWARE DEVELOPMENT ENGINEER IN TEST · 33⅓ RPM · SIDE A ·
        </textPath>
      </text>
    </svg>

    {/* label */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[46%] aspect-square rounded-full overflow-hidden bg-gradient-to-br from-accent via-[#4fdcff] to-[#1d9bf0] shadow-[inset_0_0_0_3px_rgba(11,18,26,0.35)]">
      <Image
        src="/assets/photo.png"
        alt="Vicente Ruiz profile photo"
        priority
        quality={100}
        fill
        sizes="(min-width: 1200px) 220px, 140px"
        className="object-cover scale-[1.35] translate-y-[8%] mix-blend-multiply"
        data-testid="photo"
      />
    </div>
    {/* spindle hole */}
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[3%] aspect-square rounded-full bg-ink ring-2 ring-white/20" />
  </div>
);

export default HeroRecord;
