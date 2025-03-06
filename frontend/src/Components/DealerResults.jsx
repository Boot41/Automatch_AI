import React from 'react';
import { motion } from 'framer-motion';
import { MapPin, Phone, Star, Clock, Globe, Navigation } from 'lucide-react';

const DealerCard = ({ dealer }) => {
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
            <h3 className="text-lg font-semibold text-white">{dealer.name}</h3>
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
              className="flex items-center px-3 py-1 bg-indigo-600 hover:bg-indigo-700 rounded text-xs text-white transition-colors"
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
              className="flex items-center px-3 py-1 bg-green-600 hover:bg-green-700 rounded text-xs text-white transition-colors"
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

const DealerResults = ({ dealers = [], isLoading, error }) => {
  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-8">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-900/30 border border-red-700 rounded-lg p-4 text-center">
        <p className="text-red-300">{error}</p>
      </div>
    );
  }

  if (!dealers || dealers.length === 0) {
    return (
      <div className="bg-gray-800 rounded-lg p-4 text-center">
        <p className="text-gray-400">No dealers found for this product in your area.</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="text-xl font-semibold text-white mb-4">Dealers Near You</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {dealers.map((dealer, index) => (
          <DealerCard key={index} dealer={dealer} />
        ))}
      </div>
    </div>
  );
};

export default DealerResults;
