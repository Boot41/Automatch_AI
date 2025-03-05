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
          <h3 className="text-gray-400 uppercase text-sm font-bold mb-2">
            {title}
          </h3>
          <ul className="space-y-1">
            {sessions.map((session) => {
              const userMessage = session?.messages?.[0]?.content;

              return (
                <div
                  key={session?.id}
                  onClick={() => handleSessionClick(session.id)}
                  className={`p-2 cursor-pointer rounded-lg flex flex-col gap-2 transition duration-200 ${
                    activeSession === session.id ? "bg-indigo-400" : "hover:bg-gray-700"
                  }`}
                >
                  <span className="font-semibold text-white truncate">
                    {userMessage?.slice(0, 24) + "..." || "No User Message"}
                  </span>
                 
                </div>
              );
            })}
          </ul>
        </div>
      )}
    </div>
  );

  return (
    <div className="w-1/5 h-full bg-gray-900 p-4 flex flex-col space-y-4 border-r border-gray-800">
      <a
        href="#_"
        onClick={onNewChat}
        className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-white rounded hover:bg-white group"
      >
        <span className="w-48 h-48 rounded rotate-[-40deg] bg-purple-600 absolute bottom-0 left-0 -translate-x-full ease-out duration-500 transition-all translate-y-full mb-9 ml-9 group-hover:ml-0 group-hover:mb-32 group-hover:translate-x-0"></span>
        <span className="relative w-full text-left text-black transition-colors duration-300 ease-in-out group-hover:text-white">
          + New Chat
        </span>
      </a>

      <div className="overflow-y-auto flex-1 custom-scrollbar space-y-6">
        {renderSessions("Today", groupedSessions.Today)}
        {renderSessions("Yesterday", groupedSessions.Yesterday)}
        {renderSessions("Last 7 Days", groupedSessions["Last 7 Days"])}
        {renderSessions("Older", groupedSessions.Older)}
      </div>

      <button
        className="bg-green-600 hover:bg-green-500 p-3 rounded-lg text-white text-center mt-4 flex items-center justify-center gap-2 shadow-lg transition duration-200"
        onClick={() => navigate("/")}
      >
        <Home size={20} /> Home
      </button>
    </div>
  );
}
