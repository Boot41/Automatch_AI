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
      const response = await axiosInstance.get("/user/sessions");
      setSessions(response.data.sessions || []);

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
      const response = await axiosInstance.get(`/user/messages/${sessionId}`);
      
      // Process messages to handle dealer messages
      const processedMessages = (response.data.messages || []).map(msg => {
        // Check if the message is a dealer message (contains dealer data in JSON format)
        if (msg.role === 'bot' && msg.content.includes('"type":"dealer"')) {
          try {
            const dealerData = JSON.parse(msg.content);
            return {
              role: 'bot',
              type: 'dealer',
              dealers: dealerData.dealers || [],
              content: dealerData.message || 'Here are some dealers near you.',
              id: msg.id
            };
          } catch (e) {
            console.error('Error parsing dealer message:', e);
            return msg;
          }
        }
        return msg;
      });
      
      setMessages(processedMessages);
    } catch (err) {
      console.error("Fetch Messages Error:", err);
      setMessages([]);
    }
  };

  const onSelectSession = (sessionId) => {
    setActiveSession(sessionId);
    fetchMessages(sessionId);
  };

  const startChat = async () => {
    try {
      const response = await axiosInstance.post("/ai/start");

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
    setMessages((prev) => [...prev, { role: "user", content: input }]);
    setInput("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("/ai/reply", {
        sessionId: activeSession,
        userReply: input,
      });

      // Check if the response contains dealer information
      if (response.data.type === 'dealer') {
        setMessages((prev) => [...prev, { 
          role: "bot", 
          type: "dealer",
          dealers: response.data.dealers || [],
          content: response.data.message || "Here are some dealers near you."
        }]);
      } else {
        setMessages((prev) => [...prev, { role: "bot", content: response.data.message }]);
      }
    } catch (err) {
      console.error("Reply Error:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <div className="h-screen w-full flex bg-gray-900 text-white">
      {/* Sidebar - 25% width */}
      <div className="w-1/4 flex-shrink-0">
        <Sidebar
          sessions={sessions}
          setSessions={setSessions}
          activeSession={activeSession}
          onSelectSession={onSelectSession}
          onNewChat={startChat}
        />
      </div>
      
      {/* Chat Window - 75% width */}
      <div className="w-3/4 flex-shrink-0">
        <ChatWindow
          messages={Array.isArray(messages) ? messages : []}
          input={input}
          setInput={setInput}
          sendMessage={sendMessage}
          loading={loading}
          setLoading={setLoading}
          setMessages={setMessages}
          activeSession={activeSession}
        />
      </div>
    </div>
    </>
  );
}
