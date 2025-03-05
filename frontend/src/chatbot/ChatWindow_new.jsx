import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from "framer-motion";

// Import modular components
import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";
import DeleteMessageModal from "../components/chat/DeleteMessageModal";

export default function ChatWindow({
  messages,
  input,
  setInput,
  sendMessage,
  loading,
  setMessages,
}) {
  const { isTokenAvailable } = useAuth();
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [showMessageActions, setShowMessageActions] = useState(null);
  const messagesEndRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState("");

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if a message contains product recommendations
  const containsProductRecommendations = (content) => {
    // Look for numbered list with product names in bold
    return (
      content.includes("**") &&
      (content.match(/\d+\.\s+\*\*/g) || []).length >= 2
    );
  };

  // Handle finding dealers for a product
  const handleFindDealers = async (productName) => {
    setSelectedProduct(productName);

    try {
      // Send a message to find dealers
      setInput(`find dealers for ${productName}`);
      sendMessage();
    } catch (error) {
      console.error("Error finding dealers:", error);
    }
  };

  // Check if a message is from the bot and contains dealer information
  const isDealerResponse = (content) => {
    return content.includes("dealers near you") || content.includes("find any dealers");
  };

  // Handle unauthorized chat attempt
  const handleUnauthorizedChat = () => {
    if (!isTokenAvailable && input.trim() !== '') {
      toast.error('Please sign in to chat with AutoMatch AI', {
        position: "top-center",
        autoClose: 3000,
      });
      return true;
    }
    return false;
  };

  // Handle key press
  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      sendMessage();
    }
  };

  // Handle send message
  const handleSendMessage = () => {
    if (!handleUnauthorizedChat()) {
      sendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gray-900 text-white">
      {/* Chat Header Component */}
      <ChatHeader isTokenAvailable={isTokenAvailable} />

      {/* Chat Messages Component */}
      <ChatMessages 
        messages={messages}
        loading={loading}
        containsProductRecommendations={containsProductRecommendations}
        isDealerResponse={isDealerResponse}
        handleFindDealers={handleFindDealers}
        selectedProduct={selectedProduct}
        setShowMessageActions={setShowMessageActions}
        showMessageActions={showMessageActions}
        setMessageToDelete={setMessageToDelete}
        messagesEndRef={messagesEndRef}
      />

      {/* Chat Input Component */}
      <ChatInput 
        isTokenAvailable={isTokenAvailable}
        input={input}
        setInput={setInput}
        handleKeyDown={handleKeyDown}
        handleSendMessage={handleSendMessage}
        loading={loading}
      />

      {/* Delete Message Modal Component */}
      {/* <AnimatePresence>
        <DeleteMessageModal 
          messageToDelete={messageToDelete}
          setMessageToDelete={setMessageToDelete}
          messages={messages}
          setMessages={setMessages}
        />
      </AnimatePresence> */}
    </div>
  );
}
