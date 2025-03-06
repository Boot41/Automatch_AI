import React from 'react';
import Navbar from "../Components/Navbar";

const About = () => {
  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-gray-900 text-white flex items-center justify-center p-8">
        <div className="max-w-6xl w-full grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
          {/* Left Side - Tagline & Description */}
          <div className="space-y-8">
            <h1 className="text-6xl font-extrabold text-blue-400 leading-tight animate-fade-in">
              Transforming Your Product Discovery Journey
            </h1>
            <p className="text-lg text-gray-400 leading-relaxed">
              Welcome to <span className="text-blue-500 font-semibold">AutoMatch AI</span>, your personalized product recommendation companion. Our AI chatbot bridges the gap between your needs and the perfect products by analyzing your preferences and instantly connecting you with trusted local dealers.
            </p>
            <p className="text-lg text-gray-400 leading-relaxed">
              Experience the power of smart recommendations, making your buying journey seamless, intelligent, and hassle-free.
            </p>
            <button className="bg-gradient-to-r from-blue-600 to-blue-400 hover:from-blue-500 hover:to-blue-300 text-white px-8 py-3 rounded-lg shadow-xl transition duration-500 transform hover:scale-105">
              Discover More
            </button>
          </div>

          {/* Right Side - Image with Overlay */}
          <div className="relative flex justify-center animate-slide-in">
            <img
              src="https://img.freepik.com/free-vector/wireframe-robot-ai-artificial-intelligence-form-cyborg-bot-brain-robotic-hand-digital-brain_127544-851.jpg"
              alt="AutoMatch AI"
              className="w-full max-w-lg rounded-lg shadow-xl object-cover border-4 border-blue-500"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black to-transparent opacity-50 rounded-lg"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default About;