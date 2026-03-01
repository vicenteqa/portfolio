'use client';

import CountUp from 'react-countup';
import { motion } from 'framer-motion';
import {
  FaBriefcase,
  FaCode,
  FaCheckCircle,
  FaRocket,
} from 'react-icons/fa';

const stats = [
  {
    num: 11,
    text: 'Years of Experience',
    suffix: '+',
    icon: FaBriefcase,
    color: 'accent',
  },
  {
    num: 8,
    text: 'Technologies Mastered',
    suffix: '+',
    icon: FaCode,
    color: 'amber',
  },
  {
    num: 500,
    text: 'Code Commits',
    suffix: '+',
    icon: FaCheckCircle,
    color: 'success',
  },
  {
    num: 50,
    text: 'Projects Completed',
    suffix: '+',
    icon: FaRocket,
    color: 'accent',
  },
];

const colorClasses = {
  accent: {
    text: 'text-accent',
    bg: 'bg-accent/10',
    border: 'border-accent/30',
    gradient: 'from-accent to-accent/40',
  },
  amber: {
    text: 'text-amber',
    bg: 'bg-amber/10',
    border: 'border-amber/30',
    gradient: 'from-amber to-amber/40',
  },
  success: {
    text: 'text-success',
    bg: 'bg-success/10',
    border: 'border-success/30',
    gradient: 'from-success to-success/40',
  },
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.5,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.9 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.5,
      ease: [0.25, 0.46, 0.45, 0.94],
    },
  },
};

const Stats = () => {
  return (
    <section className="pt-8 pb-12 xl:pt-12 xl:pb-16">
      <div className="container mx-auto">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="grid grid-cols-2 md:grid-cols-4 gap-6 xl:gap-8"
        >
          {stats.map((item, index) => {
            const Icon = item.icon;
            const colors = colorClasses[item.color];

            return (
              <motion.div
                variants={itemVariants}
                key={index}
                className="group relative"
              >
                {/* Card container */}
                <div className="relative bg-gradient-to-br from-[#1a1a1f] to-[#232329] border border-white/10 rounded-2xl p-6 xl:p-8 h-full flex flex-col items-center justify-center transition-all duration-500 hover:border-white/20 hover:shadow-2xl hover:shadow-white/5 overflow-hidden">
                  {/* Animated background gradient */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${colors.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`}
                  ></div>

                  {/* Icon */}
                  <div
                    className={`relative ${colors.bg} ${colors.border} border-2 w-16 h-16 xl:w-20 xl:h-20 rounded-2xl flex items-center justify-center mb-4 transition-all duration-500 group-hover:scale-110 group-hover:rotate-6`}
                  >
                    <Icon className={`${colors.text} text-2xl xl:text-3xl`} />
                  </div>

                  {/* Number */}
                  <div className="relative flex items-baseline justify-center mb-2">
                    <CountUp
                      end={item.num}
                      duration={3}
                      delay={0.5 + index * 0.15}
                      className={`text-4xl xl:text-5xl font-display font-extrabold ${colors.text} transition-all duration-300`}
                    />
                    {item.suffix && (
                      <span
                        className={`${colors.text} text-2xl xl:text-3xl font-display font-bold ml-1`}
                      >
                        {item.suffix}
                      </span>
                    )}
                  </div>

                  {/* Text */}
                  <p className="relative text-white/60 text-sm xl:text-base font-body text-center leading-tight group-hover:text-white/80 transition-colors duration-300">
                    {item.text}
                  </p>

                  {/* Bottom accent line */}
                  <div
                    className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${colors.gradient} w-0 group-hover:w-full transition-all duration-700 ease-out rounded-b-2xl`}
                  ></div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
};

export default Stats;
