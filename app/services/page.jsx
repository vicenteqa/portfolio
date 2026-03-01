'use client';
import { BsArrowDownRight } from 'react-icons/bs';
import {
  FaRobot,
  FaChartLine,
  FaCogs,
  FaBolt,
  FaCheckCircle,
  FaCode
} from 'react-icons/fa';
import Link from 'next/link';
import { motion } from 'framer-motion';

const services = [
  {
    num: '01',
    title: 'Test Automation Strategy',
    description:
      'Design and implement comprehensive test automation frameworks using industry-leading tools like Playwright, Selenium, and Cypress. Build scalable, maintainable test suites that reduce manual testing overhead and accelerate release cycles.',
    icon: FaRobot,
    highlights: ['Playwright', 'Selenium', 'Cypress', 'Custom Frameworks'],
    href: '',
  },
  {
    num: '02',
    title: 'Quality Engineering Consulting',
    description:
      'Strategic guidance to transform your QA processes. Implement shift-left testing, establish quality gates, and build a culture of quality ownership across development teams. Optimize testing strategies for maximum ROI.',
    icon: FaChartLine,
    highlights: ['Test Strategy', 'Process Optimization', 'Team Training', 'Quality Metrics'],
    href: '',
  },
  {
    num: '03',
    title: 'CI/CD Pipeline Integration',
    description:
      'Integrate automated testing seamlessly into your deployment pipeline. Configure parallel test execution, flaky test detection, and comprehensive reporting. Enable continuous testing for true DevOps practices.',
    icon: FaCogs,
    highlights: ['GitHub Actions', 'Jenkins', 'Docker', 'Test Reporting'],
    href: '',
  },
  {
    num: '04',
    title: 'Performance & Load Testing',
    description:
      'Ensure your applications perform under real-world conditions. Design and execute performance test scenarios, identify bottlenecks, and provide actionable optimization recommendations for scalability.',
    icon: FaBolt,
    highlights: ['k6', 'JMeter', 'Performance Analysis', 'Scalability'],
    href: '',
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const Services = () => {
  return (
    <section className="min-h-[80vh] flex flex-col justify-center py-12 xl:py-0 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 right-20 w-96 h-96 bg-accent rounded-full blur-[120px]"></div>
        <div className="absolute bottom-20 left-20 w-96 h-96 bg-amber rounded-full blur-[120px]"></div>
      </div>

      <div className="container mx-auto relative z-10">
        {/* Section header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-16 text-center xl:text-left"
        >
          <h1 className="text-4xl xl:text-6xl font-display font-bold mb-4">
            <span className="text-white">Quality Engineering</span>{' '}
            <span className="text-accent">Services</span>
          </h1>
          <p className="text-white/60 font-body text-lg max-w-2xl">
            Elevate your software quality with strategic testing solutions that drive reliability, speed, and confidence.
          </p>
        </motion.div>

        {/* Services grid */}
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 md:grid-cols-2 gap-8"
        >
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={index}
                variants={itemVariants}
                className="group relative"
              >
                {/* Card background with gradient border effect */}
                <div className="absolute inset-0 bg-gradient-to-br from-accent/20 via-transparent to-amber/20 rounded-2xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 blur-xl"></div>

                <div className="relative bg-[#1a1a1f] border border-white/10 rounded-2xl p-8 h-full flex flex-col transition-all duration-500 group-hover:border-accent/50 group-hover:shadow-2xl group-hover:shadow-accent/10">
                  {/* Top section with number and icon */}
                  <div className="flex items-start justify-between mb-6">
                    <div className="flex items-center gap-4">
                      <div className="text-6xl font-display font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-accent to-accent/40 group-hover:from-accent group-hover:to-amber transition-all duration-500">
                        {service.num}
                      </div>
                      <div className="w-14 h-14 rounded-xl bg-accent/10 group-hover:bg-accent/20 flex items-center justify-center transition-all duration-500 group-hover:scale-110">
                        <IconComponent className="text-accent text-2xl group-hover:rotate-12 transition-transform duration-500" />
                      </div>
                    </div>

                    <Link
                      href={service.href || '#'}
                      className="w-12 h-12 rounded-full bg-white/5 group-hover:bg-accent border border-white/10 group-hover:border-accent transition-all duration-500 flex justify-center items-center hover:-rotate-45 group-hover:shadow-lg group-hover:shadow-accent/50"
                    >
                      <BsArrowDownRight className="text-white group-hover:text-primary text-xl transition-colors duration-500" />
                    </Link>
                  </div>

                  {/* Title */}
                  <h2 className="text-2xl xl:text-3xl font-display font-bold leading-tight text-white group-hover:text-accent transition-all duration-500 mb-4">
                    {service.title}
                  </h2>

                  {/* Description */}
                  <p className="text-white/60 font-body leading-relaxed mb-6 flex-grow">
                    {service.description}
                  </p>

                  {/* Highlights/Tech stack */}
                  <div className="flex flex-wrap gap-2 pt-4 border-t border-white/10">
                    {service.highlights.map((highlight, idx) => (
                      <span
                        key={idx}
                        className="px-3 py-1 text-xs font-primary font-medium bg-accent/10 text-accent rounded-full border border-accent/20 group-hover:bg-accent/20 group-hover:border-accent/40 transition-all duration-300"
                      >
                        {highlight}
                      </span>
                    ))}
                  </div>

                  {/* Progress indicator line */}
                  <div className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-accent to-amber w-0 group-hover:w-full transition-all duration-700 ease-out rounded-b-2xl"></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 1.2 }}
          className="mt-16 text-center"
        >
          <p className="text-white/60 font-body mb-6">
            Ready to transform your testing strategy?
          </p>
          <Link
            href="/contact"
            className="inline-flex items-center gap-3 px-8 py-4 bg-gradient-to-r from-accent to-accent/80 hover:from-accent hover:to-amber text-primary font-display font-bold rounded-full transition-all duration-500 hover:shadow-2xl hover:shadow-accent/50 hover:scale-105 group"
          >
            Get in Touch
            <FaCheckCircle className="text-xl group-hover:rotate-12 transition-transform duration-300" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
};

export default Services;
