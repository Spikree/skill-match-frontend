import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import axiosInstance from "../../utils/axiosInstance";
import { useParams } from "react-router-dom";
import {
  FaBriefcase,
  FaCalendar,
  FaDollarSign,
  FaCrosshairs,
  FaSpinner,
  FaSave,
} from "react-icons/fa";
import ApplyModal from "../components/ApplyModal";

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

const Job = () => {
  const [job, setJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const { jobId } = useParams();

  useEffect(() => {
    const getJob = async () => {
      try {
        const response = await axiosInstance.get(`/job/getJob/${jobId}`);
        setJob(response.data.job);
      } catch (error) {
        console.error("Error fetching job:", error);
      } finally {
        setIsLoading(false);
      }
    };
    getJob();
  }, [jobId]);

  const toggleModal = () => {
    setShowModal((prev) => !prev);
  };

  const applyToJob = async (bidAmount: string, coverLetter: string) => {
    try {
      const response = await axiosInstance.post(`/proposal/submit/${jobId}`, {
        bidAmount,
        coverLetter,
      });
      console.log(response);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  const saveJob = async (jobId: string) => {
    try {
      const response = await axiosInstance.post(`/job/saveJob/${jobId}`);
      toast.success(response.data.message);
    } catch (error) {
      toast.error(error.response.data.message);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <FaSpinner className="w-8 h-8 text-blue-600 animate-spin" />
      </div>
    );
  }

  if (!job) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-500">Job not found</div>
      </div>
    );
  }

  const statusColors = {
    Active: "bg-green-100 text-green-800 border-green-200",
    Closed: "bg-yellow-100 text-yellow-800 border-yellow-200",
  };

  return (
    <div className="h-full overflow-y-scroll">
      <ToastContainer />
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="bg-white rounded-lg shadow-lg p-6 flex justify-between">
          <div className="space-y-4">
            <div className="flex flex-col space-y-3">
              <h1 className="text-xl md:text-2xl font-bold text-gray-900 leading-tight">
                {job.title}
              </h1>
              <div className="flex items-center gap-2 text-gray-600">
                <FaBriefcase className="w-4 h-4 flex-shrink-0" />
                <span className="text-sm md:text-base">{job.employerName}</span>
              </div>
            </div>

            <div className="flex flex-wrap gap-2">
              <span
                className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${
                  statusColors[job.status as keyof typeof statusColors]
                }`}
              >
                {job.status}
              </span>
              <span className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200">
                <FaDollarSign className="w-4 h-4 mr-1" />
                {job.budget}
              </span>
            </div>
          </div>
          <div onClick={() => saveJob(job._id)}>
            <button className=" p-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
              <FaSave className="w-6 h-6 " />
            </button>
          </div>{" "}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-lg">
            <div className="p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">
                Job Description
              </h2>
              <p className="text-gray-600 leading-relaxed whitespace-pre-wrap text-sm md:text-base">
                {job.description}
              </p>
            </div>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Skills Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FaCrosshairs className="w-5 h-5 text-gray-600" />
                Required Skills
              </h3>
              <div className="flex flex-wrap gap-2">
                {job.skillsRequired.map((skill, index) => (
                  <span
                    key={index}
                    className="px-3 py-1 rounded-full text-sm bg-gray-100 text-gray-700 border border-gray-200 hover:bg-gray-200 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>

            {/* Posted Date Card */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-base font-semibold text-gray-900 flex items-center gap-2 mb-4">
                <FaCalendar className="w-5 h-5 text-gray-600" />
                Posted
              </h3>
              <p className="text-sm text-gray-600">
                {new Date(job.createdAt).toLocaleDateString("en-US", {
                  year: "numeric",
                  month: "long",
                  day: "numeric",
                })}
              </p>
            </div>
          </div>
        </div>
        <button
          onClick={toggleModal}
          className="px-4 py-2 bg-green-300 text-center pb-2 rounded-md"
        >
          Apply
        </button>
      </div>
      {showModal && (
        <ApplyModal applyToJob={applyToJob} toggleModal={toggleModal} />
      )}
    </div>
  );
};

export default Job;
