import { motion } from 'framer-motion';

export const Skeleton = ({ className = '', variant = 'default' }) => {
  const variants = {
    default: 'bg-white/5',
    shimmer: 'bg-gradient-to-r from-white/5 via-white/10 to-white/5',
    pulse: 'bg-white/5 animate-pulse',
  };

  return (
    <div className={`${variants[variant]} rounded-lg ${className}`}>
      {variant === 'shimmer' && (
        <motion.div
          className="h-full w-full bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
          }}
        />
      )}
    </div>
  );
};

export const AlbumSkeleton = () => {
  return (
    <div className="w-52 h-52">
      <div className="relative w-full h-full overflow-hidden rounded-lg bg-white/5">
        <motion.div
          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/10 to-transparent"
          animate={{
            x: ['-100%', '100%'],
          }}
          transition={{
            repeat: Infinity,
            duration: 1.5,
            ease: 'linear',
            repeatDelay: 0.5,
          }}
        />
      </div>
    </div>
  );
};
