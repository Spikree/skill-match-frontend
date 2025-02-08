import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { Briefcase } from "lucide-react";

type JobType = {
  _id: string;
  freelancer: string;
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  jobStatus: string;
  payCheck: string;
  employer: string; 
};

const CurrentJobs = () => {
  const [currentJobs, setCurrentJobs] = useState<JobType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [expandedJobs, setExpandedJobs] = useState<Record<string, boolean>>({});
  const navigate = useNavigate();

  const truncateText = (text: string, wordLimit: number) => {
    const words = text.split(' ');
    if (words.length <= wordLimit) return text;
    return words.slice(0, wordLimit).join(' ') + '...';
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJobs(prev => ({
      ...prev,
      [jobId]: !prev[jobId]
    }));
  };

  useEffect(() => {
    const getCurrentJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/job/getCurrentJob");
        setCurrentJobs(response.data.currJob);
        console.log(response.data.currJob);
      } catch (error) {
        setError("Failed to load current jobs");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getCurrentJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="w-full max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-white rounded-lg shadow-lg p-6 space-y-4"
            >
              <div className="h-4 w-3/4 bg-gray-200 rounded animate-pulse" />
              <div className="h-4 w-1/2 bg-gray-200 rounded animate-pulse" />
              <div className="h-20 w-full bg-gray-200 rounded animate-pulse" />
            </motion.div>
          ))}
        </div>
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

  if (!currentJobs?.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="w-full max-w-2xl mx-auto p-6 mt-16 sm:mt-0 bg-white rounded-lg shadow-lg"
      >
        <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
        <p className="text-center text-gray-500">You don't have any jobs yet <span onClick={() => navigate("/jobs")} className="text-blue-500 cursor-pointer">View Jobs</span></p>
      </motion.div>
    );
  }

  return (
    <div className="h-full overflow-y-auto mt-20 sm:mt-0">
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto mt-16 sm:mt-0 p-6 "
    >
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
        className="mb-8"
      >
        <h2 className="text-3xl font-bold text-gray-800">Current Jobs</h2>
      </motion.div>
      
      <motion.div 
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
      >
        {currentJobs.map((job, index) => (
          <motion.div
            key={job._id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 * index }}
            className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300"
          >
            <motion.div
              whileHover={{ scale: 1.02 }}
              transition={{ type: "spring", stiffness: 300 }}
              className="p-6"
            >
              <div className="mb-4">
                <h3 className="text-xl font-semibold text-gray-800 mb-2">
                  {job.jobTitle}
                </h3>
                <p className="text-gray-600">{job.employer}</p>
              </div>
              
              <AnimatePresence mode="wait">
                <motion.div
                  key={expandedJobs[job._id] ? 'expanded' : 'collapsed'}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.2 }}
                  className="relative"
                >
                  <p className="text-gray-700 leading-relaxed mb-4">
                    {expandedJobs[job._id] 
                      ? job.jobDescription 
                      : truncateText(job.jobDescription, 30)}
                  </p>
                  {job.jobDescription.split(' ').length > 30 && (
                    <motion.button
                      onClick={() => toggleJobExpansion(job._id)}
                      className="text-blue-600 hover:text-blue-800 font-medium"
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                    >
                      {expandedJobs[job._id] ? 'Show Less' : 'Read More'}
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
                  onClick={() => window.location.href = `/job/${job.jobId}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors w-full"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  View Full Job Details
                </motion.button>
              </motion.div>
            </motion.div>
          </motion.div>
        ))}
      </motion.div>
    </motion.div>
    </div>
  );
};

export default CurrentJobs;