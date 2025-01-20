import { Outlet } from "react-router-dom";
import Sidebar from "./components/Sidebar";

const SidebarLayout = () => {
  return (
    <div className="flex h-screen">
      <Sidebar />

      <div className="flex-grow bg-gray-100 p-6">
        <Outlet />
      </div>
    </div>
  );
};

export default SidebarLayout;
