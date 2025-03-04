import { useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import Sidebar from "../chatbot/Sidebar";
import ChatWindow from "../chatbot/ChatWindow";

export default function Chatbot() {
  const [sessions, setSessions] = useState([]);
  const [activeSession, setActiveSession] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const { axiosInstance } = useAuth();

  useEffect(() => {
    fetchSessions();
  }, []);

  const fetchSessions = async () => {
    try {
      const response = await axiosInstance.get("http://localhost:3000/api/v1/user/sessions");
      setSessions(response.data.sessions);
      if (response.data.sessions.length > 0) {
        setActiveSession(response.data.sessions[0].id);
        fetchMessages(response.data.sessions[0].id);
      }
    } catch (err) {
      console.error("Fetch Sessions Error:", err);
    }
  };

  const fetchMessages = async (sessionId) => {
    try {
      const response = await axiosInstance.get(`http://localhost:3000/api/v1/user/messages/${sessionId}`);
      setMessages(response.data.messages);
    } catch (err) {
      console.error("Fetch Messages Error:", err);
    }
  };

  const onSelectSession = (sessionId) => {
    setActiveSession(sessionId);
    fetchMessages(sessionId);
  };

  const startChat = async () => {
    try {
      const response = await axiosInstance.post("http://localhost:3000/api/v1/ai/start");
  
      if (response.data?.session?.id) {
        setSessions([response.data.session, ...sessions]);
        setActiveSession(response.data.session.id);
        setMessages([{ role: "bot", content: response.data.message }]);
      } else {
        console.error("Invalid session data:", response.data);
      }
    } catch (err) {
      console.error("Start Chat Error:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    setMessages([...messages, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("http://localhost:3000/api/v1/ai/reply", {
        sessionId: activeSession,
        userReply: input,
      });
      setMessages((prev) => [...prev, { role: "bot", content: response.data.message }]);
    } catch (err) {
      console.error("Reply Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="h-screen w-full flex bg-gray-900 text-white">
      <Sidebar
        sessions={sessions}
        activeSession={activeSession}
        onSelectSession={onSelectSession}
        onNewChat={startChat}
      />
      <ChatWindow
        messages={messages}
        input={input}
        setInput={setInput}
        sendMessage={sendMessage}
        loading={loading}
      />
    </div>
  );
}
