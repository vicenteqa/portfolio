// A tiling-WM / GNOME style title bar: title on the left, flat glyph buttons
// on the right. Decorative.
const WindowBar = ({ title }) => (
  <div className="flex items-center justify-between border-b border-white/10 bg-black/30 pl-3 font-mono text-[11px] text-white/50">
    <span className="truncate py-1.5">{title}</span>
    <div className="flex shrink-0" aria-hidden>
      {['─', '□', '✕'].map((g, i) => (
        <span
          key={g}
          className={`w-8 py-1.5 text-center border-l border-white/10 ${i === 2 ? 'hover:bg-error/80 hover:text-ink' : ''}`}
        >
          {g}
        </span>
      ))}
    </div>
  </div>
);

export default WindowBar;
