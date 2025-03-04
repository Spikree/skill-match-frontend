import { useState } from "react";
import { MdWorkHistory } from "react-icons/md";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  FiChevronLeft,
  FiChevronRight,
  FiBriefcase,
  FiBook,
  FiStar,
  FiUser,
  FiSettings,
  FiLogOut,
  FiHome,
  FiPlusCircle,
  // FiCloudSnow,
  FiSave,
  // FiClipboard,
} from "react-icons/fi";
import { MessageSquareText } from "lucide-react";



const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(true);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const navigate = useNavigate();

  const username = localStorage.getItem("username");
  const useremail = localStorage.getItem("useremail");
  const userRole = localStorage.getItem("role");

  const dontShowProfileOptions = () => {
    if (showProfileOptions) {
      setShowProfileOptions(false);
    }
  };

  const freelancerMenuItems = [
    { title: "Home", icon: <FiHome size={20} />, to: "/home" },
    {
      title: "Applied Jobs",
      icon: <FiBriefcase size={20} />,
      to: "/appliedjobs",
    },
    {
      title: "Finished Jobs",
      icon: <MdWorkHistory size={20} />,
      to: "/finishedJobs",
    },
    { title: "Saved Jobs", icon: <FiBook size={20} />, to: "/savedJobs" },
    { title: "Current Job", icon: <FiStar size={20} />, to: "/currentJob" },
    { title: "Chat", icon: <MessageSquareText size={20}/>, to: "/chat" },
  ];

  const employerMenuItems = [
    { title: "dashboard", icon: <FiHome size={20} />, to: "/dashboard" },
    {
      title: "Post Job",
      icon: <FiPlusCircle size={20} />,
      to: "/postJob",
    },
    {
      title: "Jobs in progress",
      icon: <FiSave size={20} />,
      to: "/getOnGoingJobs",
    },
    { title: "Chat", icon: <MessageSquareText size={20}/>, to: "/chatEmp" },
  ];

  const profileOptions = [
    {
      title: "Profile",
      icon: <FiUser size={16} />,
      action: () => {
        navigate("/profile");
      },
    },
    { title: "Settings", icon: <FiSettings size={16} />, action: () => {} },
    {
      title: "Logout",
      icon: <FiLogOut size={16} />,
      action: () => {
        localStorage.removeItem("token");
        localStorage.removeItem("username");
        localStorage.removeItem("useremail");
        localStorage.removeItem("role");
        navigate("/login");
      },
    },
  ];

  const menuItems =
    userRole === "employer" ? employerMenuItems : freelancerMenuItems;

  return (
    <div className=" hidden sm:flex" onClick={dontShowProfileOptions}>
      <div
        className={`${
          isOpen ? "w-64" : "w-20"
        } bg-gray-800 flex flex-col transition-all duration-300 h-screen relative`}
      >
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="sm:flex hidden absolute -right-3 top-8 bg-gray-800 text-white rounded-full p-1.5 border border-gray-600 hover:bg-gray-700 focus:outline-none"
        >
          {isOpen ? <FiChevronLeft size={16} /> : <FiChevronRight size={16} />}
        </button>

        <div
          onClick={() => navigate("/home")}
          className="p-4 border-b border-gray-700"
        >
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            {isOpen && (
              <span className="ml-3 text-white font-semibold">Skill Match</span>
            )}
          </div>
        </div>

        <div
          className="flex flex-col p-4 gap-2"
          onClick={() => {
            setShowProfileOptions(false);
          }}
        >
          {menuItems.map((item, index) => (
            <button
              key={index}
              onClick={() => navigate(item.to)}
              className="flex items-center text-gray-300 hover:bg-gray-700 rounded-lg px-4 py-3 transition-colors duration-200"
            >
              <span className="text-gray-400">{item.icon}</span>
              {isOpen && (
                <motion.span className="ml-3 font-medium">
                  {item.title}
                </motion.span>
              )}
            </button>
          ))}
        </div>

        <div className="relative mt-auto">
          <AnimatePresence>
            {showProfileOptions && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.2 }}
                className="absolute bottom-full mb-2 w-full px-4"
              >
                <div
                  onClick={() => {
                    setShowProfileOptions(!showProfileOptions);
                  }}
                  className="bg-gray-700 rounded-lg shadow-lg overflow-hidden"
                >
                  {profileOptions.map((option, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-600 transition-colors"
                      onClick={option.action}
                    >
                      <span className="text-gray-400">{option.icon}</span>
                      {isOpen && (
                        <span className="text-sm">{option.title}</span>
                      )}
                    </button>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div
            onClick={() => setShowProfileOptions(!showProfileOptions)}
            className="p-4 border-t border-gray-700 cursor-pointer hover:bg-gray-700 transition-colors"
          >
            <div className="flex items-center">
              <div className="h-8 w-8 rounded-full bg-gray-600 text-white flex justify-center items-center">
                {username?.charAt(0).toUpperCase()}
              </div>

              {isOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-300">
                    {username}
                  </p>
                  <p className="text-xs text-gray-500">{useremail}</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
