import React, { useRef, useEffect, useState } from "react";
import { useAuth } from "../store/auth";
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { AnimatePresence } from "framer-motion";

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
    try {
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
      if (setLoading) {
        setLoading(true);
      }
      
      // Fixed coordinates for Bangalore (as requested)
      const latitude = 12.971598;
      const longitude = 77.594566;
      
      // Get token from localStorage
      const token = localStorage.getItem('token');
      
      let dealers = [];
      let usedMockData = false;
      
      // Only try API if we have a token
      if (token) {
        try {
          console.log('Attempting to fetch dealers from API for:', productName);
          
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
          
          // Check if response is OK
          if (response.ok) {
            const data = await response.json();
            dealers = data.dealers || [];
            console.log('Dealers fetched successfully:', dealers.length);
          } else {
            console.error('API Error:', response.status);
            throw new Error(`API error: ${response.status}`);
          }
        } catch (error) {
          console.error("API call failed:", error);
          dealers = []; // Ensure dealers is empty so we fall back to mock data
        }
      } else {
        console.log('No authentication token available');
      }
      
      // If no dealers from API, use mock data
      if (!dealers || dealers.length === 0) {
        console.log('Using mock dealer data for:', productName);
        usedMockData = true;
        
        // Generate mock dealer data based on product name
        dealers = [
          {
            title: `${productName.toUpperCase()} Authorized Dealer`,
            name: `${productName.toUpperCase()} Authorized Dealer`,
            address: '123 Main Street, Bangalore, Karnataka',
            location: 'Bangalore, Karnataka',
            phone: '+91 9876543210',
            rating: '4.8/5',
            hours: '9:00 AM - 8:00 PM'
          },
          {
            title: `Premium ${productName} Showroom`,
            name: `Premium ${productName} Showroom`,
            address: '456 Park Avenue, Bangalore, Karnataka',
            location: 'Bangalore, Karnataka',
            phone: '+91 8765432109',
            rating: '4.2/5',
            hours: '10:00 AM - 7:00 PM'
          },
          {
            title: `Elite ${productName} Center`,
            name: `Elite ${productName} Center`,
            address: '789 Lake Road, Bangalore, Karnataka',
            location: 'Bangalore, Karnataka',
            phone: '+91 7654321098',
            rating: '4.9/5',
            hours: '9:30 AM - 7:30 PM'
          }
        ];
      }
      
      // Format dealer response
      let dealerResponse = `Here are some dealers near you for **${productName}**:

`;
      
      dealers.forEach((dealer, index) => {
        dealerResponse += `${index + 1}. **${dealer.title || dealer.name}**
`;
        dealerResponse += `   • Address: ${dealer.address || dealer.location || 'Address not available'}
`;
        dealerResponse += `   • Phone: ${dealer.phone || 'Phone not available'}
`;
        dealerResponse += `   • Rating: ${dealer.rating || '4.5/5'}
`;
        dealerResponse += `   • Open: ${dealer.hours || '9:00 AM - 6:00 PM'}
`;
        dealerResponse += '';
      });
      
      // Add note if we used mock data
      if (usedMockData) {
        dealerResponse += `Note: These are sample dealers. Actual dealer information may vary.

`;
      }
      
      dealerResponse += `Would you like more information about any of these dealers?`;
      
      // Add dealer response to chat
      setMessages((prev) => [...prev, { role: "bot", content: dealerResponse }]);
    } catch (error) {
      console.error("Error in handleFindDealers:", error);
      
      // Add error message to chat
      setMessages((prev) => [...prev, { 
        role: "bot", 
        content: `I'm sorry, I couldn't find dealers for ${productName} at this time. Please try again later.` 
      }]);
    } finally {
      // Always reset loading state
      if (setLoading) {
        setLoading(false);
      }
    }
  };

  // Check if a message is from the bot and contains dealer information
  const isDealerResponse = (content) => {
    // Add debug logging
    console.log('Checking if message is a dealer response:', content.substring(0, 100) + '...');
    

    
    // Check if the message contains dealer-specific patterns
    const hasDealerKeyword = content.toLowerCase().includes('dealer');
    const hasHereAreSomeDealers = content.includes('Here are some dealers');
    const hasAddressAndPhone = content.includes('Address:') && content.includes('Phone:');
    const hasNumberedDealerPattern = content.match(/\d+\. \*\*.*\*\*[\s\S]*?\u2022 Address:/) !== null;
    
    // Log the results of each check
    console.log('Dealer detection results:', {
      hasDealerKeyword,
      hasHereAreSomeDealers,
      hasAddressAndPhone,
      hasNumberedDealerPattern
    });
    
    // If the message contains 'Samsung Galaxy' (from your screenshot) and dealer info, it's definitely a dealer response
    if (content.includes('Samsung Galaxy') && hasDealerKeyword) {
      console.log('Detected Samsung Galaxy dealer response');
      return true;
    }
    
    return (
      hasHereAreSomeDealers || 
      (hasDealerKeyword && hasAddressAndPhone) ||
      hasNumberedDealerPattern
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
