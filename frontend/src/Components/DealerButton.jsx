import React from 'react';
import { MapPin } from 'lucide-react';

const DealerButton = ({ onClick, productName, disabled }) => {
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`flex items-center px-4 py-2 rounded-full text-sm font-medium transition-colors ${disabled 
        ? 'bg-gray-700 text-gray-400 cursor-not-allowed' 
        : 'bg-indigo-600 hover:bg-indigo-700 text-white'}`}
    >
      <MapPin size={16} className="mr-2" />
      Find Dealers for {productName}
    </button>
  );
};

export default DealerButton;
