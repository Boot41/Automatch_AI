import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UserMessage,
  BotProductRecommendationMessage,
  BotDealerInfoMessage,
  BotRegularMessage,
  TypingIndicator
} from './MessageItem';
import WelcomeScreen from './WelcomeScreen';

const ChatMessages = ({
  messages,
  loading,
  containsProductRecommendations,
  isDealerResponse,
  handleFindDealers,
  selectedProduct,
  setShowMessageActions,
  showMessageActions,
  setMessageToDelete,
  messagesEndRef,
  isTokenAvailable
}) => {
  return (
    <div className="p-6 overflow-y-auto flex-1 space-y-6 custom-scrollbar bg-opacity-50">
      {messages?.length > 0 ? (
        <AnimatePresence>
          {messages.map((msg, index) => {
            // For user messages
            if (msg.role === "user") {
              return (
                <UserMessage
                  key={`user-${index}`}
                  message={msg}
                  index={index}
                  setShowMessageActions={setShowMessageActions}
                  showMessageActions={showMessageActions}
                  setMessageToDelete={setMessageToDelete}
                />
              );
            }

            // For bot messages
            const isDealerInfo = isDealerResponse(msg.content);
            const isProductRecommendation = !isDealerInfo && containsProductRecommendations(msg.content);

            // Dealer information - check this first
            if (isDealerInfo) {
              return (
                <BotDealerInfoMessage
                  key={`bot-${index}`}
                  message={msg}
                  index={index}
                  selectedProduct={selectedProduct}
                />
              );
            }
            // Product recommendations - check this second
            else if (isProductRecommendation) {
              return (
                <BotProductRecommendationMessage
                  key={`bot-${index}`}
                  message={msg}
                  index={index}
                  handleFindDealers={handleFindDealers}
                />
              );
            }
            // Dealer information
            else if (isDealerInfo) {
              return (
                <BotDealerInfoMessage
                  key={`bot-${index}`}
                  message={msg}
                  index={index}
                  selectedProduct={selectedProduct}
                />
              );
            }
            // Regular bot message
            else {
              return (
                <BotRegularMessage
                  key={`bot-${index}`}
                  message={msg}
                  index={index}
                />
              );
            }
          })}
        </AnimatePresence>
      ) : (
        <WelcomeScreen isTokenAvailable={isTokenAvailable} navigate={useNavigate()} />
      )}

      {/* Typing indicator */}
      {loading && <TypingIndicator />}
      
      <div ref={messagesEndRef}></div>
    </div>
  );
};

export default ChatMessages;
