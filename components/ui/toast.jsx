import { motion, AnimatePresence } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle, FaTimes } from 'react-icons/fa';

export const Toast = ({ message, type = 'success', onClose, isVisible }) => {
  const config = {
    success: {
      icon: FaCheckCircle,
      gradient: 'from-success to-success/80',
      bgColor: 'bg-success/10',
      borderColor: 'border-success/30',
      iconColor: 'text-success',
    },
    error: {
      icon: FaExclamationCircle,
      gradient: 'from-error to-error/80',
      bgColor: 'bg-error/10',
      borderColor: 'border-error/30',
      iconColor: 'text-error',
    },
  };

  const { icon: Icon, gradient, bgColor, borderColor, iconColor } = config[type];

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: -50, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: -20, scale: 0.95 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
          className="fixed top-6 right-6 z-50 max-w-md"
        >
          <div
            className={`${bgColor} ${borderColor} backdrop-blur-xl border-2 rounded-2xl p-5 shadow-2xl flex items-start gap-4 relative overflow-hidden`}
          >
            {/* Gradient background overlay */}
            <div
              className={`absolute inset-0 bg-gradient-to-r ${gradient} opacity-5`}
            ></div>

            {/* Content */}
            <div className="relative flex items-start gap-4 flex-1">
              <div
                className={`${iconColor} text-2xl mt-0.5 animate-pulse`}
              >
                <Icon />
              </div>
              <p className="text-white font-body text-sm leading-relaxed flex-1">
                {message}
              </p>
            </div>

            {/* Close button */}
            <button
              onClick={onClose}
              className="relative text-white/60 hover:text-white transition-colors duration-200 p-1 hover:bg-white/10 rounded-lg"
            >
              <FaTimes />
            </button>

            {/* Progress bar */}
            <motion.div
              initial={{ scaleX: 1 }}
              animate={{ scaleX: 0 }}
              transition={{ duration: 4, ease: 'linear' }}
              className={`absolute bottom-0 left-0 h-1 bg-gradient-to-r ${gradient} origin-left`}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
