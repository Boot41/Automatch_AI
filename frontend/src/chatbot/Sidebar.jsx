import React, { useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import {  MessageSquare,  LogOut, User as UserIcon, LogIn, UserPlus } from "lucide-react";
import moment from "moment";
import { motion } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Sidebar({
  sessions,
  activeSession,
  onSelectSession,
  onNewChat,
  setSessions, // Add this prop
}) {
  const { axiosInstance, isTokenAvailable, logOutUser } = useAuth();
  const navigate = useNavigate();

  const handleSessionClick = async (sessionId) => {
    try {
      onSelectSession(sessionId);
      const response = await axiosInstance.get(
        `/ai/messages/${sessionId}`
      );

      if (response.data.messages) {
        onSelectSession(sessionId, response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  

  const groupSessionsByDate = (sessions) => {
    const today = moment().startOf("day");
    const yesterday = moment().subtract(1, "day").startOf("day");

    const grouped = {
      Today: [],
      Yesterday: [],
      "Last 7 Days": [],
      Older: [],
    };

    sessions.forEach((session) => {
      const sessionDate = moment(session.createdAt);
      if (sessionDate.isSame(today, "d")) {
        grouped.Today.push(session);
      } else if (sessionDate.isSame(yesterday, "d")) {
        grouped.Yesterday.push(session);
      } else if (sessionDate.isAfter(today.clone().subtract(7, "days"))) {
        grouped["Last 7 Days"].push(session);
      } else {
        grouped.Older.push(session);
      }
    });

    return grouped;
  };

  const groupedSessions = groupSessionsByDate(sessions);

  const renderSessions = (title, sessions) => (
    <div>
      {sessions.length > 0 && (
        <div>
          <h3 className="text-gray-400 uppercase text-xs font-bold mb-3 tracking-wider">
            {title}
          </h3>
          <div className="space-y-2">
            {sessions.map((session) => {
              const userMessage = session?.messages?.[0]?.content;
              let sessionTitle = userMessage?.slice(0, 28) + (userMessage?.length > 28 ? "..." : "");
              
              // If no user message, use a descriptive title
              if (!sessionTitle) {
                if (title === "Today") {
                  sessionTitle = "Today's Conversation";
                } else if (title === "Yesterday") {
                  sessionTitle = "Yesterday's Conversation";
                } else {
                  sessionTitle = `Conversation from ${moment(session.createdAt).format("MMM D")}`;  
                }
              }

              return (
                <motion.div
                  key={session?.id}
                  onClick={() => handleSessionClick(session.id)}
                  className={`p-3 cursor-pointer rounded-xl flex items-center gap-3 transition-all duration-200 ${
                    activeSession === session.id 
                      ? "bg-gradient-to-r from-indigo-600 to-indigo-700 shadow-md" 
                      : "hover:bg-gray-700"
                  }`}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                    activeSession === session.id ? "bg-indigo-500" : "bg-gray-700"
                  }`}>
                    <MessageSquare size={14} className="text-white" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-white truncate">
                      {sessionTitle}
                    </p>
                    <p className="text-xs text-gray-400 truncate">
                      {moment(session.createdAt).format("MMM D, h:mm A")}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <motion.div 
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ duration: 0.5 }}
      className="w-full h-full bg-gradient-to-br from-gray-900 to-gray-800 flex flex-col border-r border-gray-700 relative"
    >
      <ToastContainer />
      {/* Header */}
      <div className="p-4 border-b border-gray-700">
  <div className="flex items-center justify-between">
    {/* <HomeIcon
      className="text-white text-4xl w-[20%] cursor-pointer hover:text-indigo-600 transition duration-300"
      onClick={() => navigate('/')}
    /> */}
    <motion.button
      onClick={onNewChat}
      className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-4 rounded-xl transition duration-300 flex items-center justify-center shadow-lg"
      whileHover={{ scale: 1.03 }}
      whileTap={{ scale: 0.97 }}
    >
      New Chat
    </motion.button>
  </div>
</div>


      {/* Chat Sessions */}
      <div className="overflow-y-auto flex-1 custom-scrollbar p-4 space-y-6">
        {sessions.length > 0 ? (
          <>
            {renderSessions("Today", groupedSessions.Today)}
            {renderSessions("Yesterday", groupedSessions.Yesterday)}
            {renderSessions("Last 7 Days", groupedSessions["Last 7 Days"])}
            {renderSessions("Older", groupedSessions.Older)}
          </>
        ) : (
          <div className="flex flex-col items-center justify-center h-40 text-center">
            <MessageSquare size={32} className="text-gray-600 mb-2" />
            <p className="text-gray-500">No conversations yet</p>
            <p className="text-gray-600 text-sm mt-1">Start a new chat to begin</p>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="p-4 border-t border-gray-700 pb-[30px]">
        
        {isTokenAvailable ? (
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <div className="w-10 h-10 rounded-full bg-gradient-to-br from-indigo-500 to-indigo-600 flex items-center justify-center shadow-md">
                <UserIcon size={18} className="text-white" />
              </div>
              <div className="ml-3 flex-1">
                <p className="text-sm font-medium text-white">Signed In</p>
                <p className="text-xs text-gray-400">Premium Plan</p>
              </div>
            </div>
            <motion.button
              onClick={logOutUser}
              className="p-2 text-red-400 hover:text-red-300 rounded-full hover:bg-gray-700"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.9 }}
              title="Sign Out"
            >
              <LogOut size={18} />
            </motion.button>
          </div>
        ) : (
          <div className="flex flex-col space-y-3 mt-4 pt-3 border-t border-gray-700">
            <motion.button
              onClick={() => navigate('/signin')}
              className="flex items-center justify-center space-x-2 w-full p-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <LogIn size={16} />
              <span>Sign In</span>
            </motion.button>
            <motion.button
              onClick={() => navigate('/signup')}
              className="flex items-center justify-center space-x-2 w-full p-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <UserPlus size={16} />
              <span>Sign Up</span>
            </motion.button>
          </div>
        )}
      </div>
    </motion.div>
  );
}
