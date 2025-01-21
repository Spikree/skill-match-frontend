import { useState } from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import {
  FaBriefcase,
  FaUserTie,
  FaComments,
  FaStar,
  FaShieldAlt,
  FaChartLine,
  FaUsers,
  FaArrowRight,
  FaHandshake
} from "react-icons/fa";

const LandingPage = () => {
  const [isHovered, setIsHovered] = useState<number | null>(null);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: {
      y: 0,
      opacity: 1
    }
  };

  const features = [
    {
      icon: <FaBriefcase size={24} />,
      title: "Post Projects",
      description: "Easily post your projects and find the perfect freelancer"
    },
    {
      icon: <FaUserTie size={24} />,
      title: "Expert Freelancers",
      description: "Access a global network of skilled professionals"
    },
    {
      icon: <FaComments size={24} />,
      title: "Secure Messaging",
      description: "Communicate seamlessly with integrated messaging"
    },
    {
      icon: <FaStar size={24} />,
      title: "Rating System",
      description: "Make informed decisions with our trusted review system"
    },
    {
      icon: <FaShieldAlt size={24} />,
      title: "Secure Payments",
      description: "Protected payments and dispute resolution"
    },
    {
      icon: <FaChartLine size={24} />,
      title: "Track Progress",
      description: "Monitor your projects with real-time updates"
    }
  ];

  const stats = [
    { number: "50K+", label: "Freelancers" },
    { number: "100K+", label: "Completed Projects" },
    { number: "30K+", label: "Active Clients" },
    { number: "95%", label: "Satisfaction Rate" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-20 pb-16 text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="flex items-center justify-center mb-8"
          >
            <FaHandshake className="text-6xl text-purple-600 mr-4" />
            <h2 className="text-4xl font-bold text-gray-900">SkillMatch</h2>
          </motion.div>
          
          <motion.h1
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="text-5xl md:text-6xl font-bold text-gray-900 mb-6"
          >
            Where{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-blue-600">
              Talent
            </span>{" "}
            Meets{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
              Opportunity
            </span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
            className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto"
          >
            Connect with top freelancers, manage projects, and grow your business
            with our secure and efficient platform.
          </motion.p>

          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="flex flex-col sm:flex-row gap-4 justify-center"
          >
            <Link
              to="/login"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-white bg-gradient-to-r from-purple-600 to-blue-600 rounded-lg hover:from-purple-700 hover:to-blue-700 transition-all duration-200"
            >
              Get Started <FaArrowRight className="ml-2" />
            </Link>
           
          </motion.div>
        </div>
      </motion.div>


      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="bg-white py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
            {stats.map((stat, index) => (
              <motion.div
                key={index}
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl font-bold text-gray-900 mb-2">
                  {stat.number}
                </div>
                <div className="text-gray-600">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true }}
        className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto"
      >
        <motion.div variants={itemVariants} className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Everything You Need to Succeed
          </h2>
          <p className="text-gray-600 max-w-2xl mx-auto">
            SkillMatch provides all the tools and features you need to find work,
            manage projects, and grow your business.
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              variants={itemVariants}
              onHoverStart={() => setIsHovered(index)}
              onHoverEnd={() => setIsHovered(null)}
              className="bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow duration-200"
            >
              <motion.div
                animate={{
                  scale: isHovered === index ? 1.1 : 1,
                  color: isHovered === index ? "#6366f1" : "#4b5563"
                }}
                className="mb-4"
              >
                {feature.icon}
              </motion.div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">
                {feature.title}
              </h3>
              <p className="text-gray-600">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true }}
        className="bg-gradient-to-r from-purple-600 to-blue-600 py-16"
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-8">
            Join SkillMatch Today
          </h2>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/create-account"
              className="inline-flex items-center justify-center px-8 py-3 text-base font-medium text-purple-600 bg-white rounded-lg hover:bg-gray-50 transition-all duration-200"
            >
              Join as Freelancer <FaUsers className="ml-2" />
            </Link>
            
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default LandingPage;