import React from 'react';
import { AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import {
  UserMessage,
  BotProductRecommendationMessage,
  BotRegularMessage,
  BotDealerInfoMessage,
  TypingIndicator
} from './MessageItem';
import WelcomeScreen from './WelcomeScreen';

const ChatMessages = ({
  messages,
  loading,
  containsProductRecommendations,
  setShowMessageActions,
  showMessageActions,
  setMessageToDelete,
  messagesEndRef,
  isTokenAvailable,
  onFindDealers
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
            const isProductRecommendation = containsProductRecommendations(msg.content);
            const isDealerInfo = msg && msg.type === 'dealer';

            // Dealer information
            if (isDealerInfo) {
              return (
                <BotDealerInfoMessage
                  key={`bot-${index}`}
                  message={msg}
                  index={index}
                />
              );
            }
            // Product recommendations
            else if (isProductRecommendation) {
              return (
                <BotProductRecommendationMessage
                  key={`bot-${index}`}
                  message={msg}
                  index={index}
                  onFindDealers={onFindDealers}
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
