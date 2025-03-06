import React from 'react';
import Navbar from "../Components/Navbar";
import { motion } from "framer-motion";
import { FaCheckCircle } from "react-icons/fa";
import Whychooseus from '../Components/Whychooseus';
import Footer from '../Components/Footer';

const About = () => {
  return (
    <>
      <Navbar />
      <>
      
      
      <div className="min-h-screen bg-gradient-to-b from-black to-gray-900 text-white flex flex-col items-center justify-center p-10 overflow-hidden relative">
        {/* Background Elements */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          <div className="absolute top-10 left-0 w-32 h-32 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute bottom-10 right-0 w-32 h-32 bg-gradient-to-r from-green-400 to-blue-600 rounded-full filter blur-3xl opacity-70 animate-pulse"></div>
          <div className="absolute top-20 right-20 w-48 h-48 bg-gradient-to-r from-yellow-400 to-orange-500 rounded-full filter blur-3xl opacity-50 animate-bounce"></div>
          <div className="absolute bottom-20 left-20 w-48 h-48 bg-gradient-to-r from-blue-400 to-teal-400 rounded-full filter blur-3xl opacity-50 animate-bounce"></div>
        </div>

        <motion.div 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1 }} 
          className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center z-10"
        >
          {/* Left Side - Tagline & Description */}
          <div className="space-y-8">
            <h1 className="text-6xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-600 leading-tight animate-fade-in">
              Transforming Your Product Discovery Journey
            </h1>
            <motion.ul 
              className="space-y-4 text-lg text-gray-300" 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              transition={{ delay: 1.2, duration: 1 }}
            >
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-400" /> Personalized AI Recommendations
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-400" /> Instant Dealer Connectivity
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-400" /> Location-Based Dealer Search
              </li>
              <li className="flex items-center gap-2">
                <FaCheckCircle className="text-blue-400" /> Seamless User Experience
              </li>
            </motion.ul>
          </div>

          {/* Right Side - Image with Overlay & Feature List */}
          <div className="relative flex flex-col items-center space-y-8 animate-slide-in">
            <motion.img
              src="https://img.freepik.com/free-vector/wireframe-robot-ai-artificial-intelligence-form-cyborg-bot-brain-robotic-hand-digital-brain_127544-851.jpg"
              alt="AutoMatch AI"
              className="w-full max-w-lg rounded-lg shadow-xl object-cover border-4 border-blue-500"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 1 }}
            />
          </div>
        </motion.div>
      </div>
      <Whychooseus/>
      <Footer/>
      </>
    </>
  );
};

export default About;
