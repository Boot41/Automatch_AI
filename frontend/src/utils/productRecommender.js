/**
 * Product Recommender Utility
 * 
 * This utility provides functions for generating structured product recommendations
 * based on user queries and product categories.
 */

// Sample product database for demonstration
const productDatabase = {
  smartphones: [
    {
      name: "Samsung Galaxy S23 Ultra",
      price: "₹99,999",
      features: [
        "6.8-inch Dynamic AMOLED 2X display with 120Hz refresh rate",
        "200MP main camera with 8K video recording",
        "Snapdragon 8 Gen 2 processor",
        "5000mAh battery with 45W fast charging",
        "S Pen included with low latency"
      ],
      amazonUrl: "https://www.amazon.in/Samsung-Galaxy-Ultra-Cream-Storage/dp/B0BT9CXXXX",
      flipkartUrl: "https://www.flipkart.com/samsung-galaxy-s23-ultra-green-256-gb/p/itm73a864fdaf28c"
    },
    {
      name: "Google Pixel 7 Pro",
      price: "₹84,999",
      features: [
        "6.7-inch LTPO OLED display with 120Hz refresh rate",
        "50MP main camera with advanced computational photography",
        "Google Tensor G2 chip with Titan M2 security",
        "5000mAh battery with 30W fast charging",
        "Pure Android experience with 3 years of OS updates"
      ],
      amazonUrl: "https://www.amazon.in/Google-Pixel-Pro-Hazel-Storage/dp/B0BDHX8Z63",
      flipkartUrl: "https://www.flipkart.com/google-pixel-7-pro-hazel-128-gb/p/itm8f5a68f0d5e9e"
    },
    {
      name: "OnePlus 11",
      price: "₹56,999",
      features: [
        "6.7-inch AMOLED display with 120Hz refresh rate",
        "50MP Hasselblad camera system",
        "Snapdragon 8 Gen 2 processor",
        "5000mAh battery with 100W SUPERVOOC charging",
        "OxygenOS based on Android 13"
      ],
      amazonUrl: "https://www.amazon.in/OnePlus-Eternal-Green-256GB-Storage/dp/B0BSNP46QD",
      flipkartUrl: "https://www.flipkart.com/oneplus-11-5g-eternal-green-256-gb/p/itm3b3631aa95398"
    }
  ],
  cars: [
    {
      name: "Tata Nexon",
      price: "₹7,70,000 - ₹14,60,000",
      features: [
        "5-star Global NCAP safety rating",
        "1.2L turbo-petrol and 1.5L diesel engine options",
        "Available in both manual and automatic transmissions",
        "10.25-inch touchscreen infotainment system",
        "Electric sunroof and ventilated front seats"
      ],
      amazonUrl: "https://www.amazon.in/s?k=tata+nexon+accessories",
      flipkartUrl: "https://www.flipkart.com/search?q=tata+nexon+accessories"
    },
    {
      name: "Hyundai Creta",
      price: "₹10,87,000 - ₹19,20,000",
      features: [
        "1.5L naturally aspirated petrol, 1.5L diesel, and 1.5L turbo-petrol engine options",
        "Panoramic sunroof with voice control",
        "10.25-inch touchscreen with BlueLink connected car tech",
        "Ventilated front seats and 8-way power-adjustable driver seat",
        "Level 2 ADAS features with 19 safety functions"
      ],
      amazonUrl: "https://www.amazon.in/s?k=hyundai+creta+accessories",
      flipkartUrl: "https://www.flipkart.com/search?q=hyundai+creta+accessories"
    },
    {
      name: "Mahindra XUV700",
      price: "₹13,99,000 - ₹26,99,000",
      features: [
        "2.0L mStallion turbo-petrol and 2.2L mHawk diesel engine options",
        "ADAS features including adaptive cruise control and lane keep assist",
        "10.25-inch touchscreen and 10.25-inch digital instrument cluster",
        "Panoramic sunroof and 360-degree camera",
        "7-seater configuration with multiple drive modes"
      ],
      amazonUrl: "https://www.amazon.in/s?k=mahindra+xuv700+accessories",
      flipkartUrl: "https://www.flipkart.com/search?q=mahindra+xuv700+accessories"
    }
  ],
  bikes: [
    {
      name: "Royal Enfield Classic 350",
      price: "₹1,90,000 - ₹2,21,000",
      features: [
        "349cc air-oil cooled single-cylinder engine",
        "20.2 bhp power and 27 Nm torque",
        "Dual-channel ABS with front and rear disc brakes",
        "Tripper navigation system (on select variants)",
        "Retro styling with modern engineering"
      ],
      amazonUrl: "https://www.amazon.in/s?k=royal+enfield+classic+350+accessories",
      flipkartUrl: "https://www.flipkart.com/search?q=royal+enfield+classic+350+accessories"
    },
    {
      name: "Bajaj Pulsar NS200",
      price: "₹1,49,000 - ₹1,54,000",
      features: [
        "199.5cc liquid-cooled single-cylinder engine",
        "24.5 bhp power and 18.5 Nm torque",
        "Perimeter frame with monoshock rear suspension",
        "Single-channel ABS with front and rear disc brakes",
        "Digital-analog instrument cluster"
      ],
      amazonUrl: "https://www.amazon.in/s?k=bajaj+pulsar+ns200+accessories",
      flipkartUrl: "https://www.flipkart.com/search?q=bajaj+pulsar+ns200+accessories"
    },
    {
      name: "TVS Apache RTR 160 4V",
      price: "₹1,21,000 - ₹1,31,000",
      features: [
        "159.7cc oil-cooled single-cylinder engine",
        "17.63 bhp power and 14.73 Nm torque",
        "Ride modes: Sport, Urban, and Rain",
        "SmartXonnect Bluetooth connectivity",
        "Glide Through Technology for low-speed riding"
      ],
      amazonUrl: "https://www.amazon.in/s?k=tvs+apache+rtr+160+accessories",
      flipkartUrl: "https://www.flipkart.com/search?q=tvs+apache+rtr+160+accessories"
    }
  ],
  electronics: [
    {
      name: "Sony Bravia XR-55A80J OLED TV",
      price: "₹1,29,990",
      features: [
        "55-inch 4K OLED display with 120Hz refresh rate",
        "Cognitive Processor XR for superior picture quality",
        "Acoustic Surface Audio+ for immersive sound",
        "Google TV with hands-free voice search",
        "HDMI 2.1 with 4K/120fps and VRR for gaming"
      ],
      amazonUrl: "https://www.amazon.in/Sony-Bravia-inches-Google-XR-55A80J/dp/B095JQSCGM",
      flipkartUrl: "https://www.flipkart.com/sony-bravia-139-cm-55-inch-oled-ultra-hd-4k-smart-tv-xr-55a80j/p/itm3f8e7b0d1cdc4"
    },
    {
      name: "Apple MacBook Air M2",
      price: "₹1,07,990",
      features: [
        "13.6-inch Liquid Retina display",
        "Apple M2 chip with 8-core CPU and 8-core GPU",
        "Up to 18 hours of battery life",
        "1080p FaceTime HD camera",
        "MagSafe charging and two Thunderbolt ports"
      ],
      amazonUrl: "https://www.amazon.in/Apple-MacBook-Laptop-chip-256GB/dp/B0B3BQ11LP",
      flipkartUrl: "https://www.flipkart.com/apple-2022-macbook-air-m2-8-core-cpu-8-core-gpu-8-gb-256-gb-ssd-mac-os-monterey-mly33hn-a/p/itm7e4b107d7d1d0"
    },
    {
      name: "Sony WH-1000XM5 Headphones",
      price: "₹34,990",
      features: [
        "Industry-leading noise cancellation with 8 microphones",
        "30-hour battery life with quick charging",
        "LDAC codec support for high-resolution audio",
        "Speak-to-chat feature that automatically pauses music",
        "Multipoint connection to connect to two devices simultaneously"
      ],
      amazonUrl: "https://www.amazon.in/Sony-WH-1000XM5-Cancelling-Headphones-Hands-Free/dp/B09XS7JWHH",
      flipkartUrl: "https://www.flipkart.com/sony-wh-1000xm5-bluetooth-headset/p/itm7de6e7f5e8a6b"
    }
  ]
};

