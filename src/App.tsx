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

const App = () => {
  return (
    <div className="">
      <ToastContainer />
      <Routes>
        <Route path="*" element={<NotFound />} />

        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/create-account" element={<CreateAccount />} />

        <Route element={<ProtectedRoutes />}>
          <Route element={<FreeLancerRoutes />}>
            <Route element={<SidebarLayout />}>
              <Route path="/home" element={<Home />} />
              <Route path="/job/:jobId" element={<Job />} />
              <Route path="/appliedjobs" element={<AppliedJobs />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/savedJobs" element={<SavedJobs />} />
              <Route path="/currentJob" element={<CurrentJob />} />
              <Route path="/finishedJobs" element={<FinishedJobs />} />
            </Route>
          </Route>

          <Route element={<EmployerRoutes />}>
            <Route element={<SidebarLayout />}>
              <Route path="dashboard" element={<Dashboard />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </div>
  );
};

export default App;
