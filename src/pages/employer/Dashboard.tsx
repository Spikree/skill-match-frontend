import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FiClock, FiDollarSign } from "react-icons/fi";
import axiosInstance from "../../../utils/axiosInstance";

type Job = {
  budget: string;
  createdAt: string;
  description: string;
  employer: string;
  employerName: string;
  skillsRequired: string[];
  status: string;
  title: string;
  _id: string;
};

const Dashboard = () => {
  const [allJobs, setAllJobs] = useState<Job[]>([]);

  useEffect(() => {
    const getAllJobs = async () => {
      try {
        const response = await axiosInstance.get("/job/getJobs");
        setAllJobs(response.data.jobs);
      } catch (error) {
        console.log(error);
      }
    };

    getAllJobs();
  }, []);

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.3,
      },
    },
    hover: {
      scale: 1.01,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <div className="pt-12 sm:pt-0 h-full overflow-y-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
          <p className="text-lg text-gray-600">Jobs you created</p>
        </motion.div>

        <div className="space-y-4">
          {allJobs.map((job, index) => (
            <motion.div
              key={job._id}
              variants={cardVariants}
              initial="hidden"
              animate="visible"
              whileHover="hover"
              transition={{ delay: index * 0.1 }}
              className="group bg-white rounded-2xl shadow-sm hover:shadow-md border border-gray-100 hover:border-blue-100 transition-all duration-200"
            >
              <div className="p-6 sm:p-8">
                <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                  <div className="flex-1 space-y-4">
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {job.title}
                        </h2>
                        <span
                          className={`hidden sm:inline-flex items-center px-3 py-1 rounded-full text-xs font-medium transition-colors ${
                            job.status === "Active"
                              ? "bg-green-50 text-green-700 group-hover:bg-green-100"
                              : "bg-gray-50 text-gray-700 group-hover:bg-gray-100"
                          }`}
                        >
                          {job.status}
                        </span>
                      </div>
                      <p className="text-gray-600 text-sm leading-relaxed line-clamp-2">
                        {job.description}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map((skill, idx) => (
                        <span
                          key={idx}
                          className="px-3 py-1.5 bg-gray-50 text-gray-600 text-xs font-medium rounded-lg group-hover:bg-blue-50 group-hover:text-blue-600 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="flex flex-row lg:flex-col justify-between items-start gap-6 lg:min-w-[240px]">
                    <div className="flex flex-col gap-3">
                      <div className="flex items-center text-gray-600">
                        <FiDollarSign className="w-5 h-5 text-blue-500 mr-2.5" />
                        <span className="text-sm font-medium">{job.budget}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <FiClock className="w-5 h-5 text-purple-500 mr-2.5" />
                        <span className="text-sm">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <span
                        className={`inline-flex sm:hidden items-center px-3 py-1 rounded-full text-xs font-medium ${
                          job.status === "Active"
                            ? "bg-green-50 text-green-700"
                            : "bg-gray-50 text-gray-700"
                        }`}
                      >
                        {job.status}
                      </span>
                    </div>

                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-gradient-to-r from-blue-600 to-blue-500 text-white px-6 py-2.5 rounded-xl text-sm font-medium hover:from-blue-700 hover:to-blue-600 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 shadow-sm hover:shadow"
                    >
                      View Details
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;