import Link from 'next/link';
import HeroRecord from '@/components/HeroRecord';
import ReportCard from '@/components/ReportCard';
import Social from '@/components/Social';
import { Button } from '@/components/ui/button';
import { FiDownload } from 'react-icons/fi';
import { yearsInQA } from '@/lib/career';

// re-render daily so the years of experience never go stale
export const revalidate = 86400;

const Home = () => {
  const years = yearsInQA();
  return (
    <section className="relative">
      <div className="container mx-auto">
        <div className="grid xl:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)] gap-12 xl:gap-8 items-center xl:min-h-[calc(100vh-190px)] pb-8">
          {/* text */}
          <div className="text-center xl:text-left order-2 xl:order-none">
            <p className="eyebrow mb-5 normal-case tracking-normal text-sm">
              <span className="text-success">vicente@portfolio</span>
              <span className="text-white/60">:</span>
              <span className="text-accent">~</span>
              <span className="text-white/60">$ </span>
              <span className="text-white/80">whoami</span>
            </p>
            <h1 className="h1 mb-7">
              Hi, I'm <span className="text-accent">Vicente</span>.
              <br />
              I do QA and
              <br />
              <span className="text-outline text-transparent">automation.</span>
            </h1>
            <p className="max-w-[520px] mx-auto xl:mx-0 mb-9 text-white/70 text-lg">
              {years}+ years in QA. Now at SUSE, automating the validation of
              package releases.
            </p>
            {/* buttons and socials */}
            <div className="flex flex-col sm:flex-row items-center justify-center xl:justify-start gap-6">
              <a
                href="/assets/resume/vicente_cv_web.pdf"
                download="vicente_cv_web.pdf"
                data-umami-event="download-cv"
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="lg"
                  className="flex items-center gap-2 whitespace-nowrap"
                  data-testid="download-cv"
                >
                  <span>Download CV</span>
                  <FiDownload className="text-lg" />
                </Button>
              </a>
              <Button asChild variant="primary" size="lg">
                <Link href="/contact">Say hello</Link>
              </Button>
              <Social
                ContainerStyles="flex gap-3"
                iconStyles="w-11 h-11 border border-white/15 rounded flex justify-center items-center text-white/70 text-lg hover:border-accent hover:text-accent hover:-translate-y-0.5 transition-all duration-200"
              />
            </div>
          </div>

          {/* record + report */}
          <div className="order-1 xl:order-none relative mx-auto w-full max-w-[300px] sm:max-w-[400px] xl:max-w-[430px]">
            <HeroRecord />
            <div className="relative mt-8 left-1/2 -translate-x-1/2 w-[min(92vw,410px)] xl:mt-0 xl:left-auto xl:translate-x-0 xl:absolute xl:-bottom-[120px] xl:-left-16">
              <ReportCard />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Home;
