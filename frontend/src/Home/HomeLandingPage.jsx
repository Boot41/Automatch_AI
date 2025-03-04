import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import Navbar from "../Components/Navbar";

const HomeLandingPage = () => {
  return (
    <>
    
    <Navbar/>
    <motion.section 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1 }} 
      className="relative text-center mx-auto p-10 h-screen md:pt-36 bg-gray-900 overflow-hidden"
    >
      {/* Background Effects */}
      <div className="absolute inset-0 pointer-events-none">
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 1, delay: 0.3 }} 
          className="absolute w-96 h-96 bg-indigo-700 opacity-30 rounded-full blur-3xl top-10 left-10 animate-pulse"
        ></motion.div>
        <motion.div 
          initial={{ scale: 0 }} 
          animate={{ scale: 1 }} 
          transition={{ duration: 1, delay: 0.6 }} 
          className="absolute w-72 h-72 bg-purple-600 opacity-20 rounded-full blur-3xl bottom-10 right-20 animate-pulse"
        ></motion.div>
      </div>

      <motion.h1 
        initial={{ opacity: 0, y: -50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, delay: 0.4 }} 
        className="max-w-[1200px] text-center mx-auto relative text-4xl md:text-8xl font-bold text-white mb-6 drop-shadow-lg"
      >
        Find Your Dream Product, {" "}
        <span className="text-indigo-400">Effortlessly with AI</span>
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 50 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 1, delay: 0.6 }} 
        className="relative text-xl text-gray-400 max-w-3xl mx-auto mb-10"
      >
        Our AI chatbot recommends the perfect products based on your
        preferences and matches you with nearby dealers.
      </motion.p>
      <motion.div 
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 1, delay: 0.8 }} 
        className="relative flex flex-col sm:flex-row justify-center gap-4"
      >
        <Link
          to="/chatbot"
          className="relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-white border-2 border-indigo-600 rounded-full hover:text-white group"
        >
          <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease-in-out"></span>
          <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="relative">Start Chatting</span>
        </Link>

        <Link
          to="/about"
          className="relative inline-flex items-center px-12 py-3 overflow-hidden text-lg font-medium text-white border-2 border-indigo-600 rounded-full hover:text-white group"
        >
          <span className="absolute left-0 block w-full h-0 transition-all bg-indigo-600 opacity-100 group-hover:h-full top-1/2 group-hover:top-0 duration-400 ease-in-out"></span>
          <span className="absolute right-0 flex items-center justify-start w-10 h-10 duration-300 transform translate-x-full group-hover:translate-x-0 ease">
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M14 5l7 7m0 0l-7 7m7-7H3"
              ></path>
            </svg>
          </span>
          <span className="relative">Learn More</span>
        </Link>
      </motion.div>
    </motion.section>
  </>
  );
};

export default HomeLandingPage;
