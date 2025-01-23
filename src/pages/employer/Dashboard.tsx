import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  return (
    <div className="p-10">
        <p>You are navigated to dashboard because you logged in as employer, employer ui is not built yet</p>
      <button
      className="bg-red-300 px-4 py-2 text-white rounded-md"
        onClick={() => {
          localStorage.removeItem("token");
          localStorage.removeItem("username");
          localStorage.removeItem("useremail");
          localStorage.removeItem("role");
          navigate("/");
        }}
      >
        logout
      </button>
    </div>
  );
};

export default Dashboard;
