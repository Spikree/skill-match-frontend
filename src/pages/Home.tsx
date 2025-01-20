import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

type Job = {
  title: string;
  description: string;
  skillsRequired: string[];
  budget: string;
  createdAt: string; 
  employer: string;
  status: string;
  _id: string;
}

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
    <div className="w-full max-w-8xl mx-auto  rounded-lg shadow-lg overflow-hidden">
      {jobs.map((job, index) => (
        <div key={index} className="p-6">
          <div className="mb-4">
            <h1 className="text-3xl font-semibold text-gray-800 mb-2">
              {job.title}
            </h1>
            <p className="text-gray-600 mb-4">{job.description}</p>
            {job.skillsRequired.map((skill, idx) => (
              <span
                key={idx}
                className="inline-block bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {skill}
              </span>
            ))}
          </div>

          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-medium text-gray-800">Budget</h2>
              <p className="text-gray-600 text-sm">{job.budget}</p>
            </div>
            <div>
              <h3 className="text-xl font-medium text-gray-800">Created At</h3>
              <p className="text-gray-600 text-sm">{new Date(job.createdAt).toLocaleDateString()}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default Home;
