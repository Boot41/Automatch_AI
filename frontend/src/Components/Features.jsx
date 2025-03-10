import React from 'react';
import { motion } from 'framer-motion';
import { MessageSquare, MapPin, Search } from "lucide-react";

const Features = () => {
  return (
    <motion.section 
      initial={{ opacity: 0, y: 50 }} 
      animate={{ opacity: 1, y: 0 }} 
      transition={{ duration: 1 }} 
      className="py-16 bg-gray-900 relative overflow-hidden md:px-1 px-2"
    >
      <div className="text-center mb-16 relative">
        <motion.h2 
          initial={{ opacity: 0, y: -50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.4 }} 
          className="text-3xl md:text-5xl font-bold text-indigo-400 mb-3 md:mb-4"
        >
          How It Works
        </motion.h2>
        <motion.p 
          initial={{ opacity: 0, y: 50 }} 
          animate={{ opacity: 1, y: 0 }} 
          transition={{ duration: 1, delay: 0.6 }} 
          className="text-[16px] md:text-xl text-gray-400 max-w-3xl mx-auto"
        >
          Our AI-powered platform makes finding your perfect product simple and intuitive.
        </motion.p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">
        {[{
          icon: MessageSquare,
          title: "Chat with AI",
          description: "Tell our AI chatbot what you're looking for in a conversational way. No complex forms to fill out."
        }, {
          icon: Search,
          title: "Get Recommendations",
          description: "Our AI analyzes your preferences and recommends the perfect products that match your needs."
        }, {
          icon: MapPin,
          title: "Find Nearby Dealers",
          description: "Discover local dealers who have your desired product in stock, with directions and contact info."
        }].map((feature, index) => (
          <motion.div 
            key={index} 
            initial={{ opacity: 0, y: 50 }} 
            animate={{ opacity: 1, y: 0 }} 
            transition={{ duration: 0.4, delay: 0.3 + index * 0.6 }} 
            whileHover={{ scale: 1.08 }} 
            className="bg-gray-800 p-4 md:p-8 rounded-lg text-center shadow-md transition duration-200 ease-in-out"
          >
            <div className="bg-indigo-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
              <feature.icon className="h-8 w-8 text-indigo-600" />
            </div>
            <h3 className="text-xl font-semibold text-white mb-3">
              {feature.title}
            </h3>
            <p className="text-gray-400">
              {feature.description}
            </p>
          </motion.div>
        ))}
      </div>
    </motion.section>
  );
};

export default Features;
