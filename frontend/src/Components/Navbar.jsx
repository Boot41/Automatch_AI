import React from "react";
import { MessageSquare } from "lucide-react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../store/auth.jsx";
import ProfileDropdown from "../Components/ProfileDropdown";

const Navbar = () => {
  const { isTokenAvailable } = useAuth();
  const routes = {
    Home: "/",
    Chat: "/chatbot",
    About: "/about",
    Contact: "/contact",
  };

  return (
    <motion.header
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8 }}
      className="bg-gradient-to-r from-gray-900 via-gray-800 to-gray-900 shadow-lg border-b border-gray-700 sticky top-0 z-50"
    >
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <motion.div
          className="flex items-center space-x-3"
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
        >
          <MessageSquare className="h-10 w-10 text-indigo-400 animate-spin-slow" />
          <span className="text-2xl font-extrabold text-indigo-400 tracking-widest">
            Automatch AI
          </span>
        </motion.div>

        <nav className="hidden md:flex space-x-10">
          {Object.keys(routes).map((item, index) => (
            <motion.div
              key={item}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.2 }}
              className="relative group"
            >
              <Link
                to={routes[item]}
                className="text-gray-300 hover:text-indigo-400 transition duration-300"
              >
                {item}
                <span className="absolute left-0 bottom-0 w-0 h-0.5 bg-indigo-400 transition-all group-hover:w-full"></span>
              </Link>
            </motion.div>
          ))}
        </nav>

        {/* <div className="flex items-center">
          <Link to="/" className="text-xl font-bold text-indigo-400">AutoMatch AI</Link>
        </div> */}
      </div>
    </motion.header>
  );
};

export default Navbar;
