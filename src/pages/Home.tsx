import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { motion } from "framer-motion";
import { BiBriefcase, BiCalendar, BiDollar } from "react-icons/bi";

type Job = {
  title: string;
  description: string;
  skillsRequired: string[];
  budget: string;
  createdAt: string;
  employer: string;
  status: string;
  _id: string;
};

const Home = () => {
  const [jobs, setJobs] = useState<Job[]>([]);

  useEffect(() => {
    const getJobs = async () => {
      try {
        const response = await axiosInstance.get("/job/getJobs");
        setJobs(response.data.jobs);
      } catch (error) {
        console.log(error);
      }
    };

    getJobs();
  }, []);

  return (
    <section className="space-y-6 p-4">
      {jobs.map((job, index) => (
        <motion.div
          key={index}
          className="group relative w-full bg-white rounded-xl shadow-sm hover:shadow-md transition-all duration-300 border border-gray-100 overflow-hidden"
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3, delay: index * 0.1 }}
        >
          {/* Hover effect background */}
          <div className="absolute inset-0 bg-gradient-to-r from-blue-50 to-indigo-50 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

          {/* Content */}
          <div className="relative p-6">
            <div className="flex justify-between items-start">
              <div className="space-y-1">
                <h2 className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors duration-300">
                  {job.title}
                </h2>
                <div className="flex items-center text-gray-500 space-x-4">
                  <div className="flex items-center space-x-1">
                    <BiBriefcase className="w-4 h-4" />
                    <span className="text-sm">{job.employer}</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <BiCalendar className="w-4 h-4" />
                    <span className="text-sm">
                      {new Date(job.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              </div>

              <div className="flex items-center">
                <BiDollar className="w-5 h-5 text-green-600" />
                <span className="text-lg font-medium text-green-600">
                  {job.budget}
                </span>
              </div>
            </div>

            <p className="mt-4 text-gray-600 leading-relaxed">
              {job.description}
            </p>

            <div className="mt-6 flex justify-between">
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, idx) => (
                  <span
                    key={idx}
                    className="px-3 py-1 text-sm bg-blue-50 text-center align-middle text-blue-700 rounded-full hover:bg-blue-100 transition-colors duration-200"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              <div>
                <button className="bg-green-200 text-black px-4 py-2 rounded-md">Apply</button>
              </div>
            </div>
          </div>
        </motion.div>
      ))}
    </section>
  );
};

export default Home;
