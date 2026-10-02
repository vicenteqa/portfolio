import Link from 'next/link';

//components
import Nav from './Nav';
import MobileNav from './MobileNav';
import PaletteButton from './PaletteButton';
import { Button } from './ui/button';

const Header = () => {
  return (
    <header className="py-6 xl:py-8 text-white relative z-50">
      <div className="container mx-auto flex justify-between items-center">
        {/* logo */}
        <Link href="/" className="group flex items-baseline" aria-label="Vicente, home">
          <span className="font-display text-3xl xl:text-4xl font-bold tracking-tight">
            vicente
          </span>
          <span
            aria-hidden
            className="ml-1 inline-block w-[0.5em] h-[0.9em] translate-y-[0.1em] bg-accent animate-blink group-hover:bg-white"
          />
        </Link>
        {/* desktop nav & contact */}
        <div className="hidden xl:flex items-center gap-8">
          <Nav />
          <PaletteButton />
          <Button asChild>
            <Link href="/contact">Contact</Link>
          </Button>
        </div>
        {/* mobile nav */}
        <div className="xl:hidden flex items-center gap-3">
          <PaletteButton compact />
          <MobileNav />
        </div>
      </div>
    </header>
  );
};

export default Header;
