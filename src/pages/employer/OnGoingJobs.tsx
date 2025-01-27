import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { Briefcase, Clock, DollarSign, UserCheck, Info } from "lucide-react";
import { useNavigate } from "react-router-dom";

type Job = {
  employer: string;
  freelancer: string;
  jobDescription: string;
  jobId: string;
  jobTitle: string;
  payCheck: string;
  _id: string;
};

const JobCardSkeleton = () => (
  <div className="bg-white shadow-lg rounded-xl p-6 animate-pulse">
    <div className="flex justify-between items-center mb-4">
      <div className="h-6 bg-gray-300 rounded w-3/4"></div>
    </div>

    <div className="space-y-3">
      <div className="h-4 bg-gray-200 rounded w-1/2"></div>
      <div className="h-4 bg-gray-200 rounded w-2/3"></div>
      <div className="h-4 bg-gray-200 rounded w-1/3"></div>
    </div>

    <div className="mt-4 p-3 bg-gray-100 rounded-lg">
      <div className="h-12 bg-gray-300 rounded"></div>
    </div>
  </div>
);

const OnGoingJobs = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getOnGoingJobs = async () => {
      try {
        const response = await axiosInstance.get("/job/getOnGoingJobs");
        setJobs(response.data.jobs);
        setLoading(false);
      } catch (error) {
        console.error(error);
        setLoading(false);
      } finally {
        setLoading(false);
      }
    };
    getOnGoingJobs();
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1,
      transition: {
        type: "spring",
        stiffness: 300,
      },
    },
  };

  return (
    <div className="h-full bg-gray-100 pt-16 sm:pt-0 p-6 overflow-y-auto">
      <motion.h1
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        className="text-3xl font-bold text-center mb-8 text-gray-800"
      >
        Ongoing Jobs
      </motion.h1>

      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map((_, index) => (
            <JobCardSkeleton key={index} />
          ))}
        </div>
      ) : (
        <AnimatePresence>
          {jobs.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center text-gray-500 text-xl"
            >
              No ongoing jobs found
            </motion.div>
          ) : (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
            >
              {jobs.map((job) => (
                <motion.div
                  key={job._id}
                  variants={itemVariants}
                  className="bg-white shadow-lg rounded-xl p-6 hover:shadow-xl transition-shadow duration-300"
                >
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-semibold text-gray-800 flex items-center">
                      <Briefcase className="mr-2 text-blue-500" size={24} />
                      {job.jobTitle}
                    </h2>
                  </div>

                  <div className="space-y-3 text-gray-600">
                    <p className="flex items-center">
                      <UserCheck className="mr-2 text-green-500" size={20} />
                      Employer: {job.employer}
                    </p>
                    <p className="flex items-center">
                      <Clock className="mr-2 text-purple-500" size={20} />
                      Job ID: {job.jobId}
                    </p>
                    <p className="flex items-center">
                      <DollarSign className="mr-2 text-green-600" size={20} />
                      Payment: {job.payCheck}
                    </p>
                  </div>

                  <motion.div
                    whileHover={{ scale: 1.02 }}
                    className="mt-4 p-3 bg-gray-100 rounded-lg"
                  >
                    <p className="text-sm text-gray-700 line-clamp-3">
                      {job.jobDescription}
                    </p>
                  </motion.div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    onClick={() => {
                      navigate(`/getOnGoingJobDetails/${job.jobId}`);
                    }}
                    whileTap={{ scale: 0.95 }}
                    className="w-full mt-4 flex items-center justify-center bg-blue-500 text-white py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  >
                    More Details
                  </motion.button>
                </motion.div>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      )}
    </div>
  );
};

export default OnGoingJobs;
