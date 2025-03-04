import { useEffect, useState, useRef } from "react";
import { useAuth } from "../store/auth"; // Import useAuth hook
// import { PaperAirplaneIcon } from "@heroicons/react/outline";

export default function Chatbot() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const chatRef = useRef(null);

  const { axiosInstance } = useAuth(); // Access axiosInstance from AuthContext

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const startChat = async () => {
    try {
      const response = await axiosInstance.post("http://localhost:3000/api/v1/ai/start");
      setMessages([{ role: "bot", content: response.data.message, sessionId: response.data.sessionId }]);
    } catch (err) {
      console.error("Start Chat Error:", err);
    }
  };

  const sendMessage = async () => {
    if (!input.trim()) return;
    const userMessage = { role: "user", content: input };
    setMessages([...messages, userMessage]);
    setInput("");
    setLoading(true);

    try {
      const response = await axiosInstance.post("http://localhost:3000/api/v1/ai/reply", {
        sessionId: messages[0]?.sessionId,
        userReply: input,
      });

      setMessages((prev) => [
        ...prev,
        { role: "bot", content: response.data.message },
      ]);
    } catch (err) {
      console.error("Reply Error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    startChat();
  }, []);

  return (
    <div className="w-full h-screen flex items-center justify-center bg-gray-900 text-white p-4">
      <div className="w-full max-w-2xl bg-gray-800 shadow-xl rounded-xl overflow-hidden flex flex-col">
        <div className="p-4 h-96 overflow-y-auto space-y-4 custom-scrollbar">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`p-3 rounded-lg max-w-[80%] ${
                msg.role === "user" ? "bg-blue-600 text-white self-end ml-auto" : "bg-gray-700 text-gray-200"
              }`}
            >
              {msg.content}
            </div>
          ))}
          {loading && <div className="text-center text-gray-400">Typing...</div>}
          <div ref={chatRef}></div>
        </div>
        <div className="p-4 bg-gray-700 flex gap-3 border-t border-gray-600">
          <input
            type="text"
            className="flex-1 p-3 bg-gray-800 rounded-lg outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500"
            placeholder="Type your message..."
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg flex items-center justify-center"
          >
            {/* <PaperAirplaneIcon className="h-6 w-6 text-white" /> */} Send
          </button>
        </div>
      </div>
    </div>
  );
}