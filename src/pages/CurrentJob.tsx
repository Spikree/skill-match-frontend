import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { div } from "framer-motion/client";

type CurrentJobType = {
  userId: string;
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  employer: string;
  _id: string;
  payCheck: string
};

const CurrentJob = () => {
  const [currentJob, setCurrentJob] = useState<CurrentJobType | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  useEffect(() => {
    const getCurrentJob = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/job/getCurrentJob");
        setCurrentJob(response.data.currJob);
        
      } catch (error) {
        setError("Failed to load current job");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getCurrentJob();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="space-y-4"
        >
          <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
          <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
          <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto p-6 bg-red-50 rounded-lg shadow-lg"
      >
        <p className="text-center text-red-600">{error}</p>
      </motion.div>
    );
  }

  if (!currentJob) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto p-6 mt-16 sm:mt-0 bg-white rounded-lg shadow-lg"
      >
        <p className="text-center text-gray-500">You don't have a job yet</p>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-2xl mx-auto mt-16 p-6 bg-white rounded-lg shadow-lg  h-full overflow-y-auto pt-14"
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-6"
      >
        <h2 className="text-2xl font-bold mb-2">Current Job</h2>
      </motion.div>
      
      <motion.div 
        className="space-y-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        <motion.div
          whileHover={{ scale: 1.02 }}
          transition={{ type: "spring", stiffness: 300 }}
        >
          <h3 className="text-xl font-semibold text-gray-800">
            {currentJob.jobTitle}
          </h3>
          <p className="text-gray-600">{currentJob.employer}</p>
        </motion.div>
        
        <AnimatePresence mode="wait">
          <motion.div
            key={isExpanded ? 'expanded' : 'collapsed'}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="relative"
          >
            <p className="text-gray-700 leading-relaxed">
              {isExpanded 
                ? currentJob.jobDescription 
                : truncateText(currentJob.jobDescription, 200)}
            </p>
            {currentJob.jobDescription.split(' ').length > 200 && (
              <motion.button
                onClick={() => setIsExpanded(!isExpanded)}
                className="mt-2 text-blue-600 hover:text-blue-800 font-medium"
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {isExpanded ? 'Show Less' : 'Read More'}
              </motion.button>
            )}
          </motion.div>
        </AnimatePresence>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="mt-6"
        >
          <motion.button
            onClick={() => window.location.href = `/job/${currentJob.jobId}`}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full sm:w-auto"
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            View Full Job Details
          </motion.button>
        </motion.div>
      </motion.div>
    </motion.div>
  );
};

export default CurrentJob;