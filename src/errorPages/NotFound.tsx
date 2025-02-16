import { motion } from 'framer-motion';
import { Ghost, Home, RefreshCw } from 'lucide-react';

const NotFound = () => {
  // Floating animation for ghost
  const floatingAnimation = {
    y: [0, -20, 0],
    transition: {
      duration: 4,
      repeat: Infinity,
      ease: "easeInOut"
    }
  };

  // Text scramble animation variants
  const errorTextVariants = {
    initial: { opacity: 0 },
    animate: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1
      }
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 via-purple-900 to-gray-900 flex items-center justify-center p-4">
      {/* Background particles */}
      <div className="absolute inset-0 overflow-hidden">
        {[...Array(20)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-2 h-2 bg-purple-400 rounded-full opacity-20"
            initial={{
              x: Math.random() * window.innerWidth,
              y: -20
            }}
            animate={{
              y: window.innerHeight + 20
            }}
            transition={{
              duration: 5 + Math.random() * 5,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
          />
        ))}
      </div>

      <div className="text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="mb-12"
        >
          <motion.div
            animate={floatingAnimation}
            className="relative"
          >
            <Ghost className="w-32 h-32 mx-auto text-purple-400 mb-8" />
          </motion.div>

          <motion.div
            initial={{ scale: 0.5, rotateY: 180 }}
            animate={{ scale: 1, rotateY: 0 }}
            transition={{
              type: "spring",
              stiffness: 260,
              damping: 20
            }}
            className="perspective"
          >
            <h1 className="text-9xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-purple-400 to-purple-600 mb-4">404</h1>
          </motion.div>

          <motion.h2
            variants={errorTextVariants}
            initial="initial"
            animate="animate"
            className="text-3xl font-semibold text-purple-300 mb-4"
          >
            Page Not Found
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="text-gray-300 text-lg mb-8 max-w-md mx-auto"
          >
            Don't worry! Our friendly ghost is here to help. Head back home or try refreshing the page.
          </motion.p>

          <motion.div
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8 }}
          >
            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#7C3AED" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg shadow-purple-500/20"
              onClick={() => window.location.href = '/home'}
            >
              <Home className="w-5 h-5" />
              Return Home
            </motion.button>

            <motion.button
              whileHover={{ scale: 1.05, backgroundColor: "#4B5563" }}
              whileTap={{ scale: 0.95 }}
              className="px-6 py-3 bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 transition-colors duration-300 shadow-lg shadow-gray-500/20"
              onClick={() => window.location.reload()}
            >
              <RefreshCw className="w-5 h-5" />
              Refresh Page
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;