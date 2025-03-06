import React, { useEffect, useState } from 'react';
import DealerCard from './DealerCard';
import { motion } from 'framer-motion';
import { MapPin, Store } from 'lucide-react';

const DealerResults = ({ message, productName }) => {
  const [dealers, setDealers] = useState([]);
  const [extractedProductName, setExtractedProductName] = useState('');
  
  useEffect(() => {
    console.log('DealerResults received message:', message);
    console.log('DealerResults received productName prop:', productName);
    
    // Extract product name from message with multiple patterns
    const productPatterns = [
      /for \*\*([^*]+)\*\*/,
      /for ([^\n]+) in your area/,
      /dealers near you for ([^\n]+)/
    ];
    
    let foundProductName = null;
    for (const pattern of productPatterns) {
      const match = message.match(pattern);
      if (match && match[1]) {
        foundProductName = match[1].trim()
        console.log('Extracted product name from message:', foundProductName);
        break;
      }
    }
    
    if (foundProductName) {
      setExtractedProductName(foundProductName);
    } else if (productName) {
      console.log('Using provided productName prop:', productName);
      setExtractedProductName(productName);
    }
    
    // Extract dealers from message
    const dealerList = [];
    
    try {
      console.log('Parsing dealer message:', message);
      
      // Try multiple regex patterns to extract dealer information
      const dealerPatterns = [
        // Pattern 1: Numbered list with asterisks (e.g., "1. **Dealer Name**")
        /(\d+)\. \*\*([^*]+)\*\*([\s\S]*?)(?=\d+\. \*\*|$)/g,
        // Pattern 2: Simple format without numbers (e.g., "**Dealer Name**")
        /\*\*([^*]+)\*\*([\s\S]*?)(?=\*\*|$)/g,
        // Pattern 3: Simple text format (e.g., "Dealer Name:")
        /([^:\n]+):[\s\S]*?(?=\n[^:\n]+:|$)/g
      ];
      

      
      // Try each pattern until we find matches
      let foundDealers = false;
      
      for (const pattern of dealerPatterns) {
        let match;
        pattern.lastIndex = 0; // Reset regex index
        
        while ((match = pattern.exec(message)) !== null) {
          foundDealers = true;
          
          // Different extraction based on pattern
          const dealerName = match[1].includes('**') ? match[2].trim() : match[1].trim();
          const dealerDetails = match[match.length - 1] || '';
          
          console.log('Found dealer:', dealerName, 'with details:', dealerDetails);
          
          // Extract address, phone, rating, and hours using multiple patterns
          const addressPatterns = [/• Address: ([^\n]+)/, /Address: ([^\n]+)/, /address: ([^\n]+)/];
          const phonePatterns = [/• Phone: ([^\n]+)/, /Phone: ([^\n]+)/, /phone: ([^\n]+)/];
          const ratingPatterns = [/• Rating: ([^\n]+)/, /Rating: ([^\n]+)/, /rating: ([^\n]+)/];
          const hoursPatterns = [/• Open: ([^\n]+)/, /Hours: ([^\n]+)/, /Open: ([^\n]+)/, /hours: ([^\n]+)/];
          
          const findMatch = (patterns, defaultValue) => {
            for (const p of patterns) {
              const m = dealerDetails.match(p);
              if (m) return m[1].trim();
            }
            return defaultValue;
          };
          
          const addressMatch = findMatch(addressPatterns, null);
          const phoneMatch = findMatch(phonePatterns, null);
          const ratingMatch = findMatch(ratingPatterns, null);
          const hoursMatch = findMatch(hoursPatterns, null);
        
        dealerList.push({
          id: match[1] || String(dealerList.length + 1),
          name: dealerName,
          address: addressMatch || 'Address not available',
          phone: phoneMatch || 'Phone not available',
          rating: ratingMatch || '4.5',
          hours: hoursMatch || '9:00 AM - 6:00 PM'
        });
      }
      
      // If we found dealers with this pattern, stop trying other patterns
      if (foundDealers) {
        break;
      }
    }
      
    // If no dealers found using any of the patterns, try a fallback approach
    if (dealerList.length === 0) {
      console.log('No dealers found with regex patterns, trying fallback approach');
      
      // Simple fallback: look for key dealer indicators in the message
      if (message.includes('Address:') && (message.includes('Phone:') || message.includes('Rating:'))) {
        // Split by lines and look for dealer information blocks
        const lines = message.split('\n');
        let currentDealer = null;
        
        for (const line of lines) {
          const trimmedLine = line.trim();
          
          // Check if this line could be a dealer name
          if (trimmedLine && !trimmedLine.includes(':') && !trimmedLine.startsWith('•')) {
            currentDealer = {
              id: String(dealerList.length + 1),
              name: trimmedLine,
              address: 'Address not available',
              phone: 'Phone not available',
              rating: '4.5',
              hours: '9:00 AM - 6:00 PM'
            };
            dealerList.push(currentDealer);
          } 
          // If we have a current dealer, try to extract details
          else if (currentDealer) {
            if (trimmedLine.includes('Address:')) {
              currentDealer.address = trimmedLine.split('Address:')[1].trim();
            } else if (trimmedLine.includes('Phone:')) {
              currentDealer.phone = trimmedLine.split('Phone:')[1].trim();
            } else if (trimmedLine.includes('Rating:')) {
              currentDealer.rating = trimmedLine.split('Rating:')[1].trim();
            } else if (trimmedLine.includes('Open:') || trimmedLine.includes('Hours:')) {
              const hoursPart = trimmedLine.includes('Open:') ? 
                trimmedLine.split('Open:')[1] : trimmedLine.split('Hours:')[1];
              currentDealer.hours = hoursPart.trim();
            }
          }
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
