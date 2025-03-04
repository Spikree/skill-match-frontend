import { Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import CreateAccount from "./pages/CreateAccount";
import LandingPage from "./pages/LandingPage";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Home from "./pages/Home";
import ProtectedRoutes from "../utils/protectedRoutes";
import SidebarLayout from "./SidebarLayout";
import Job from "./pages/Job";
import AppliedJobs from "./pages/AppliedJobs";
import Profile from "./pages/Profile";
import SavedJobs from "./pages/SavedJobs";
import CurrentJob from "./pages/CurrentJob";
import FinishedJobs from "./pages/FinishedJobs";
import FreeLancerRoutes from "../utils/FreeLancerRoutes";
import NotFound from "./errorPages/NotFound";
import EmployerRoutes from "../utils/EmployerRoutes";
import Dashboard from "./pages/employer/Dashboard";
import PostJob from "./pages/employer/PostJob";
import JobDetails from "./pages/employer/JobDetails";
import OnGoingJobs from "./pages/employer/OnGoingJobs";
import OnGoingJobDetails from "./pages/employer/OnGoingJobDetails";
import ViewProfile from "./pages/ViewProfile";
import Chat from "./pages/Chat";
import ChatRoom from "./pages/chatRoom";
import EmpChat from "./pages/employer/EmpChat";


const App = () => {
  return (
    <div>
      <ToastContainer />
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />

        <Route element={<ProtectedRoutes />}>
        
          <Route element={<SidebarLayout />}>
          <Route path="/chat" element={<Chat/>}/>
          <Route path="/chatRoom/:id" element={<ChatRoom/>} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/viewProfile/:userId" element={<ViewProfile/>} />
            <Route element={<FreeLancerRoutes />}>
              <Route path="/home" element={<Home />} />
              <Route path="/job/:jobId" element={<Job />} />
              <Route path="/appliedjobs" element={<AppliedJobs />} />
              <Route path="/savedJobs" element={<SavedJobs />} />
              <Route path="/currentJob" element={<CurrentJob />} />
              <Route path="/finishedJobs" element={<FinishedJobs />} />
            </Route>
          </Route>

          <Route element={<EmployerRoutes />}>
            <Route element={<SidebarLayout />}>
            <Route path="/chatEmp" element={<EmpChat/>}/>
            <Route path="/chatRoom/:id" element={<ChatRoom/>} />
              <Route path="dashboard" element={<Dashboard />} />
              <Route path="postJob" element={<PostJob />} />
              <Route path="JobDetails/:jobId" element={<JobDetails />} />
              <Route path="getOnGoingJobs" element={<OnGoingJobs />} />
              <Route
                path="getOnGoingJobDetails/:jobId"
                element={<OnGoingJobDetails />}
              />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
