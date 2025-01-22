import { Outlet, Navigate } from "react-router-dom";

const FreeLancerRoutes = () => {
    const role = localStorage.getItem("role")
    return role === "freelancer" ? <Outlet/> : <Navigate to={"/login"} />
}

export default FreeLancerRoutes