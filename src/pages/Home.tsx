import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion } from "framer-motion";
import { BiBriefcase, BiCalendar, BiDollar, BiSearch } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

type Job = {
  title: string;
  description: string;
  skillsRequired: string[];
  budget: string;
  createdAt: string;
  employer: string;
  status: string;
  employerName: string;
  _id: string;
};

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const getJobs = async () => {
      setIsLoading(true)
      try {
        const response = await axiosInstance.get("/job/getJobs");
        setJobs(response.data.jobs);
      } catch (error) {
        console.log(error);
      } finally {
        setIsLoading(false)
      }
    };

    getJobs();
  }, []);

  if (isLoading) {
    return (
      <div className="h-full overflow-hidden sm:pt-0 pt-16 px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              className="group relative bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden h-fit"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: i * 0.1 }}
            >
              <div className="relative p-4 sm:p-6">
                <div className="animate-pulse space-y-4">
                  <div className="h-6 bg-gray-200 rounded w-3/4" />
                  <div className="h-4 bg-gray-200 rounded w-1/2 mt-2" />
                  <div className="h-20 bg-gray-200 rounded mt-4" />
                  <div className="flex gap-2 mt-4">
                    <div className="h-8 bg-gray-200 rounded w-20" />
                    <div className="h-8 bg-gray-200 rounded w-20" />
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-hidden sm:pt-0 pt-16">
      <div className="flex mb-4 items-center w-56 sm:w-96 rounded-full shadow-lg bg-gray-50 overflow-hidden border border-gray-200">
        <input
          type="text"
          placeholder="Search"
          className="flex-grow px-6 py-2 text-sm text-gray-800 bg-transparent focus:outline-none placeholder-gray-400 rounded-md"
        />
        <button className="p-2 hidden sm:block bg-blue-500 text-white hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 focus:ring-opacity-50 rounded-full">
          <BiSearch className="w-5 h-5" />
        </button>
      </div>

      <section className="h-full overflow-y-auto px-4 py-6 space-y-6">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {jobs.map((job, index) => (
            <motion.div
              key={index}
              className="group relative bg-white mb-10 rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden h-fit"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {/* Hover effect background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

              {/* Content */}
              <div className="relative p-4 sm:p-6">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4">
                  <div className="space-y-1">
                    <h2 className="text-lg cursor-pointer sm:text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                      {job.title}
                    </h2>
                    <div className="flex flex-wrap items-center text-gray-500 gap-4">
                      <div className="flex items-center space-x-1">
                        <BiBriefcase className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm cursor-pointer">{job.employerName}</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <BiCalendar className="w-4 h-4 flex-shrink-0" />
                        <span className="text-sm cursor-pointer">
                          {new Date(job.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center cursor-pointer">
                    <BiDollar className="w-5 h-5 text-green-600" />
                    <span className="text-lg font-medium text-green-600">
                      {job.budget}
                    </span>
                  </div>
                </div>

                <p className="mt-4 text-gray-600 leading-relaxed line-clamp-3">
                  {job.description}
                </p>

                <div className="mt-6 flex flex-col sm:flex-row gap-4 justify-between">
                  <div className="flex flex-wrap gap-2">
                    {job.skillsRequired.map((skill, idx) => (
                      <span
                        key={idx}
                        className="border h-8 px-2 rounded-md bg-violet-200 cursor-pointer"
                      >
                        {skill}
                      </span>
                    ))}
                  </div>

                  <button
                    onClick={() => {
                      navigate(`/job/${job._id}`);
                    }}
                    className="bg-green-200 text-black px-4 py-2 rounded-md hover:bg-green-300 transition-colors duration-200 w-full sm:w-auto"
                  >
                    send proposal
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default Home;
