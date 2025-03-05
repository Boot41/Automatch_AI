import React from 'react';
import { Bot, Sparkles, Star } from 'lucide-react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ChatHeader = ({ isTokenAvailable }) => {
  return (
    <motion.div
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="w-full p-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 border-b border-gray-700 flex items-center shadow-md"
    >
      <div className="flex items-center">
        <div className="relative">
          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
            <Link to="/">
            <Bot size={24} className="text-white" />
            </Link>
            
          </div>
          {isTokenAvailable && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.3, type: 'spring' }}
              className="absolute -bottom-1 -right-1 w-5 h-5 bg-green-500 rounded-full border-2 border-gray-800 flex items-center justify-center"
            >
              <Sparkles size={10} className="text-white" />
            </motion.div>
          )}
        </div>
        <div className="ml-3">
          <div className="flex items-center">
            <h3 className="font-bold text-white text-lg">AutoMatch AI</h3>
            <div className="flex items-center ml-2 bg-indigo-900/50 px-2 py-0.5 rounded-full">
              <Star size={12} className="text-yellow-400 mr-1" />
              <span className="text-xs text-indigo-300 font-medium">Premium</span>
            </div>
          </div>
          <p className="text-xs text-gray-300">Product Recommendation Expert</p>
        </div>
      </div>
      <div className="ml-auto">
        {isTokenAvailable ? (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gradient-to-r from-green-500 to-emerald-600 text-white shadow-sm">
            <span className="w-2 h-2 mr-1 bg-white rounded-full animate-pulse"></span>
            Active Session
          </span>
        ) : (
          <span className="inline-flex items-center px-3 py-1 rounded-full text-xs font-medium bg-gray-700 text-gray-300 shadow-sm">
            <span className="w-2 h-2 mr-1 bg-gray-500 rounded-full"></span>
            Guest Mode
          </span>
        )}
      </div>
    </motion.div>
  );
};

export default ChatHeader;
