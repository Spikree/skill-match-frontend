import React, { useState } from "react";
import { motion } from "framer-motion";
import {
  PlusCircle,
  X,
  BriefcaseIcon,
  DollarSign,
  Sparkles,
} from "lucide-react";
import axiosInstance from "../../../utils/axiosInstance";
import { ToastContainer, toast } from "react-toastify";

type FormData = {
  title: string;
  description: string;
  budget: string;
  skillsRequired: string[];
};

function App() {
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [budget, setBudget] = useState<string>("");
  const [skillsRequired, setSkillsRequired] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const postAJob = async (formData: FormData) => {
    try {
     const response = await axiosInstance.post('/job/createJob', formData)
     console.log(response)
     toast.success(response.data.message)
     setTitle("")
     setDescription("")
     setBudget("")
     setSkillsRequired([])
     setIsSubmitting(false)
    } catch (error) {
      console.error(error);
      toast.error(error.response.data.message)
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skillsRequired.includes(currentSkill.trim())) {
      setSkillsRequired([...skillsRequired, currentSkill.trim()]);
      setCurrentSkill("");
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsRequired(
      skillsRequired.filter((skill) => skill !== skillToRemove)
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: FormData = {
      title,
      description,
      budget,
      skillsRequired,
    };
    postAJob(formData);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      e.preventDefault();
      addSkill();
    }
  };

  return (
    <div className="h-full bg-gradient-to-br py-12 px-4 sm:px-6 lg:px-8 overflow-y-auto pt-14 sm:pt-0">
      <ToastContainer/>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-2xl mx-auto"
      >
         <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2 }}
            className="inline-block p-3 bg-blue-100 rounded-full mb-4"
          >
            <BriefcaseIcon className="w-8 h-8 text-blue-600" />
          </motion.div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Post a New Job</h1>
          <p className="text-gray-600">Fill in the details below to create your job posting</p>
        </div>

        <motion.form
          onSubmit={handleSubmit}
          className="bg-white rounded-xl shadow-xl overflow-hidden"
        >
          <div className="p-8">
            <div className="space-y-6">
              {/* Job Title */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Title
                </label>
                <motion.input
                  type="text"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  required
                  whileFocus={{ scale: 1.01 }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                  placeholder="e.g. Senior Frontend Developer"
                />
              </div>

              {/* Job Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Job Description
                </label>
                <motion.textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  required
                  whileFocus={{ scale: 1.01 }}
                  className="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out min-h-[120px]"
                  placeholder="Describe the job requirements and responsibilities..."
                  rows={4}
                />
              </div>

              {/* Budget */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Budget
                </label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <motion.input
                    type="text"
                    value={budget}
                    onChange={(e) => setBudget(e.target.value)}
                    required
                    whileFocus={{ scale: 1.01 }}
                    className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                    placeholder="e.g. $5,000 - $7,000"
                  />
                </div>
              </div>

              {/* Skills Required */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Skills Required
                </label>
                <div className="flex gap-2 mb-3">
                  <div className="relative flex-grow">
                    <Sparkles className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                    <motion.input
                      type="text"
                      value={currentSkill}
                      onChange={(e) => setCurrentSkill(e.target.value)}
                      onKeyPress={handleKeyPress}
                      whileFocus={{ scale: 1.01 }}
                      className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 ease-in-out"
                      placeholder="Add required skills..."
                    />
                  </div>
                  <motion.button
                    type="button"
                    onClick={addSkill}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
                  >
                    <PlusCircle className="w-5 h-5" />
                    Add
                  </motion.button>
                </div>

                <div className="flex flex-wrap gap-2">
                  {skillsRequired.map((skill) => (
                    <motion.span
                      key={skill}
                      initial={{ scale: 0 }}
                      animate={{ scale: 1 }}
                      exit={{ scale: 0 }}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-blue-50 text-blue-700 group hover:bg-blue-100 transition-colors"
                    >
                      {skill}
                      <button
                        type="button"
                        onClick={() => removeSkill(skill)}
                        className="ml-2 p-0.5 rounded-full hover:bg-blue-200 transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.span>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="px-8 py-6 bg-gray-50 border-t border-gray-100">
            <motion.button
              type="submit"
              disabled={isSubmitting}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="w-full py-3 px-6 rounded-lg bg-gradient-to-r from-blue-600 to-blue-700 text-white font-medium shadow-lg shadow-blue-500/30 hover:shadow-xl hover:shadow-blue-500/40 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 ease-in-out"
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center gap-2">
                  <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                      fill="none"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Posting Job...
                </span>
              ) : (
                "Post Job"
              )}
            </motion.button>
          </div>
        </motion.form>
      </motion.div>
    </div>
  );
}

export default App;
