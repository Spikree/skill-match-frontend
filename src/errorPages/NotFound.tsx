import { motion } from 'framer-motion';
import { Ghost, Home, RefreshCw } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-900 to-gray-800 flex items-center justify-center p-4">
      <div className="text-center">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-8"
        >
          <Ghost className="w-24 h-24 mx-auto text-purple-400 mb-4" />
          <motion.div
            initial={{ scale: 0.5 }}
            animate={{ scale: 1 }}
            transition={{ 
              type: "spring",
              stiffness: 260,
              damping: 20 
            }}
          >
            <h1 className="text-8xl font-bold text-white mb-4">404</h1>
          </motion.div>
          <h2 className="text-3xl font-semibold text-purple-300 mb-4">Page Not Found</h2>
          <p className="text-gray-400 text-lg mb-8">
            Oops! The page you're looking for seems to have vanished into thin air.
          </p>
        </motion.div>

        <motion.div
          className="flex flex-col sm:flex-row gap-4 justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-purple-600 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-purple-700 transition-colors"
            onClick={() => window.location.href = '/home'}
          >
            <Home className="w-5 h-5" />
            Go Home
          </motion.button>
          
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="px-6 py-3 bg-gray-700 text-white rounded-lg flex items-center justify-center gap-2 hover:bg-gray-600 transition-colors"
            onClick={() => window.location.reload()}
          >
            <RefreshCw className="w-5 h-5" />
            Try Again
          </motion.button>
        </motion.div>
      </div>
    </div>
  );
};

export default NotFound;