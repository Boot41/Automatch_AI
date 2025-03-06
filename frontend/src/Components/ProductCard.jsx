import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { MapPin, Star, Award, Check, ChevronRight } from 'lucide-react';

const ProductCard = ({ product, onFindDealers }) => {
  const [isHovered, setIsHovered] = useState(false);
  // Parse product information from markdown format
  const parseProduct = () => {
    try {
      // Extract product name and price
      const titleMatch = product.match(/\*\*([^*]+)\*\* - ([^\n]+)/);
      const name = titleMatch ? titleMatch[1].trim() : 'Unknown Product';
      const price = titleMatch ? titleMatch[2].trim() : '';
      
      // Extract features (bullet points)
      const features = [];
      const featureMatches = product.matchAll(/• ([^\n]+)/g);
      
      for (const match of featureMatches) {
        const feature = match[1].trim();
        // Skip Amazon and Flipkart links in features list
        if (!feature.includes('Amazon:') && !feature.includes('Flipkart:')) {
          features.push(feature);
        }
      }
      
      // Extract Amazon and Flipkart links
      const amazonMatch = product.match(/• Amazon: (.+?)(?=\n|$)/i);
      const flipkartMatch = product.match(/• Flipkart: (.+?)(?=\n|$)/i);
      
      const amazonUrl = amazonMatch ? 
        (amazonMatch[1].includes('http') ? amazonMatch[1].trim() : `https://www.amazon.in/s?k=${encodeURIComponent(name)}`) : 
        `https://www.amazon.in/s?k=${encodeURIComponent(name)}`;
      
      const flipkartUrl = flipkartMatch ? 
        (flipkartMatch[1].includes('http') ? flipkartMatch[1].trim() : `https://www.flipkart.com/search?q=${encodeURIComponent(name)}`) : 
        `https://www.flipkart.com/search?q=${encodeURIComponent(name)}`;
      
      return { name, price, features, amazonUrl, flipkartUrl };
    } catch (error) {
      console.error('Error parsing product:', error);
      return { 
        name: 'Unknown Product', 
        price: '', 
        features: ['Feature not available'],
        amazonUrl: 'https://www.amazon.in',
        flipkartUrl: 'https://www.flipkart.com'
      };
    }
  };
  
  const { name, price, features, amazonUrl, flipkartUrl } = parseProduct();
  
  // Generate a random rating between 4.0 and 5.0
  const rating = (4 + Math.random()).toFixed(1);
  
  return (
    <motion.div 
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl overflow-hidden shadow-xl border border-gray-700 flex flex-col h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)' }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
    >
      <div className="relative">
        <div className="h-32 bg-gradient-to-r from-indigo-600 to-purple-600 flex items-center justify-center overflow-hidden">
          {/* Product image or placeholder */}
          <motion.div 
            animate={{ rotate: isHovered ? 5 : 0, scale: isHovered ? 1.1 : 1 }}
            transition={{ duration: 0.5 }}
            className="text-white font-bold text-3xl opacity-30 flex flex-col items-center"
          >
            <img 
              src={`https://source.unsplash.com/300x200/?${encodeURIComponent(name.split(' ')[0])}`} 
              alt={name}
              className="w-full h-full object-cover opacity-50"
              loading="lazy"
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.nextSibling.style.display = 'block';
              }}
            />
            <span className="absolute">{name.split(' ')[0]}</span>
          </motion.div>
        </div>
        <div className="absolute top-3 right-3 bg-indigo-600 text-white text-xs font-bold px-2 py-1 rounded-full flex items-center">
          <Award size={12} className="mr-1" />
          TOP RATED
        </div>
      </div>
      
      <div className="p-6 flex-grow">
        {/* <div className="flex items-center mb-2">
          <div className="flex items-center text-yellow-400 mr-2">
            <Star size={14} fill="#FBBF24" />
            <span className="ml-1 text-sm font-bold">{rating}</span>
          </div>
          <span className="text-xs text-gray-400">(120+ reviews)</span>
        </div> */}
        
        <h3 className="text-xl font-bold mb-1 text-white">{name}</h3>
        <p className="text-green-400 font-bold text-lg mb-4">{price}</p>
        
        <div className="space-y-2 mb-4">
          <h4 className="text-sm font-semibold text-gray-300 uppercase tracking-wider mb-2">Key Features</h4>
          {features.map((feature, index) => (
            <div key={index} className="flex items-start">
              <Check size={16} className="text-green-500 mr-2 flex-shrink-0 mt-0.5" />
              <p className="text-gray-300 text-sm">{feature}</p>
            </div>
          ))}
          
          {/* Shopping links */}
          <div className="flex space-x-2 mt-4">
            <a 
              href={amazonUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 text-center bg-yellow-800 hover:bg-yellow-700 text-yellow-100 text-xs py-2 px-3 rounded-lg transition-colors"
            >
              Amazon
            </a>
            <a 
              href={flipkartUrl} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 text-center bg-blue-800 hover:bg-blue-700 text-blue-100 text-xs py-2 px-3 rounded-lg transition-colors"
            >
              Flipkart
            </a>
          </div>
        </div>
      </div>
      
      <div className="p-4 bg-gradient-to-r from-gray-800 to-gray-700 mt-auto">
        <motion.button 
          onClick={() => {
            console.log('Find Dealers clicked for:', name);
            onFindDealers(name);
          }}
          className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white py-3 px-4 rounded-xl flex items-center justify-center transition duration-300 shadow-lg"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          <MapPin size={18} className="mr-2" />
          Find Dealers Near You
          <ChevronRight size={18} className="ml-2" />
        </motion.button>
      </div>
    </motion.div>
  );
};

export default ProductCard;
