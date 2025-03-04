import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../utils/axiosInstance";
import { Briefcase } from "lucide-react";

type FinishedJob = {
  createdAt: string;
  freelancer: string;
  jobDescription: string;
  jobId: string;
  jobTitle: string;
  _id: string;
}

const FinishedJobs = () => {
  const [finishedJobs, setFinishedJobs] = useState<FinishedJob[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFinishedJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/job/getFinishedJobs");
        setFinishedJobs(response.data.finishedJobs);
      } catch (error) {
        setError("Failed to load finished jobs");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchFinishedJobs();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="p-6 pt-24 sm:pt-16">
        <div className="max-w-4xl mx-auto space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-lg shadow-lg p-6">
              <div className="animate-pulse space-y-4">
                <div className="h-4 bg-gray-200 rounded w-1/4" />
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-4 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-6 pt-24 sm:pt-16">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-red-50 rounded-lg p-6 text-center text-red-600"
          >
            {error}
          </motion.div>
        </div>
      </div>
    );
  }

  if (finishedJobs.length === 0) {
    return (
      <div className="p-6 pt-24 sm:pt-16">
        <div className="max-w-4xl mx-auto text-center">
        
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-white rounded-lg shadow-lg p-6"
          >
            <Briefcase className="w-10 h-10 sm:w-12 sm:h-12 text-gray-400 mx-auto mb-3 sm:mb-4" />
            You haven't finished a job yet,{" "}
            <span
              onClick={() => navigate("/home")}
              className="text-blue-500 cursor-pointer hover:text-blue-700 transition-colors"
            >
              find a job
            </span>
          </motion.div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 pt-24 sm:pt-16 bg-gray-50 h-full overflow-y-auto">
      <div className="max-w-4xl mx-auto">
        <motion.h1
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold mb-6 text-gray-800"
        >
          Finished Jobs
        </motion.h1>
        
        <AnimatePresence>
          <div className="space-y-4">
            {finishedJobs.map((job, index) => (
              <motion.div
                key={job._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-lg shadow-lg p-6 hover:shadow-xl transition-shadow"
              >
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-800 mb-2">
                      {job.jobTitle}
                    </h2>
                    <p className="text-sm text-gray-500">
                      Completed on {formatDate(job.createdAt)}
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={() => navigate(`/job/${job.jobId}`)}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
                  >
                    View Details
                  </motion.button>
                </div>
                
                <p className="text-gray-600 line-clamp-2">
                  {job.jobDescription}
                </p>
              </motion.div>
            ))}
          </div>
        </AnimatePresence>
      </div>
    </div>
  );
};

export default FinishedJobs;