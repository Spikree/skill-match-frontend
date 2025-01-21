import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FaDollarSign, FaTimes } from "react-icons/fa";

type Props = {
  toggleModal: () => void;
  applyToJob: (bidAmount: string, coverLetter: string) => void;
};

const ApplyModal = ({ toggleModal, applyToJob }: Props) => {
  const [bid, setBid] = useState<string>("");
  const [coverLetter, setCoverLetter] = useState<string>("");

  const handleSubmit = (bid: string, coverLetter: string) => {
    applyToJob(bid, coverLetter);
    toggleModal();
  };

  const overlayVariants = {
    hidden: { opacity: 0 },
    visible: { opacity: 1 },
  };

  const modalVariants = {
    hidden: {
      opacity: 0,
      y: 50,
      scale: 0.95,
    },
    visible: {
      opacity: 1,
      y: 0,
      scale: 1,
      transition: {
        type: "spring",
        damping: 25,
        stiffness: 300,
      },
    },
    exit: {
      opacity: 0,
      y: 50,
      scale: 0.95,
      transition: {
        duration: 0.2,
      },
    },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="hidden"
        variants={overlayVariants}
        className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center p-4 z-50"
      >
        <motion.div
          variants={modalVariants}
          initial="hidden"
          animate="visible"
          exit="exit"
          className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden"
        >
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-100 flex justify-between items-center">
            <h2 className="text-xl font-semibold text-gray-800">
              Submit Proposal
            </h2>
            <motion.button
              whileHover={{ rotate: 90 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleModal}
              className="text-gray-400 hover:text-gray-600 transition-colors"
            >
              <FaTimes size={20} />
            </motion.button>
          </div>

          <div className="p-6 space-y-6">
            {/* Bid Input */}
            <div className="space-y-2">
              <label
                htmlFor="bid"
                className="block text-sm font-medium text-gray-700"
              >
                Your Bid
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-3 flex items-center pointer-events-none">
                  <FaDollarSign className="text-gray-400" />
                </div>
                <input
                  id="bid"
                  type="number"
                  value={bid}
                  onChange={(e) => setBid(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder:text-gray-500 focus:ring-gray-200  transition-all"
                  placeholder="Enter your bid amount"
                />
              </div>
            </div>

            {/* Cover Letter Input */}
            <div className="space-y-2">
              <label
                htmlFor="coverLetter"
                className="block text-sm font-medium text-gray-700"
              >
                Cover Letter
              </label>
              <textarea
                id="coverLetter"
                value={coverLetter}
                onChange={(e) => setCoverLetter(e.target.value)}
                className="w-full px-4 py-3 bg-gray-50 border-0 rounded-lg text-gray-900 placeholder:text-gray-500 transition-all resize-none"
                rows={6}
                placeholder="Describe why you're the best fit for this project..."
              />
            </div>
          </div>

          {/* Actions */}
          <div className="px-6 py-4 bg-gray-50 flex gap-3 justify-end">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={toggleModal}
              className="px-4 py-2 text-gray-700 bg-white rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors text-sm font-medium"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => {
                handleSubmit(bid, coverLetter);
              }}
              className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-sm font-medium"
            >
              Submit Proposal
            </motion.button>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default ApplyModal;
