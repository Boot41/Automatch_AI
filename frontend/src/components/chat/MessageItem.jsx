import React from 'react';
import { motion } from 'framer-motion';
import { User, Bot, Trash2 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import ProductRecommendations from '../../Components/ProductRecommendations';
import DealerResults from '../../Components/DealerResults';

// User Message Component
export const UserMessage = ({ message, index, setShowMessageActions, showMessageActions, setMessageToDelete }) => {
  return (
    <motion.div
      key={`user-${index}`}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex justify-end mb-6 relative"
      onMouseEnter={() => setShowMessageActions(index)}
      onMouseLeave={() => setShowMessageActions(null)}
    >
      <div className="flex items-end">
        <motion.div
          className="w-full p-4 rounded-2xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 shadow-lg mr-2"
        >
          <p className="text-white">{message.content}</p>
        </motion.div>
        <div className="w-9 h-8 rounded-full bg-blue-600 flex items-center justify-center shadow-md">
          <User size={16} className="text-white rounded-full" />
        </div>
      </div>
    </motion.div>
  );
};

// Bot Message Component with Product Recommendations
export const BotProductRecommendationMessage = ({ message, index, handleFindDealers }) => {
  return (
    <motion.div
      key={`bot-${index}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-[100%] justify-start mb-6"
    >
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md mr-2">
          <Bot size={16} className="text-white" />
        </div>
        <motion.div
          className="max-w-[90%] w-full p-5 rounded-2xl text-white bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg border border-gray-700"
          whileHover={{ scale: 1.01 }}
        >
          <ProductRecommendations
            message={message.content}
            onFindDealers={handleFindDealers}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Bot Message Component with Dealer Information
export const BotDealerInfoMessage = ({ message, index, selectedProduct }) => {
  
  return (
    <motion.div
      key={`bot-${index}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full justify-start mb-6"
    >
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md mr-2">
          <Bot size={16} className="text-white" />
        </div>
        <motion.div
          className="max-w-[90%] w-full p-5 rounded-2xl text-white bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg border border-gray-700"
        >
          <DealerResults
            message={message.content}
            productName={selectedProduct}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Regular Bot Message Component
export const BotRegularMessage = ({ message, index }) => {
  return (
    <motion.div
      key={`bot-${index}`}
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
      className="flex w-full justify-start mb-6"
    >
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md mr-2">
          <Bot size={16} className="text-white" />
        </div>
        <motion.div
          className="max-w-[70%] p-4 rounded-2xl text-white bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg border border-gray-700"
        >
          <div className="prose prose-invert prose-sm max-w-none">
            <ReactMarkdown>{message.content}</ReactMarkdown>
          </div>
        </motion.div>
      </div>
    </motion.div>
  );
};

// Loading/Typing Indicator Component
export const TypingIndicator = () => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="flex justify-start"
    >
      <div className="flex items-start">
        <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md mr-2">
          <Bot size={16} className="text-white" />
        </div>
        <div className="p-4 rounded-2xl bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg border border-gray-700">
          <div className="flex space-x-2">
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-150"></div>
            <div className="w-2 h-2 rounded-full bg-indigo-400 animate-bounce delay-300"></div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

// Welcome Message Component
export const WelcomeMessage = () => {
  return (
    <div className="flex flex-col items-center justify-center h-full py-12">
      <div className="w-16 h-16 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg mb-4">
        <Bot size={32} className="text-white" />
      </div>
      <h3 className="text-xl font-bold text-white mb-2">Welcome to AutoMatch AI</h3>
      <p className="text-gray-400 text-center max-w-md">I'm your product recommendation assistant. Tell me what you're looking for, and I'll help you find the perfect match.</p>
    </div>
  );
};
