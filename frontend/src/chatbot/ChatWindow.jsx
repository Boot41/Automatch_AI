import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import api from '../config/api';

// Import modular components
import ChatHeader from "../components/chat/ChatHeader";
import ChatInput from "../components/chat/ChatInput";
import ChatMessages from "../components/chat/ChatMessages";

export default function ChatWindow({
  messages,
  input,
  setInput,
  sendMessage,
  loading,
  setLoading,
  setMessages,
  activeSession
}) {
  const { isTokenAvailable } = useAuth();
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [showMessageActions, setShowMessageActions] = useState(null);
  const messagesEndRef = useRef(null);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    // Scroll to bottom when messages change
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if a message contains product recommendations
  const containsProductRecommendations = (content) => {
    // Check if content is defined and is a string
    if (!content || typeof content !== 'string') {
      return false;
    }
    
    // Look for numbered list with product names in bold
    return (
      content.includes("**") &&
      (content.match(/\d+\.\s+\*\*/g) || []).length >= 2
    );
  };

  // Check if a message is a dealer response
  const isDealerResponse = (message) => {
    return message.type === 'dealer';
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

  // Handle find dealers request
  const handleFindDealers = async (productName) => {
    if (!isTokenAvailable) {
      toast.error('Please sign in to find dealers', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }

    setSelectedProduct(productName);
    
    // Add user message
    const userMessage = {
      role: 'user',
      content: `Find dealers for ${productName} near me`,
    };
    
    setMessages(prev => [...prev, userMessage]);
    
    // Add bot message with loading state
    const botMessageId = Date.now().toString();
    const botMessage = {
      id: botMessageId,
      role: 'assistant',
      type: 'dealer',
      isLoading: true,
      dealers: [],
      error: null,
    };
    
    setMessages(prev => [...prev, botMessage]);
    
    try {
      // Default location if geolocation fails
      let userLocation = "New Delhi";
      
      try {
        // Get user's location
        const locationResponse = await new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            position => {
              const { latitude, longitude } = position.coords;
              resolve({ latitude, longitude });
            },
            error => {
              console.error('Error getting location:', error);
              reject('Unable to get your location. Using default location.');
            },
            { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
          );
        });
        
        // Convert coordinates to address using reverse geocoding
        const geocodeResponse = await fetch(
          `https://nominatim.openstreetmap.org/reverse?format=json&lat=${locationResponse.latitude}&lon=${locationResponse.longitude}`
        );
        
        const geocodeData = await geocodeResponse.json();
        userLocation = geocodeData.address.city || geocodeData.address.town || geocodeData.address.state || "New Delhi";
      } catch (error) {
        console.log('Using default location due to error:', error);
      }
      
      console.log(`Searching for ${productName} dealers near ${userLocation}`);
      
      // Call the dealer search API
      const response = await api.post('/api/v1/dealers/search', {
        location: userLocation,
        productName: productName,
      });
      
      console.log('Dealer search response:', response.data);
      
      // Save the dealer message to the backend
      try {
        await api.post('/api/v1/ai/save-dealer-message', {
          sessionId: activeSession,
          userMessage: `Find dealers for ${productName} near me`,
          dealerData: {
            type: 'dealer',
            message: `Here are some dealers for ${productName} near ${userLocation}`,
            dealers: response.data?.data || []
          }
        });
      } catch (error) {
        console.error('Error saving dealer message:', error);
      }
      
      // Update the bot message with dealer results
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId 
            ? { 
                ...msg, 
                isLoading: false, 
                dealers: response.data?.data || [],
                location: userLocation
              } 
            : msg
        )
      );
    } catch (error) {
      console.error('Error finding dealers:', error);
      
      // Update the bot message with error
      setMessages(prev => 
        prev.map(msg => 
          msg.id === botMessageId 
            ? { 
                ...msg, 
                isLoading: false, 
                error: error.response?.data?.message || error.message || 'Failed to find dealers. Please try again.'
              } 
            : msg
        )
      );
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
        setShowMessageActions={setShowMessageActions}
        showMessageActions={showMessageActions}
        setMessageToDelete={setMessageToDelete}
        messagesEndRef={messagesEndRef}
        isTokenAvailable={isTokenAvailable}
        onFindDealers={handleFindDealers}
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
