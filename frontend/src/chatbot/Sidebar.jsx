import React, { useState } from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { Home, Plus, MessageSquare, Trash2, LogOut, Settings, User as UserIcon, X, LogIn, UserPlus, HomeIcon } from "lucide-react";
import moment from "moment";
import { motion, AnimatePresence } from "framer-motion";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

export default function Sidebar({
  sessions,
  activeSession,
  onSelectSession,
  onNewChat,
  setSessions, // Add this prop
}) {
  const [sessionToDelete, setSessionToDelete] = useState(null);
  const { axiosInstance, isTokenAvailable, storingTokenInLS, userAuthentication, logOutUser } = useAuth();
  const navigate = useNavigate();

  const handleSessionClick = async (sessionId) => {
    try {
      onSelectSession(sessionId);
      const response = await axiosInstance.get(
        `http://localhost:3000/api/v1/ai/messages/${sessionId}`
      );

      if (response.data.messages) {
        onSelectSession(sessionId, response.data.messages);
      }
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };
  
  // Handle session deletion
  const confirmDeleteSession = (e, sessionId) => {
    e.stopPropagation();
    setSessionToDelete(sessionId);
  };
  
  const deleteSession = async () => {
    if (!sessionToDelete) return;
    
    setIsDeleting(true);
    try {
      await axiosInstance.delete(`http://localhost:3000/api/v1/ai/sessions/${sessionToDelete}`);
      
      // Update sessions state by filtering out the deleted session
      setSessions(prevSessions => prevSessions.filter(session => session.id !== sessionToDelete));
      
      // If the deleted session was active, create a new chat
      if (activeSession === sessionToDelete) {
        onNewChat();
      }
      
      toast.success('Session deleted successfully');
      const updatedSessions = sessions.filter(session => session.id !== sessionToDelete);
      
      // If active session was deleted, select another one or clear messages
      if (activeSession === sessionToDelete) {
        if (updatedSessions.length > 0) {
          onSelectSession(updatedSessions[0].id);
        } else {
          onSelectSession(null);
        }
      }
      
      // Reload sessions from parent component
      window.location.reload();
      
      toast.success('Chat session deleted successfully');
    } catch (error) {
      console.error('Error deleting session:', error);
      toast.error('Failed to delete chat session');
    } finally {
      setIsDeleting(false);
      setSessionToDelete(null);
    }
  };
  
  const cancelDelete = () => {
    setSessionToDelete(null);
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
              const sessionTitle = userMessage?.slice(0, 28) + (userMessage?.length > 28 ? "..." : "") || "New Conversation";

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
      {/* Delete confirmation modal */}
      {/* <AnimatePresence>
        {sessionToDelete && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-sm w-full border border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">Delete Chat Session</h3>
                <button 
                  onClick={cancelDelete}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              <p className="text-gray-300 mb-6">Are you sure you want to delete this chat session? This action cannot be undone.</p>
              <div className="flex justify-end space-x-3">
                <button
                  onClick={cancelDelete}
                  className="px-4 py-2 bg-gray-700 hover:bg-gray-600 text-white rounded-lg transition-colors"
                  disabled={isDeleting}
                >
                  Cancel
                </button>
                <button
                  onClick={deleteSession}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center"
                  disabled={isDeleting}
                >
                  {isDeleting ? 'Deleting...' : 'Delete'}
                  {isDeleting && (
                    <svg className="animate-spin ml-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  )}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
      
      {/* Authentication Modal */}
      {/* <AnimatePresence>
        {showAuthModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
          >
            <motion.div 
              initial={{ scale: 0.9 }}
              animate={{ scale: 1 }}
              exit={{ scale: 0.9 }}
              className="bg-gray-800 p-6 rounded-xl shadow-xl max-w-md w-full border border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <h3 className="text-xl font-bold text-white">{authMode === 'login' ? 'Sign In' : 'Create Account'}</h3>
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="text-gray-400 hover:text-white p-1 rounded-full hover:bg-gray-700"
                >
                  <X size={20} />
                </button>
              </div>
              

              
              <div className="mt-4 text-center">
                <button
                  onClick={() => setAuthMode(authMode === 'login' ? 'register' : 'login')}
                  className="text-indigo-400 hover:text-indigo-300 text-sm"
                >
                  {authMode === 'login' ? 'Need an account? Sign up' : 'Already have an account? Sign in'}
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence> */}
    </motion.div>
  );
}