/**
 * Determines the product category based on user query
 * @param {string} query - The user's query
 * @returns {string|null} - The identified product category or null if not found
 */
const identifyProductCategory = (query) => {
  const queryLower = query.toLowerCase();
  
  if (queryLower.includes('phone') || queryLower.includes('smartphone') || queryLower.includes('mobile')) {
    return 'smartphones';
  } else if (queryLower.includes('car') || queryLower.includes('suv') || queryLower.includes('vehicle')) {
    return 'cars';
  } else if (queryLower.includes('bike') || queryLower.includes('motorcycle') || queryLower.includes('scooter')) {
    return 'bikes';
  } else if (queryLower.includes('tv') || queryLower.includes('laptop') || queryLower.includes('headphone') || 
             queryLower.includes('computer') || queryLower.includes('electronics')) {
    return 'electronics';
  }
  
  return null;
};

/**
 * Formats a product into a markdown string
 * @param {Object} product - The product object
 * @param {number} index - The index of the product in the list
 * @returns {string} - Formatted markdown string
 */
const formatProductToMarkdown = (product, index) => {
  let markdown = `${index + 1}. **${product.name}** - ${product.price}\n`;
  
  // Add features
  product.features.forEach(feature => {
    markdown += `• ${feature}\n`;
  });
  
  // Add shopping links
  markdown += `• Amazon: ${product.amazonUrl}\n`;
  markdown += `• Flipkart: ${product.flipkartUrl}\n\n`;
  
  return markdown;
};

