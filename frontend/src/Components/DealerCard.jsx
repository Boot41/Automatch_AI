import React, { useState } from 'react';
import { MapPin, Phone, Star, Clock, ExternalLink, Globe, ChevronDown, ChevronUp } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

const DealerCard = ({ dealer, index, productName = '' }) => {
  const [expanded, setExpanded] = useState(false);
  
  // Format phone number for display and tel: link
  const formatPhoneNumber = (phone) => {
    if (!phone) return { display: 'Phone number not available', link: '' };
    // Remove non-numeric characters for the tel: link
    const cleanPhone = phone.replace(/\D/g, '');
    return { display: phone, link: cleanPhone };
  };
  
  const { display: phoneDisplay, link: phoneLink } = formatPhoneNumber(dealer.phone);
  
  // Check if the address is valid for Google Maps
  const hasValidAddress = dealer.address && dealer.address !== 'Address not available';
  
  // Extract rating value if available
  const ratingValue = dealer.rating ? dealer.rating.match(/(\d+\.\d+)/) : null;
  const ratingNumber = ratingValue ? parseFloat(ratingValue[1]) : 4.5;
  
  // Generate star rating display
  const renderStars = (rating) => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating - fullStars >= 0.5;
    
    for (let i = 0; i < fullStars; i++) {
      stars.push(<Star key={`full-${i}`} size={14} className="text-yellow-400" fill="currentColor" />);
    }
    
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star size={14} className="text-gray-400" fill="currentColor" />
          <div className="absolute top-0 left-0 w-1/2 overflow-hidden">
            <Star size={14} className="text-yellow-400" fill="currentColor" />
          </div>
        </div>
      );
    }
    
    const remainingStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
    for (let i = 0; i < remainingStars; i++) {
      stars.push(<Star key={`empty-${i}`} size={14} className="text-gray-400" fill="currentColor" />);
    }
    
    return stars;
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ scale: expanded ? 1 : 1.02 }}
      className="bg-gray-800 rounded-lg overflow-hidden shadow-lg border border-gray-700 hover:border-indigo-500 transition-all duration-300"
    >
      <div className="bg-gradient-to-r from-indigo-600/30 to-purple-600/30 h-14 flex items-center justify-between px-4">
        <div className="flex items-center">
          <div className="w-8 h-8 rounded-full bg-indigo-600 flex items-center justify-center mr-2 shadow-lg">
            <span className="text-white font-bold text-sm">{dealer.id}</span>
          </div>
          <h3 className="font-bold text-white truncate max-w-[180px]">{dealer.name || 'Authorized Dealer'}</h3>
        </div>
        
        <button 
          onClick={() => setExpanded(!expanded)}
          className="text-white hover:bg-indigo-500/20 rounded-full p-1 transition-colors"
        >
          {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </button>
      </div>
      
      <div className="p-4">
        {dealer.rating && (
          <div className="flex items-center mb-3 bg-gray-700/50 p-2 rounded-md">
            <div className="flex mr-2">
              {renderStars(ratingNumber)}
            </div>
            <span className="text-sm text-gray-300">{dealer.rating}</span>
          </div>
        )}
        
        <p className="text-gray-300 text-sm mb-3 flex items-start">
          <MapPin size={16} className="mr-2 mt-1 flex-shrink-0 text-indigo-400" />
          <span className="line-clamp-2">{dealer.address || 'Address information not available'}</span>
        </p>
        
        <p className="text-gray-300 text-sm flex items-center mb-3">
          <Phone size={16} className="mr-2 flex-shrink-0 text-indigo-400" />
          <a 
            href={phoneLink ? `tel:${phoneLink}` : '#'} 
            className={`${phoneLink ? 'hover:text-indigo-400 transition-colors' : 'text-gray-400 cursor-default'}`}
          >
            {phoneDisplay}
          </a>
        </p>
        
        {dealer.hours && (
          <p className="text-gray-300 text-sm flex items-center mb-3">
            <Clock size={16} className="mr-2 flex-shrink-0 text-indigo-400" />
            <span>{dealer.hours}</span>
          </p>
        )}
        
        <AnimatePresence>
          {expanded && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
              className="overflow-hidden"
            >
              <div className="border-t border-gray-700 pt-3 mt-2">
                <h4 className="text-white font-medium mb-2">About this dealer</h4>
                <p className="text-gray-400 text-sm mb-3">
                  Official {dealer.name.includes(productName) ? dealer.name : `${productName} dealer`} providing sales, service, and genuine parts.
                  Visit this location for test drives and special offers.
                </p>
                
                <div className="flex flex-wrap gap-2 mt-3">
                  <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">Sales</span>
                  <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">Service</span>
                  <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">Parts</span>
                  <span className="text-xs bg-indigo-900/50 text-indigo-300 px-2 py-1 rounded-full">Finance</span>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
        
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center">
            <Clock size={14} className="mr-1 text-green-400" />
            <span className="text-xs text-green-400">Open today</span>
          </div>
          
          {hasValidAddress && (
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(dealer.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1 rounded-full transition-colors flex items-center"
            >
              <MapPin size={12} className="mr-1" />
              Get Directions
              <ExternalLink size={10} className="ml-1" />
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DealerCard;
