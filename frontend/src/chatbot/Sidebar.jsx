import React from "react";
import { useAuth } from "../store/auth";
import { useNavigate } from "react-router-dom";
import { Home } from "lucide-react";
import moment from "moment";

export default function Sidebar({
  sessions,
  activeSession,
  onSelectSession,
  onNewChat,
}) {
  const { axiosInstance } = useAuth();
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

  return (
    <div className="w-1/4 h-full bg-gray-800 p-4 flex flex-col space-y-4 border-r border-gray-700">
      <button
        className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg text-white text-center"
        onClick={onNewChat}
      >
        + New Chat
      </button>

      <div className="overflow-y-auto flex-1 custom-scrollbar">
        <ul>
          {sessions?.map((session) => (
            <div
              key={session?.id}
              onClick={() => handleSessionClick(session.id)}
              className={`p-4 cursor-pointer rounded-lg flex flex-col gap-2 ${
                activeSession === session.id ? "bg-blue-500" : "hover:bg-gray-700"
              }`}
            >
              <span className="font-semibold text-white">
                {session?.messages?.[0]?.content?.slice(0, 20) || "New Chat"}
              </span>
              <span className="text-sm text-gray-400">
                {moment(session?.createdAt).format("MMM D, YYYY HH:mm")}
              </span>
            </div>
          ))}
        </ul>
      </div>

      <button
        className="bg-green-600 hover:bg-green-500 p-3 rounded-lg text-white text-center mt-4 flex items-center justify-center gap-2"
        onClick={() => navigate("/")}
      >
        <Home size={20} /> Home
      </button>
    </div>
  );
}