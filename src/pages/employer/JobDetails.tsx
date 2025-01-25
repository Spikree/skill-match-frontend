import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";
import { useParams } from "react-router-dom";
import {
  DollarSign,
  Briefcase,
  Clock,
  FileText,
  Tag,
  User,
  Calendar,
  CheckCircle2,
  XCircle,
  Clock4,
  Frown,
  X,
  User2,
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

type Proposal = {
  bidAmount: string;
  coverLetter: string;
  freelancer: string;
  job: string;
  status: string;
  submittedAt: string;
  _id: string;
};

const JobDetails = () => {
  const [job, setJob] = useState<Job>();
  const [proposals, setProposals] = useState<Proposal[]>();
  const [selectedProposal, setSelectedProposal] = useState<Proposal | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { jobId } = useParams();

  useEffect(() => {
    const getJob = async () => {
      try {
        const response = await axiosInstance.get(`job/getJob/${jobId}`);
        setJob(response.data.job);
      } catch (error) {
        console.log(error);
      }
    };

    const getJobProposals = async () => {
      try {
        const response = await axiosInstance.get(`/job/getproposals/${jobId}`);
        setProposals(response.data.proposals);
      } catch (error) {
        console.log(error);
      }
    };

    getJob();
    getJobProposals();
  }, [jobId]);

  const handleAcceptProposal = async (proposalId: string) => {
    try {
      const response = await axiosInstance.post(`/job/acceptProposal/${jobId}/${proposalId}`)
      console.log(response)
    } catch (error) {
      console.log(error)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "accepted":
        return <CheckCircle2 className="w-4 h-4" />;
      case "rejected":
        return <XCircle className="w-4 h-4" />;
      default:
        return <Clock4 className="w-4 h-4" />;
    }
  };

  const openProposalModal = (proposal: Proposal) => {
    setSelectedProposal(proposal);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedProposal(null);
  };

  // Handle clicking outside modal to close
  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      closeModal();
    }
  };

  return (
    <div className="h-full overflow-y-auto bg-gradient-to-br p-4 sm:p-6 pt-20 sm:pt-0">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-4xl mx-auto space-y-6"
      >
        {job && (
          <>
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
                    {job.title}
                  </h1>
                  <span className="px-4 py-2 bg-blue-100 text-blue-800 rounded-full text-sm font-medium">
                    {job.status}
                  </span>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-8">
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <User className="w-5 h-5 mr-3 text-gray-600" />
                    <div>
                      <p className="text-sm text-gray-600">Posted by</p>
                      <p className="font-medium text-gray-900">{job.employerName}</p>
                    </div>
                  </div>
                  <div className="flex items-center p-4 bg-gray-50 rounded-xl">
                    <DollarSign className="w-5 h-5 mr-3 text-green-600" />
                    <div>
                      <p className="text-sm text-gray-600">Budget</p>
                      <p className="font-medium text-gray-900">{job.budget}</p>
                    </div>
                  </div>
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

                <div className="space-y-6">
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="bg-blue-50 p-6 rounded-xl"
                  >
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                      <FileText className="mr-3 text-blue-600" />
                      Job Description
                    </h2>
                    <p className="text-gray-700 leading-relaxed">{job.description}</p>
                  </motion.div>

                  <div>
                    <h2 className="text-xl font-semibold mb-4 flex items-center text-gray-900">
                      <Tag className="mr-3 text-blue-600" />
                      Required Skills
                    </h2>
                    <div className="flex flex-wrap gap-2">
                      {job.skillsRequired.map(skill => (
                        <motion.span
                          key={skill}
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="px-4 py-2 bg-blue-100 text-blue-800 rounded-lg text-sm font-medium hover:bg-blue-200 transition-colors"
                        >
                          {skill}
                        </motion.span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Proposals Section */}
            {proposals && proposals.length > 0 ? (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-4 sm:p-8">
                  <h2 className="text-xl sm:text-2xl font-bold mb-4 sm:mb-6 text-gray-900">
                    Proposals ({proposals.length})
                  </h2>
                  <div className="space-y-4">
                    {proposals.map((proposal) => (
                      <motion.div
                        key={proposal._id}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="bg-gray-50 rounded-xl overflow-hidden border border-gray-100"
                      >
                        <div className="p-4 sm:p-6">
                          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-4 gap-4">
                            <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2 sm:gap-4">
                              <span className="flex items-center gap-2 bg-green-100 text-green-800 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-semibold">
                                <DollarSign className="w-3 h-3 sm:w-4 sm:h-4" />
                                {proposal.bidAmount}
                              </span>
                              <span
                                className={`flex items-center gap-2 px-3 py-1 sm:px-4 sm:py-2 rounded-lg text-xs sm:text-sm font-medium ${
                                  proposal.status === "Accepted"
                                    ? "bg-green-100 text-green-800"
                                    : proposal.status === "Pending"
                                    ? "bg-yellow-100 text-yellow-800"
                                    : "bg-red-100 text-red-800"
                                }`}
                              >
                                {getStatusIcon(proposal.status)}
                                {proposal.status}
                              </span>
                            </div>
                            <motion.button
                              onClick={() => openProposalModal(proposal)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className="w-full sm:w-auto px-4 py-2 bg-blue-600 text-white rounded-lg text-xs sm:text-sm font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                              View Proposal
                            </motion.button>
                          </div>
                          <div className="flex items-center text-xs sm:text-sm text-gray-600 mb-2 sm:mb-4">
                            <Clock className="mr-2 w-3 h-3 sm:w-4 sm:h-4" />
                            Submitted on{" "}
                            {new Date(proposal.submittedAt).toLocaleDateString()}
                          </div>
                          <div className="bg-white p-3 sm:p-4 rounded-lg">
                            <p className="text-xs sm:text-sm text-gray-700 leading-relaxed line-clamp-2">
                              {proposal.coverLetter}
                            </p>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
              </motion.div>
            ) : (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white rounded-2xl shadow-xl overflow-hidden"
              >
                <div className="p-4 sm:p-8 flex flex-col items-center justify-center text-center">
                  <Frown className="w-16 h-16 text-gray-400 mb-4" />
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2">
                    No Proposals Yet
                  </h2>
                  <p className="text-sm sm:text-base text-gray-600">
                    There are currently no proposals for this job.
                  </p>
                </div>
              </motion.div>
            )}
          </>
        )}

        {/* Proposal Modal */}
        <AnimatePresence>
          {isModalOpen && selectedProposal && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={handleBackdropClick}
              className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.9, opacity: 0 }}
                className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto"
                onClick={(e) => e.stopPropagation()}
              >
                <div className="p-6">
                  <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-bold text-gray-900">
                      Proposal Details
                    </h2>
                    <button
                      onClick={closeModal}
                      className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                    >
                      <X className="w-6 h-6 text-gray-500" />
                    </button>
                  </div>

                  <div className="space-y-6">
                    {/* Bid Amount and Status */}
                    <div className="flex flex-wrap gap-4">
                      <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                        <DollarSign className="w-5 h-5" />
                        <span className="font-semibold">{selectedProposal.bidAmount}</span>
                      </div>
                      <div
                        className={`flex items-center gap-2 px-4 py-2 rounded-lg ${
                          selectedProposal.status === "Accepted"
                            ? "bg-green-100 text-green-800"
                            : selectedProposal.status === "Pending"
                            ? "bg-yellow-100 text-yellow-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {getStatusIcon(selectedProposal.status)}
                        <span className="font-medium">{selectedProposal.status}</span>
                      </div>
                    </div>

                    {/* Freelancer Info */}
                    <div className="bg-gray-50 p-4 rounded-xl">
                      <div className="flex items-center gap-3 mb-2">
                        <User2 className="w-5 h-5 text-gray-600" />
                        <h3 className="font-semibold text-gray-900">
                          Freelancer Details
                        </h3>
                      </div>
                      <p className="text-gray-600">{selectedProposal.freelancer}</p>
                    </div>

                    {/* Submission Date */}
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="w-5 h-5" />
                      <span>
                        Submitted on{" "}
                        {new Date(selectedProposal.submittedAt).toLocaleDateString()}
                      </span>
                    </div>

                    {/* Cover Letter */}
                    <div>
                      <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                        <FileText className="w-5 h-5 text-blue-600" />
                        Cover Letter
                      </h3>
                      <div className="bg-gray-50 p-4 rounded-xl">
                        <p className="text-gray-700 whitespace-pre-wrap">
                          {selectedProposal.coverLetter}
                        </p>
                      </div>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex gap-4 pt-4">
                      {selectedProposal.status === "pending" && (
                        <motion.button
                        onClick={() => {
                          handleAcceptProposal(selectedProposal._id);
                        }}
                          whileHover={{ scale: 1.02 }}
                          whileTap={{ scale: 0.98 }}
                          className="flex-1 px-6 py-3 bg-blue-600 text-white rounded-lg font-medium hover:bg-blue-700 transition-colors focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                        >
                          Accept Proposal
                        </motion.button>
                      )}
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={closeModal}
                        className="flex-1 px-6 py-3 bg-gray-100 text-gray-700 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                      >
                        Close
                      </motion.button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default JobDetails;