import React from 'react';
import { Send, AlertCircle, Pencil } from 'lucide-react';
import { motion } from 'framer-motion';

const ChatInput = ({ isTokenAvailable, input, setInput, handleKeyDown, handleSendMessage, loading }) => {
  return (
    <motion.div
      initial={{ y: 20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3, delay: 0.1 }}
      className="w-full p-[17px] bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 flex gap-3 border-t border-gray-700 shadow-lg"
    >
      {!isTokenAvailable ? (
        <div className="flex-1 p-4 bg-gray-800/80 rounded-xl flex items-center justify-center text-gray-300 border border-gray-700 backdrop-blur-sm">
          <div className="flex items-center">
            <AlertCircle size={18} className="mr-2 text-yellow-500" />
            <span>Sign in from the sidebar to start chatting</span>
          </div>
        </div>
      ) : (
        <>
          <div className="flex-1 bg-gray-800/70 rounded-xl shadow-inner border border-gray-700 flex items-center overflow-hidden">
            <div className="flex items-center px-3">
              <motion.button
                className="text-gray-400 hover:text-indigo-400 p-2 rounded-full"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <Pencil size={20} />
              </motion.button>
            </div>

            <motion.input
              type="text"
              className="flex-1 p-3 bg-transparent outline-none text-white placeholder-gray-400 border-none"
              placeholder="Ask AutoMatch AI about products..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={handleKeyDown}
              whileFocus={{ scale: 1.01 }}
            />

            
          </div>

          <motion.button
            onClick={handleSendMessage}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 p-4 px-6 rounded-xl shadow-lg transition duration-300 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
            whileHover={{ scale: 1.05, boxShadow: '0 0 15px rgba(99, 102, 241, 0.5)' }}
            whileTap={{ scale: 0.95 }}
            disabled={loading || !input.trim()}
          >
            <Send size={20} className="text-white" />
          </motion.button>
        </>
      )}
    </motion.div>
  );
};

export default ChatInput;
