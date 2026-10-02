// Shared heading for inner pages: a bash prompt, display title, short intro.
const PageHeader = ({ label, children, intro, className = '' }) => (
  <header className={`mb-8 xl:mb-12 ${className}`}>
    <p className="eyebrow mb-3 normal-case tracking-normal text-sm">
      <span className="text-success">vicente@portfolio</span>
      <span className="text-white/60">:</span>
      <span className="text-accent">{`~/${label.replace(/\s+/g, '-')}`}</span>
      <span className="text-white/60">$</span>
    </p>
    <h1 className="h2 mb-4">{children}</h1>
    {intro && <p className="text-white/60 text-lg max-w-2xl">{intro}</p>}
  </header>
);

export default PageHeader;
