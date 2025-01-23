import React, { useState } from "react";
import { motion } from "framer-motion";
import axiosInstance from "../../../utils/axiosInstance";

type FormData = {
  title: string;
  description: string;
  budget: string;
  skillsRequired: string[];
};

const PostJob: React.FC = () => {
  const [title, setTitle] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [budget, setBudget] = useState<string>('');
  const [skillsRequired, setSkillsRequired] = useState<string[]>([]);
  const [currentSkill, setCurrentSkill] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const postAJob = async (formData: FormData) => {
    try {
      setIsSubmitting(true);
      const response = await axiosInstance.post(`/job/createJob`, formData);
      console.log(response.data);
      // Reset form after successful submission
      setTitle('');
      setDescription('');
      setBudget('');
      setSkillsRequired([]);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const addSkill = () => {
    if (currentSkill.trim() && !skillsRequired.includes(currentSkill.trim())) {
      setSkillsRequired([...skillsRequired, currentSkill.trim()]);
      setCurrentSkill('');
    }
  };

  const removeSkill = (skillToRemove: string) => {
    setSkillsRequired(skillsRequired.filter(skill => skill !== skillToRemove));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const formData: FormData = {
      title,
      description,
      budget,
      skillsRequired
    };
    postAJob(formData);
  };

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8"
    >
      <motion.form 
        onSubmit={handleSubmit}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-lg mx-auto bg-white p-8 rounded-lg shadow-md"
      >
        <h2 className="text-2xl font-bold mb-6 text-center">Post a Job</h2>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Job Title</label>
          <motion.input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Job Description</label>
          <motion.textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Budget</label>
          <motion.input
            type="text"
            value={budget}
            onChange={(e) => setBudget(e.target.value)}
            required
            whileFocus={{ scale: 1.02 }}
            className="w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700 mb-2">Skills Required</label>
          <div className="flex mb-2">
            <motion.input
              type="text"
              value={currentSkill}
              onChange={(e) => setCurrentSkill(e.target.value)}
              placeholder="Add a skill"
              whileFocus={{ scale: 1.02 }}
              className="flex-grow px-3 py-2 border rounded-md mr-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <motion.button
              type="button"
              onClick={addSkill}
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              className="bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add
            </motion.button>
          </div>

          <div className="flex flex-wrap gap-2 mt-2">
            {skillsRequired.map((skill) => (
              <motion.div
                key={skill}
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                exit={{ scale: 0 }}
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full flex items-center"
              >
                {skill}
                <button
                  type="button"
                  onClick={() => removeSkill(skill)}
                  className="ml-2 text-red-500"
                >
                  ×
                </button>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.button
          type="submit"
          disabled={isSubmitting}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="w-full bg-blue-600 text-white py-3 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
        >
          {isSubmitting ? 'Submitting...' : 'Post Job'}
        </motion.button>
      </motion.form>
    </motion.div>
  );
};

export default PostJob;