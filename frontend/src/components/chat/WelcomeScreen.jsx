import React from 'react';
import { motion } from 'framer-motion';
import { Bot, Search, ShoppingBag, MapPin } from 'lucide-react';

const WelcomeScreen = ({ isTokenAvailable, navigate }) => {
  const features = [
    {
      icon: <Search className="text-indigo-400" size={24} />,
      title: 'Find Products',
      description: 'Describe what you need and get personalized product recommendations'
    },
    {
      icon: <ShoppingBag className="text-indigo-400" size={24} />,
      title: 'Compare Options',
      description: 'See detailed comparisons of products that match your requirements'
    },
    {
      icon: <MapPin className="text-indigo-400" size={24} />,
      title: 'Locate Dealers',
      description: 'Find authorized dealers near you for your selected products'
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full py-8 px-6 text-center">
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        <div className="w-24 h-24 mx-auto rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg mb-6">
          <Bot size={48} className="text-white" />
        </div>
        <h1 className="text-3xl font-bold text-white mb-3">Welcome to AutoMatch AI</h1>
        <p className="text-gray-400 text-lg max-w-lg mx-auto">
          Your intelligent product recommendation assistant. Tell me what you're looking for, and I'll help you find the perfect match.
        </p>
      </motion.div>



      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.5, duration: 0.5 }}
        className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl"
      >
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-800/50 p-6 rounded-xl border border-gray-700 hover:border-indigo-500 transition-colors"
            whileHover={{ y: -5, boxShadow: '0 10px 25px -5px rgba(79, 70, 229, 0.2)' }}
            transition={{ duration: 0.2 }}
          >
            <div className="w-12 h-12 rounded-full bg-indigo-900/50 flex items-center justify-center mx-auto mb-4">
              {feature.icon}
            </div>
            <h3 className="text-lg font-semibold text-white mb-2">{feature.title}</h3>
            <p className="text-gray-400">{feature.description}</p>
          </motion.div>
        ))}
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.8, duration: 0.5 }}
        className="mt-8 text-gray-500 text-sm"
      >
        Start typing in the chat box below to begin your product search
      </motion.div>
    </div>
  );
};

export default WelcomeScreen;