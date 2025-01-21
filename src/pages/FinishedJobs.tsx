import { useNavigate } from "react-router-dom";

const FinishedJobs = () => {
  const navigate = useNavigate();

  return (
    <div className="pt-16 sm:pt-0">
      You havent finished a job yet,{" "}
      <span
        onClick={() => {
          navigate("/home");
        }}
        className="text-blue-500 cursor-pointer"
      >
        find a job
      </span>
    </div>
  );
};

export default FinishedJobs;
