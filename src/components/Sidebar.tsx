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
  FiLogOut  
} from "react-icons/fi";

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [showProfileOptions, setShowProfileOptions] = useState(false);
  const navigate = useNavigate();

  const menuItems = [
    { title: "Applied Jobs", icon: <FiBriefcase size={20} /> },
    { title: "Finished Jobs", icon: <MdWorkHistory size={20} /> },
    { title: "Saved Jobs", icon: <FiBook size={20} /> },
    { title: "Current Job", icon: <FiStar size={20} /> },
  ];

  const profileOptions = [
    { title: "Profile", icon: <FiUser size={16} />, action: () => {} },
    { title: "Settings", icon: <FiSettings size={16} /> , action: () => {}},
    { title: "Logout", icon: <FiLogOut size={16} />, action: () => {localStorage.removeItem("token"); navigate('/login')} },
  ];

  return (
    <div className="flex">
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

        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center justify-center">
            <div className="h-10 w-10 bg-blue-500 rounded-lg flex items-center justify-center">
              <span className="text-white font-bold text-xl">S</span>
            </div>
            {isOpen && (
              <span className="ml-3 text-white font-semibold">Skill Match</span>
            )}
          </div>
        </div>

        <div className="flex flex-col p-4 gap-2" onClick={() => {setShowProfileOptions(false)}}>
          {menuItems.map((item, index) => (
            <button
              key={index}
              className="flex items-center text-gray-300 hover:bg-gray-700 rounded-lg px-4 py-3 transition-colors duration-200"
            >
              <span className="text-gray-400">{item.icon}</span>
              {isOpen && (
                <motion.span className="ml-3 font-medium">{item.title}</motion.span>
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
                <div onClick={() => {setShowProfileOptions(!showProfileOptions)}} className="bg-gray-700 rounded-lg shadow-lg overflow-hidden">
                  {profileOptions.map((option, index) => (
                    <button
                      key={index}
                      className="w-full flex items-center gap-3 px-4 py-3 text-gray-300 hover:bg-gray-600 transition-colors"
                      onClick={option.action}
                    >
                      <span className="text-gray-400">{option.icon}</span>
                      {isOpen && <span className="text-sm">{option.title}</span>}
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
              <div className="h-8 w-8 rounded-full bg-gray-600"></div>
              {isOpen && (
                <div className="ml-3">
                  <p className="text-sm font-medium text-gray-300">User Name</p>
                  <p className="text-xs text-gray-500">user@example.com</p>
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