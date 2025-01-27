import { useEffect, useState, useRef } from "react";
import axiosInstance from "../../../utils/axiosInstance";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import {
  DollarSign,
  Briefcase,
  Calendar,
  FileText,
  Tag,
  User,
  ChevronDown,
  Check,
} from "lucide-react";

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

const OnGoingJobDetails = () => {
  const [job, setJob] = useState<Job | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [showStatusOptions, setShowStatusOptions] = useState<boolean>(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const { jobId } = useParams();

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setShowStatusOptions(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  useEffect(() => {
    const getJobDetails = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(`job/getJob/${jobId}`);
        setJob(response.data.job);
        setError(null);
      } catch (err: any) {
        setError("Failed to fetch job details. Please try again.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    getJobDetails();
  }, [jobId]);

  const editStatus = async (statusValue: string) => {
    try {
      await axiosInstance.put(`/job/editStatus/${jobId}`, {
        status: statusValue,
      });
      setJob((prev) => (prev ? { ...prev, status: statusValue } : null));
      setShowStatusOptions(false);
    } catch (error) {
      console.log(error);
    }
  };

  const markJobAsFinished = async () => {
    try {
      const response = await axiosInstance.post(`/job/markFinished/${jobId}`)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const status = [
    // { name: "Open", value: "open", color: "bg-blue-100 text-blue-800" },
    {
      name: "In Progress",
      value: "in progress",
      color: "bg-yellow-100 text-yellow-800",
    },
    {
      name: "Completed",
      value: "completed",
      color: "bg-green-100 text-green-800",
    },
    {
      name: "Cancelled",
      value: "cancelled",
      color: "bg-red-100 text-red-800",
    },
  ];

  const getStatusColor = (currentStatus: string) => {
    const statusItem = status.find(
      (s) => s.value === currentStatus.toLowerCase()
    );
    return statusItem?.color || "bg-gray-100 text-gray-800";
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-600">Loading job details...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-red-600">{error}</p>
      </div>
    );
  }

  if (!job) {
    return (
      <div className="flex items-center justify-center h-full">
        <p className="text-lg text-gray-600">No job details available.</p>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto p-4 sm:p-6 pt-20 sm:pt-10">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full h-full max-w-4xl mx-auto space-y-6"
      >
        {/* Job Header Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-2xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex items-center justify-between mb-6"
            >
              <h1 className="text-3xl font-bold text-gray-900 flex items-center">
                <Briefcase className="mr-3 text-blue-600 w-8 h-8" />
                {job.title || "Untitled Job"}
              </h1>
              <div className="relative" ref={dropdownRef}>
                <button
                  onClick={() => setShowStatusOptions(!showStatusOptions)}
                  className={`px-4 py-2 rounded-full text-sm font-medium inline-flex items-center gap-2 transition-all duration-200 ${getStatusColor(
                    job.status
                  )}`}
                >
                  {job.status || "Unknown"}
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-200 ${
                      showStatusOptions ? "transform rotate-180" : ""
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {showStatusOptions && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      className="absolute right-0 mt-2 w-48 rounded-xl bg-white shadow-lg ring-1 ring-black ring-opacity-5 z-50"
                    >
                      <div className="py-1">
                        {status.map((statusOption, index) => (
                          <button
                            key={index}
                            onClick={() => editStatus(statusOption.value)}
                            className={`w-full text-left px-4 py-2 text-sm flex items-center justify-between hover:bg-gray-50 transition-colors ${
                              job.status.toLowerCase() === statusOption.value
                                ? "font-medium"
                                : "font-normal"
                            }`}
                          >
                            <span
                              className={`px-2 py-1 rounded-full ${statusOption.color}`}
                            >
                              {statusOption.name}
                            </span>
                            {job.status.toLowerCase() ===
                              statusOption.value && (
                              <Check className="w-4 h-4 text-green-600" />
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </motion.div>

            <div className="grid md:grid-cols-3 gap-6 mb-8">
              {/* Employer Name */}
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <User className="w-5 h-5 mr-3 text-gray-600" />
                <div>
                  <p className="text-sm text-gray-600">Posted by</p>
                  <p className="font-medium text-gray-900">
                    {job.employerName || "Unknown"}
                  </p>
                </div>
              </div>

              {/* Budget */}
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                <div>
                  <p className="text-sm text-gray-600">Budget</p>
                  <p className="font-medium text-gray-900">
                    {job.budget || "N/A"}
                  </p>
                </div>
              </div>

              {/* Posted Date */}
              <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                <Calendar className="w-5 h-5 mr-3 text-blue-600" />
                <div>
                  <p className="text-sm text-gray-600">Posted</p>
                  <p className="font-medium text-gray-900">
                    {new Date(job.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            </div>

            {/* Job Description */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-blue-50 p-6 rounded-xl mb-6"
            >
              <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                <FileText className="mr-3 text-blue-600" />
                Job Description
              </h2>
              <p className="text-gray-700 leading-relaxed">
                {job.description || "No description available."}
              </p>
            </motion.div>

            {/* Required Skills */}
            <div className="flex justify-between">
              <div>
                <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                  <Tag className="mr-3 text-blue-600" />
                  Required Skills
                </h2>
                <div className="flex flex-wrap gap-2">
                  {job.skillsRequired?.length > 0 ? (
                    job.skillsRequired.map((skill) => (
                      <motion.span
                        key={skill}
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                      >
                        {skill}
                      </motion.span>
                    ))
                  ) : (
                    <p className="text-gray-600">No skills specified.</p>
                  )}
                </div>
              </div>
              <div>
                {job.status === "completed" && (
                  <span onClick={() => {
                    markJobAsFinished()
                  }} className="p-2 rounded-md text-green-950 font-semibold  bg-green-300">
                    mark finished
                  </span>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default OnGoingJobDetails;
