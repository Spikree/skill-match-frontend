import { useState } from "react";
import axiosInstance from "../../../utils/axiosInstance";

type formData = {
  title: string;
  description: string;
  budget: string;
  skillsRequired: string[];
};

const PostJob = () => {

    const [title, setTitle] = useState<string>('');
    const [description, setDescription] = useState<string>('');
    const [budget, setBudget] = useState<string>('');
    const [skillsRequired, setSkillsRequired] = useState<string[]>([]);

    const formData = {
        title: title,
        description: description,
        budget: budget,
        skillsRequired: skillsRequired
    }

  const postAJob = async (formData: formData) => {
    try {
      const response = await axiosInstance.post(`/job/createJob`, formData);
      console.log(response)
    } catch (error) {
      console.log(error);
    }
  };

  return <div className="pt-14 sm:pt-0">PostJob</div>;
};

export default PostJob;
