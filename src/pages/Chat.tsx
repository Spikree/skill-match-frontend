import { useEffect, useState } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";

type JobType = {
  _id: string;
  freelancer: string;
  jobId: string;
  jobTitle: string;
  jobDescription: string;
  jobStatus: string;
  payCheck: string;
  employer: string;
};

const Chat = () => {
  const [currentJobs, setCurrentJobs] = useState<JobType[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useNavigate();

  useEffect(() => {
    const getCurrentJobs = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/job/getCurrentJob");
        setCurrentJobs(response.data.currJob);
        console.log(response.data.currJob);
      } catch (error) {
        setError("Failed to load current jobs");
        console.error(error);
      } finally {
        setIsLoading(false);
      }
    };
    getCurrentJobs();
  }, []);

  const openChat = (toChatId: string) => {
    router(`/chatRoom/${toChatId}`)
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  if (error) {
    return <div className="text-red-500 text-center mt-8">{error}</div>;
  }

  return (
    <div className="max-w-screen-xl mx-auto px-4 py-8 h-full overflow-y-auto">
      <div className="grid grid-cols-1 gap-6">
        {currentJobs.map((job: JobType) => (
          <div key={job._id} className="bg-white shadow-md rounded-lg p-6">
            <h2 className="text-2xl font-bold mb-4">{job.jobTitle}</h2>
            <p className="text-gray-700 mb-6 break-words">
              {job.jobDescription}
            </p>
            <button onClick={() => openChat(job.employer)} className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded">
              Chat
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Chat;
