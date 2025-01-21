import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion, AnimatePresence } from "framer-motion";
import {
  Calendar,
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  Briefcase,
  ChevronDown,
} from "lucide-react";

type Job = {
  bidAmount: string;
  coverLetter: string;
  freelancer: string;
  job: string;
  status: string;
  submittedAt: string;
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

const AppliedJobs = () => {
  const [appliedJobs, setAppliedJobs] = useState<Job[]>([]);
  const [expandedJob, setExpandedJob] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const getAppliedJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/proposal/getAppliedJobs");
        setAppliedJobs(response.data.appliedJobs);
        setError(null);
      } catch (error) {
        setError("Failed to fetch applied jobs. Please try again later.");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getAppliedJobs();
  }, []);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const getStatusConfig = (status: string): { color: string; icon: JSX.Element } => {
    const configs = {
      pending: {
        color: "bg-yellow-100 text-yellow-800 border-yellow-200",
        icon: <Clock className="w-4 h-4" />,
      },
      accepted: {
        color: "bg-green-100 text-green-800 border-green-200",
        icon: <CheckCircle className="w-4 h-4" />,
      },
      rejected: {
        color: "bg-red-100 text-red-800 border-red-200",
        icon: <XCircle className="w-4 h-4" />,
      },
    };
    return configs[status.toLowerCase()] || {
      color: "bg-gray-100 text-gray-800 border-gray-200",
      icon: <Clock className="w-4 h-4" />,
    };
  };

  const toggleJobExpansion = (jobId: string) => {
    setExpandedJob(expandedJob === jobId ? null : jobId);
  };

  if (isLoading) {
    return (
      <div className="p-6 max-w-6xl mx-auto">
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
      <div className="p-6 max-w-6xl mx-auto">
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
    <div className="p-6 max-w-6xl mx-auto h-full overflow-y-scroll">
      <div className="flex items-center gap-3 mb-8">
        <Briefcase className="w-8 h-8 text-blue-600" />
        <h1 className="text-3xl font-bold text-gray-900">Applied Jobs</h1>
      </div>

      <AnimatePresence>
        {appliedJobs.length === 0 ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="text-center p-12 bg-gray-50 rounded-lg border border-gray-200"
          >
            <Briefcase className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600 text-lg">No jobs applied yet</p>
            <p className="text-gray-500 mt-2">Start applying to see your applications here</p>
          </motion.div>
        ) : (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="space-y-4"
          >
            {appliedJobs.map((job) => {
              const { color, icon } = getStatusConfig(job.status);
              const isExpanded = expandedJob === job._id;

              return (
                <motion.div
                  key={job._id}
                  variants={itemVariants}
                  className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-3">
                        <h2 className="text-xl font-semibold text-gray-900">
                          Job ID: {job.job}
                        </h2>
                        <span
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border flex items-center gap-1.5 ${color}`}
                        >
                          {icon}
                          {job.status}
                        </span>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                        <span className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          {formatDate(job.submittedAt)}
                        </span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign className="w-4 h-4" />
                          Bid Amount: ${job.bidAmount}
                        </span>
                      </div>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={() => toggleJobExpansion(job._id)}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <ChevronDown
                        className={`w-5 h-5 text-gray-500 transition-transform duration-200 ${
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
                        <div className="mt-6 pt-4 border-t border-gray-100">
                          <h3 className="text-sm font-semibold text-gray-700 mb-2">
                            Cover Letter
                          </h3>
                          <p className="text-gray-600 text-sm whitespace-pre-line">
                            {job.coverLetter}
                          </p>
                          
                          <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors"
                          >
                            View Full Details
                          </motion.button>
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

export default AppliedJobs;