import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, Clock, Globe, Navigation } from 'lucide-react';

const DealerCard = ({ dealer }) => {
  if (!dealer) return null;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-gray-800 rounded-lg shadow-lg overflow-hidden border border-gray-700 hover:border-indigo-500 transition-all"
    >
      <div className="p-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-white">{dealer.name || 'Unknown Dealer'}</h3>
            {dealer.rating && (
              <div className="flex items-center mt-1">
                <Star className="h-4 w-4 text-yellow-400 mr-1" />
                <span className="text-sm text-gray-300">
                  {dealer.rating} ({dealer.reviewCount || 0} reviews)
                </span>
              </div>
            )}
          </div>
          {dealer.imageUrl && (
            <img 
              src={dealer.imageUrl} 
              alt={dealer.name} 
              className="w-16 h-16 object-cover rounded-md"
              onError={(e) => {
                e.target.style.display = 'none';
              }}
            />
          )}
        </div>
        
        <div className="mt-3 space-y-2">
          {dealer.address && (
            <div className="flex items-start">
              <MapPin className="h-4 w-4 text-gray-400 mr-2 mt-1" />
              <span className="text-sm text-gray-300">{dealer.address}</span>
            </div>
          )}
          
          {dealer.phone && (
            <div className="flex items-center">
              <Phone className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-300">{dealer.phone}</span>
            </div>
          )}
          
          {dealer.openHours && (
            <div className="flex items-center">
              <Clock className="h-4 w-4 text-gray-400 mr-2" />
              <span className="text-sm text-gray-300">{dealer.openHours}</span>
            </div>
          )}
        </div>
        
        <div className="mt-4 flex space-x-2">
          {dealer.website && (
            <a 
              href={dealer.website} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-indigo-600 hover:bg-indigo-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
            >
              <Globe className="h-3 w-3 mr-1" />
              Website
            </a>
          )}
          
          {dealer.directions && (
            <a 
              href={dealer.directions} 
              target="_blank" 
              rel="noopener noreferrer"
              className="flex-1 flex items-center justify-center bg-green-600 hover:bg-green-700 text-white text-xs py-2 px-3 rounded-lg transition-colors"
            >
              <Navigation className="h-3 w-3 mr-1" />
              Directions
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
};

export default DealerCard;