/**
 * Generates a response with product recommendations based on the user query
 * @param {string} query - The user's query
 * @returns {string} - A formatted response with product recommendations
 */
const generateProductRecommendations = (query) => {
  const category = identifyProductCategory(query);
  
  if (!category || !productDatabase[category]) {
    return "I'm sorry, but I couldn't find any product recommendations that match your query. Could you please specify what type of product you're looking for? For example, smartphones, cars, bikes, or electronics.";
  }
  
  const products = productDatabase[category];
  let response = `Based on your requirements, here are the top recommended ${category}:\n\n`;
  
  products.forEach((product, index) => {
    response += formatProductToMarkdown(product, index);
  });
  
  response += "You can click 'Find Dealers Near You' on any product to locate stores in your area.";
  
  return response;
};

/**
 * Analyzes user message to determine if it's asking for product recommendations
 * @param {string} message - The user's message
 * @returns {boolean} - Whether the message is asking for product recommendations
 */
const isAskingForRecommendations = (message) => {
  const messageLower = message.toLowerCase();
  
  // Keywords that indicate the user is looking for product recommendations
  const recommendationKeywords = [
    'recommend', 'suggestion', 'best', 'top', 'buy', 'purchase', 'looking for',
    'want to buy', 'searching for', 'good', 'which one', 'which is better'
  ];
  
  // Check if the message contains any product category keywords
  const hasCategoryKeyword = [
    'phone', 'smartphone', 'mobile', 'car', 'suv', 'vehicle', 'bike', 
    'motorcycle', 'scooter', 'tv', 'laptop', 'headphone', 'computer', 'electronics'
  ].some(keyword => messageLower.includes(keyword));
  
  // Check if the message contains any recommendation keywords
  const hasRecommendationKeyword = recommendationKeywords.some(keyword => 
    messageLower.includes(keyword)
  );
  
  return hasCategoryKeyword && (hasRecommendationKeyword || messageLower.length < 30);
};

export {
  generateProductRecommendations,
  isAskingForRecommendations,
  identifyProductCategory
};
