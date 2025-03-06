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
export const BotProductRecommendationMessage = ({ message, index, onFindDealers }) => {
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
            onFindDealers={onFindDealers}
          />
        </motion.div>
      </div>
    </motion.div>
  );
};

// Bot Message Component with Dealer Information
export const BotDealerInfoMessage = ({ message, index }) => {
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
          <DealerResults
            dealers={message.dealers}
            isLoading={message.isLoading}
            error={message.error}
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
          className="max-w-[90%] w-full p-5 rounded-2xl text-white bg-gradient-to-br from-gray-700 to-gray-800 shadow-lg border border-gray-700"
          whileHover={{ scale: 1.01 }}
        >
          <div className="prose prose-invert max-w-none">
            {message.content.split('\n').map((line, i) => (
              <p key={i}>{line}</p>
            ))}
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
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="flex items-center space-x-2 p-4 rounded-lg bg-gray-700 w-fit"
    >
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-md">
        <Bot size={16} className="text-white" />
      </div>
      <div className="flex space-x-1">
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0 }}
          className="w-2 h-2 rounded-full bg-gray-400"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.2 }}
          className="w-2 h-2 rounded-full bg-gray-400"
        />
        <motion.div
          animate={{ y: [0, -5, 0] }}
          transition={{ repeat: Infinity, duration: 0.8, delay: 0.4 }}
          className="w-2 h-2 rounded-full bg-gray-400"
        />
      </div>
    </motion.div>
  );
};

// Welcome Message Component
export const WelcomeMessage = () => {
  return (
    <div className="text-center p-6 bg-gray-800 rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">Welcome to AutoMatch AI</h2>
      <p className="mb-2">I can help you find the perfect vehicle based on your needs.</p>
      <p>Just start chatting to begin!</p>
    </div>
  );
};
