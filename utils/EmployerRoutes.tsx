import { Outlet, Navigate } from "react-router-dom";

const EmployerRoutes = () => {
  const role = localStorage.getItem("role");
  return role === "employer" ? <Outlet /> : <Navigate to={"/home"} />;
};

export default EmployerRoutes
