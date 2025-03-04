import React, { useRef, useEffect } from "react";

export default function ChatWindow({
  messages,
  input,
  setInput,
  sendMessage,
  loading,
}) {
  const chatRef = useRef(null);

  useEffect(() => {
    chatRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="w-3/4 h-full flex flex-col bg-gray-900 shadow-lg rounded-lg overflow-hidden border border-gray-800">
      <div className="p-4 h-96 overflow-y-auto flex-1 space-y-4 custom-scrollbar">
        {messages?.length > 0 ? (
          messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex w-full ${msg.role === "user" ? "justify-end" : "justify-start"}`}
            >
              <div
                className={`max-w-[60%] p-4 rounded-lg text-white ${
                  msg.role === "user" ? "bg-blue-600 shadow-md" : "bg-gray-700 shadow-md"
                }`}
              >
                {msg.content}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No Messages</p>
        )}
        {loading && <div className="text-center text-gray-400">Typing...</div>}
        <div ref={chatRef}></div>
      </div>
      <div className="p-4 bg-gray-800 flex gap-3 border-t border-gray-700">
        <input
          type="text"
          className="flex-1 p-3 bg-gray-900 rounded-lg outline-none text-white placeholder-gray-400 focus:ring-2 focus:ring-blue-500 shadow-md"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button
          onClick={sendMessage}
          className="bg-blue-600 hover:bg-blue-500 p-3 rounded-lg shadow-md transition duration-300"
        >
          Send
        </button>
      </div>
    </div>
  );
}
