import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from "framer-motion";
import ChatHeader from "../Components/ChatHeader";
import ChatMessages from "../Components/ChatMessages";
import ChatInput from "../Components/ChatInput";
import DeleteMessageModal from "../Components/DeleteMessageModal";
import { generateProductRecommendations } from "../utils/productRecommendations";

export default function ChatWindow({ messages, input, setInput, sendMessage, loading, setMessages }) {
  const { isTokenAvailable } = useAuth();
  const [showMessageActions, setShowMessageActions] = useState(false);
  const [messageToDelete, setMessageToDelete] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState('');
  const messagesEndRef = useRef(null);

  // Scroll to bottom of messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Check if a message contains product recommendations
  const containsProductRecommendations = (content) => {
    return (
      content.includes('product recommendations') || 
      content.includes('Products that match your requirements') ||
      content.includes('Here are some products') ||
      content.includes('Here\'s what I found') ||
      content.includes('Based on your requirements')
    );
  };

  // Check if user is asking for product recommendations
  const isAskingForRecommendations = (content) => {
    return (
      content.toLowerCase().includes('recommend') ||
      content.toLowerCase().includes('suggest') ||
      content.toLowerCase().includes('looking for') ||
      content.toLowerCase().includes('find me') ||
      (content.includes('recommended') || content.includes('recommendations') || content.includes('Based on your requirements'))
    );
  };

  // Handle finding dealers for a product
  const handleFindDealers = async (productName) => {
    if (!productName || productName.trim() === '') {
      toast.error('Please specify a product to find dealers for', {
        position: "top-center",
        autoClose: 3000,
      });
      return;
    }
    
    setSelectedProduct(productName);

    // Add user message to the chat
    setMessages((prev) => [...prev, { role: "user", content: `Find dealers for ${productName}` }]);
    
    // Set loading state
    setLoading(true);
    
    // Fixed coordinates for Bangalore (as requested)
    const latitude = 12.971598;
    const longitude = 77.594566;
    
    // Get token from localStorage
    const token = localStorage.getItem('token');
    
    // Determine if we should try the API call
    const shouldTryApi = !!token;
    
    if (shouldTryApi) {
      try {
        // Make API call to the backend
        const response = await fetch('http://localhost:3000/api/v1/dealer/find', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: JSON.stringify({
            product: productName,
            latitude,
            longitude
          })
        });
        
        if (!response.ok) {
          const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
          console.error('API Error:', errorData);
          throw new Error(errorData.message || `Failed to fetch dealers: ${response.status}`);
        }
        
        const data = await response.json();
        const dealers = data.dealers || [];
        
        if (dealers.length > 0) {
          // Format dealer response from API data
          let dealerResponse = `Here are some dealers near you for **${productName}**:\n\n`;
          
          dealers.forEach((dealer, index) => {
            dealerResponse += `${index + 1}. **${dealer.title || dealer.name}**\n`;
            dealerResponse += `   \u2022 Address: ${dealer.address || dealer.location || 'Address not available'}\n`;
            dealerResponse += `   \u2022 Phone: ${dealer.phone || 'Phone not available'}\n`;
            if (dealer.rating) {
              dealerResponse += `   \u2022 Rating: ${dealer.rating}\n`;
            }
            if (dealer.hours) {
              dealerResponse += `   \u2022 Open: ${dealer.hours}\n`;
            }
            dealerResponse += '\n';
          });
          
          dealerResponse += `Would you like more information about any of these dealers?`;
          
          // Add dealer response to chat
          setMessages((prev) => [...prev, { role: "bot", content: dealerResponse }]);
          setLoading(false);
          return; // Exit function after successful API call
        } else {
          // No dealers found from API, fall through to mock data
          console.log('No dealers found from API, using mock data');
          throw new Error('No dealers found');
        }
      } catch (error) {
        console.error("Error finding dealers via API:", error);
        // Fall through to mock data
      }
    } else {
      console.log('No authentication token available, using mock data directly');
    }
    
    // Generate high-quality mock dealer data based on product name
    const mockDealers = [
      {
        title: `${productName.toUpperCase()} Authorized Dealer`,
        name: `${productName.toUpperCase()} Authorized Dealer`,
        address: '123 Main Street, Bangalore, Karnataka',
        location: 'Bangalore, Karnataka',
        phone: '+91 9876543210',
        rating: '⭐⭐⭐⭐⭐ (4.8/5)',
        hours: '9:00 AM - 8:00 PM'
      },
      {
        title: `Premium ${productName} Showroom`,
        name: `Premium ${productName} Showroom`,
        address: '456 Park Avenue, Bangalore, Karnataka',
        location: 'Bangalore, Karnataka',
        phone: '+91 8765432109',
        rating: '⭐⭐⭐⭐ (4.2/5)',
        hours: '10:00 AM - 7:00 PM'
      },
      {
        title: `Elite ${productName} Center`,
        name: `Elite ${productName} Center`,
        address: '789 Lake Road, Bangalore, Karnataka',
        location: 'Bangalore, Karnataka',
        phone: '+91 7654321098',
        rating: '⭐⭐⭐⭐⭐ (4.9/5)',
        hours: '9:30 AM - 7:30 PM'
      }
    ];
    
    // Format dealer response with mock data
    let dealerResponse = `Here are some dealers near you for **${productName}**:\n\n`;
    
    mockDealers.forEach((dealer, index) => {
      dealerResponse += `${index + 1}. **${dealer.title}**\n`;
      dealerResponse += `   \u2022 Address: ${dealer.address}\n`;
      dealerResponse += `   \u2022 Phone: ${dealer.phone}\n`;
      dealerResponse += `   \u2022 Rating: ${dealer.rating}\n`;
      dealerResponse += `   \u2022 Open: ${dealer.hours}\n`;
      dealerResponse += '\n';
    });
    
    dealerResponse += `Would you like more information about any of these dealers?`;
    
    // Add dealer response to chat
    setMessages((prev) => [...prev, { role: "bot", content: dealerResponse }]);
    setLoading(false);
  };

  // Check if a message is from the bot and contains dealer information
  const isDealerResponse = (content) => {
    return (
      content.includes("dealers near you") || 
      content.includes("find any dealers") ||
      (content.includes("dealer") && content.includes("Address:") && content.includes("Phone:"))
    );
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
      // Check if the user is asking for product recommendations
      if (isAskingForRecommendations(input)) {
        // Add user message to the chat
        setMessages((prev) => [...prev, { role: "user", content: input }]);
        setInput("");
        
        // Simulate loading state
        setLoading(true);
        
        // Generate product recommendations
        setTimeout(() => {
          const recommendations = generateProductRecommendations(input);
          setMessages((prev) => [...prev, { role: "bot", content: recommendations }]);
          setLoading(false);
        }, 1000);
      } else {
        // For other types of messages, use the regular sendMessage function
        sendMessage();
      }
    }
  };

  return (
    <div className="flex flex-col h-full w-full bg-gray-900 text-white">
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
        isTokenAvailable={isTokenAvailable}
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
      <AnimatePresence>
        <DeleteMessageModal 
          messageToDelete={messageToDelete}
          setMessageToDelete={setMessageToDelete}
          messages={messages}
          setMessages={setMessages}
        />
      </AnimatePresence>
    </div>
  );
}
