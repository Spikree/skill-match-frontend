import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bookmark,
  ChevronDown,
  Briefcase,
} from "lucide-react";

type allSavedJobs = {
  freelancer: string;
  jobDescription: string;
  jobId: string;
  jobTitle: string;
  _id: string;
};

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
      delayChildren: 0.1,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 20 },
  show: { 
    opacity: 1, 
    y: 0,
    transition: {
      type: "spring",
      stiffness: 100,
    }
  },
};

const SavedJobs = () => {
  const [savedJobs, setSavedJobs] = useState<allSavedJobs[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    const getSavedJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance("/job/getSavedJobs");
        setSavedJobs(response.data.allSavedJobs);
        setError(null);
      } catch (error) {
        setError("Failed to fetch saved jobs. Please try again later.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };

    getSavedJobs();
  }, []);

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  if (isLoading) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-gray-100 h-40 rounded-lg"></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 sm:p-6 max-w-6xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border border-red-200 rounded-lg p-4 text-red-700"
        >
          {error}
        </motion.div>
      </div>
    );
  }

  return (
    <div className="p-4 sm:p-6 max-w-6xl mx-auto h-full overflow-y-auto pt-14 sm:pt-0">
      <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-3 mb-6 sm:mb-8">
        <Bookmark className="w-6 h-6 sm:w-8 sm:h-8 text-blue-600" />
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Saved Jobs</h1>
      </div>

      <AnimatePresence>
        {savedJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center p-6 sm:p-12 bg-gray-50 rounded-lg border border-gray-200"
          >
            <Bookmark className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            <p className="text-gray-600 text-base sm:text-lg">No saved jobs yet</p>
            <p className="text-gray-500 text-sm sm:text-base mt-1 sm:mt-2">
              Start saving jobs to view them here
            </p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {savedJobs.map((job) => {
              const isExpanded = expandedJob === job._id;

              return (
                <motion.div
                  key={job._id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 sm:p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex flex-col sm:flex-row items-start gap-3 sm:gap-4">
                    <div className="w-full sm:flex-1">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-3 mb-3">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-900 break-all">
                          {job.jobTitle}
                        </h2>
                        <span className="inline-flex items-center px-2.5 sm:px-3 py-1 sm:py-1.5 rounded-full text-xs sm:text-sm font-medium border bg-blue-100 text-blue-800 border-blue-200">
                          <Briefcase className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                          <span className="ml-1.5">Job ID: {job.jobId}</span>
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleJobExpansion(job._id)}
                      className="self-end sm:self-center p-1.5 sm:p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronDown
                        className={`w-4 h-4 sm:w-5 sm:h-5 text-gray-500 transition-transform duration-200 ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </motion.button>
                  </div>

                  <AnimatePresence>
                    {isExpanded && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                        className="overflow-hidden"
                      >
                        <div className="mt-4 sm:mt-6 pt-4 border-t border-gray-100">
                          <h3 className="text-xs sm:text-sm font-semibold text-gray-700 mb-2">
                            Job Description
                          </h3>
                          <p className="text-xs sm:text-sm text-gray-600 whitespace-pre-line">
                            {job.jobDescription}
                          </p>
                          
                          <div className="mt-4 flex justify-end" onClick={() => {navigate(`/job/${job.jobId}`)}}>
                            <motion.button
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors"
                            >
                              View Full Details
                            </motion.button>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default SavedJobs;