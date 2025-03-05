import React, { useEffect, useState } from 'react';
import DealerCard from './DealerCard';
import { motion } from 'framer-motion';
import { MapPin, Store } from 'lucide-react';

const DealerResults = ({ message, productName }) => {
  const [dealers, setDealers] = useState([]);
  const [extractedProductName, setExtractedProductName] = useState('');
  
  useEffect(() => {
    // Extract product name from message
    const productMatch = message.match(/for \*\*([^*]+)\*\*/);
    if (productMatch && productMatch[1]) {
      setExtractedProductName(productMatch[1].trim());
    } else if (productName) {
      setExtractedProductName(productName);
    }
    
    // Extract dealers from message
    const dealerList = [];
    
    try {
      // Match dealer entries in the format: 1. **DealerName**
      const dealerRegex = /(\d+)\. \*\*([^*]+)\*\*([\s\S]*?)(?=\d+\. \*\*|$)/g;
      let match;
      
      while ((match = dealerRegex.exec(message)) !== null) {
        const dealerNumber = match[1];
        const dealerName = match[2].trim();
        const dealerDetails = match[3] || '';
        
        // Extract address, phone, rating, and hours using more robust patterns
        const addressMatch = dealerDetails.match(/• Address: ([^\n]+)/);
        const phoneMatch = dealerDetails.match(/• Phone: ([^\n]+)/);
        const ratingMatch = dealerDetails.match(/• Rating: ([^\n]+)/);
        const hoursMatch = dealerDetails.match(/• Open: ([^\n]+)/);
        
        dealerList.push({
          id: dealerNumber,
          name: dealerName,
          address: addressMatch ? addressMatch[1].trim() : 'Address not available',
          phone: phoneMatch ? phoneMatch[1].trim() : 'Phone not available',
          rating: ratingMatch ? ratingMatch[1].trim() : '4.0/5',
          hours: hoursMatch ? hoursMatch[1].trim() : '9:00 AM - 6:00 PM'
        });
      }
      
      // If no dealers found using the regex, try the alternative approach
      if (dealerList.length === 0) {
        const dealerBlocks = message.split(/(\d+)\. \*\*([^*]+)\*\*/);
        
        for (let i = 1; i < dealerBlocks.length; i += 3) {
          if (dealerBlocks[i] && dealerBlocks[i+1]) {
            const dealerNumber = dealerBlocks[i];
            const dealerName = dealerBlocks[i+1];
            const dealerDetails = dealerBlocks[i+2] || '';
            
            // Extract address, phone, rating, and hours
            const addressMatch = dealerDetails.match(/• Address: ([^\n]+)/);
            const phoneMatch = dealerDetails.match(/• Phone: ([^\n]+)/);
            const ratingMatch = dealerDetails.match(/• Rating: ([^\n]+)/);
            const hoursMatch = dealerDetails.match(/• Open: ([^\n]+)/);
            
            dealerList.push({
              id: dealerNumber,
              name: dealerName,
              address: addressMatch ? addressMatch[1].trim() : 'Address not available',
              phone: phoneMatch ? phoneMatch[1].trim() : 'Phone not available',
              rating: ratingMatch ? ratingMatch[1].trim() : '4.0/5',
              hours: hoursMatch ? hoursMatch[1].trim() : '9:00 AM - 6:00 PM'
            });
          }
        }
      }
    } catch (error) {
      console.error('Error parsing dealer information:', error);
    }
    
    console.log('Parsed dealers:', dealerList);
    setDealers(dealerList);
  }, [message, productName]);
  
  if (!dealers || dealers.length === 0) {
    return (
      <div className="text-center py-6">
        <p className="text-gray-400">No dealers found for this product in your area.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-4 bg-gradient-to-r from-indigo-900/50 to-purple-900/50 p-4 rounded-lg border border-indigo-800/50"
      >
        <div className="flex items-center mb-2">
          <Store className="text-indigo-400 mr-2" size={20} />
          <h3 className="text-white font-bold">Authorized Dealers</h3>
        </div>
        <p className="text-gray-300 text-sm flex items-center">
          <MapPin size={14} className="mr-1 text-indigo-400" />
          Available dealers for <span className="text-indigo-400 font-semibold mx-1">{extractedProductName || productName || 'this product'}</span> in your area
        </p>
      </motion.div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {dealers.map((dealer, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
          >
            <DealerCard 
              dealer={dealer} 
              index={index}
              productName={extractedProductName || productName || ''}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
};

export default DealerResults;
