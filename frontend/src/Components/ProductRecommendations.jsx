import React from 'react';
import ProductCard from './ProductCard';
import { motion } from 'framer-motion';
import { ShoppingCart } from 'lucide-react';

const ProductRecommendations = ({ message, onFindDealers }) => {
  // Parse the message to extract product recommendations
  const parseRecommendations = () => {
    try {
      // Extract the introduction part (before the first numbered item)
      const introMatch = message.match(/(.+?)(?=\d+\.\s+\*\*)/s);
      const intro = introMatch ? introMatch[1].trim() : '';
      
      // Split the message by numbered list items (1., 2., 3.)
      const productRegex = /(\d+)\. (\*\*.*?\*\*.*?)(?=\d+\. \*\*|$)/gs;
      const productMatches = [...message.matchAll(productRegex)];
      
      const productBlocks = productMatches.map(match => match[2].trim());
      
      return { intro, productBlocks };
    } catch (error) {
      console.error('Error parsing recommendations:', error);
      return { intro: '', productBlocks: [] };
    }
  };
  
  const { intro, productBlocks: products } = parseRecommendations();
  
  // If no products found, render the original message
  if (products.length === 0) {
    return (
      <div className="text-white prose prose-invert prose-sm max-w-none">
        {message.split('\n').map((line, i) => (
          <p key={i}>{line}</p>
        ))}
      </div>
    );
  }
  
  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="mb-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 rounded-lg border border-indigo-800/50"
      >
        <div className="flex items-center mb-2">
          <ShoppingCart className="text-indigo-400 mr-2" size={20} />
          <h3 className="text-white font-bold">Recommended Products</h3>
        </div>
        <p className="text-gray-300 text-sm">
          {intro || "Here are the top recommendations based on your requirements. Click on Amazon or Flipkart links to purchase online."}
          {onFindDealers && " You can also find local dealers for these products."}
        </p>
      </motion.div>

      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, staggerChildren: 0.1 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-4"
      >
        {products.map((product, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <ProductCard 
              product={product} 
              onFindDealers={onFindDealers}
            />
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default ProductRecommendations;
