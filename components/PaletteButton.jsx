'use client';

import { FiSearch } from 'react-icons/fi';

const PaletteButton = ({ compact = false }) => (
  <button
    type="button"
    onClick={() => window.dispatchEvent(new Event('palette:open'))}
    aria-label="Open command palette"
    className={
      compact
        ? 'w-10 h-10 rounded border border-white/15 flex items-center justify-center text-white/70 hover:text-accent hover:border-accent/60 transition-colors'
        : 'flex items-center gap-2 h-10 pl-3 pr-2 rounded border border-white/15 text-white/50 hover:text-white hover:border-accent/60 transition-colors font-mono text-xs'
    }
  >
    <FiSearch className={compact ? 'text-lg' : 'text-sm'} />
    {!compact && (
      <>
        <span>Jump to</span>
        <kbd className="ml-2 px-1.5 py-0.5 rounded-sm bg-white/10 text-[10px] text-white/70">
          Ctrl K
        </kbd>
      </>
    )}
  </button>
);

export default PaletteButton;
