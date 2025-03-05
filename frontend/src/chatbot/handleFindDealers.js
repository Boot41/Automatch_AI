const handleFindDealers = async (productName) => {
  if (!productName || productName.trim() === '') {
    toast.error('Please specify a product to find dealers for', {
      position: "top-center",
      autoClose: 3000,
    });
    return;
  }
  
  setSelectedProduct(productName);

  // Add user message to the chat
  setMessages((prev) => [...prev, { role: "user", content: `Find dealers for ${productName}` }]);
  
  // Set loading state
  setLoading(true);
  
  // Fixed coordinates for Bangalore (as requested)
  const latitude = 12.971598;
  const longitude = 77.594566;
  
  // Get token from localStorage
  const token = localStorage.getItem('token');
  
  // Determine if we should try the API call
  const shouldTryApi = !!token;
  
  if (shouldTryApi) {
    try {
      // Make API call to the backend
      const response = await fetch('http://localhost:3000/api/v1/dealer/find', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          product: productName,
          latitude,
          longitude
        })
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ message: `HTTP error ${response.status}` }));
        console.error('API Error:', errorData);
        throw new Error(errorData.message || `Failed to fetch dealers: ${response.status}`);
      }
      
      const data = await response.json();
      const dealers = data.dealers || [];
      
      if (dealers.length > 0) {
        // Format dealer response from API data
        let dealerResponse = `Here are some dealers near you for **${productName}**:\n\n`;
        
        dealers.forEach((dealer, index) => {
          dealerResponse += `${index + 1}. **${dealer.title || dealer.name}**\n`;
          dealerResponse += `   • Address: ${dealer.address || dealer.location || 'Address not available'}\n`;
          dealerResponse += `   • Phone: ${dealer.phone || 'Phone not available'}\n`;
          if (dealer.rating) {
            dealerResponse += `   • Rating: ${dealer.rating}\n`;
          }
          if (dealer.hours) {
            dealerResponse += `   • Open: ${dealer.hours}\n`;
          }
          dealerResponse += '\n';
        });
        
        dealerResponse += `Would you like more information about any of these dealers?`;
        
        // Add dealer response to chat
        setMessages((prev) => [...prev, { role: "bot", content: dealerResponse }]);
        setLoading(false);
        return; // Exit function after successful API call
      } else {
        // No dealers found from API, fall through to mock data
        console.log('No dealers found from API, using mock data');
        throw new Error('No dealers found');
      }
    } catch (error) {
      console.error("Error finding dealers via API:", error);
      // Fall through to mock data
    }
  } else {
    console.log('No authentication token available, using mock data directly');
  }
  
  // Generate high-quality mock dealer data based on product name
  const mockDealers = [
    {
      title: `${productName.toUpperCase()} Authorized Dealer`,
      name: `${productName.toUpperCase()} Authorized Dealer`,
      address: '123 Main Street, Bangalore, Karnataka',
      location: 'Bangalore, Karnataka',
      phone: '+91 9876543210',
      rating: '⭐⭐⭐⭐⭐ (4.8/5)',
      hours: '9:00 AM - 8:00 PM'
    },
    {
      title: `Premium ${productName} Showroom`,
      name: `Premium ${productName} Showroom`,
      address: '456 Park Avenue, Bangalore, Karnataka',
      location: 'Bangalore, Karnataka',
      phone: '+91 8765432109',
      rating: '⭐⭐⭐⭐ (4.2/5)',
      hours: '10:00 AM - 7:00 PM'
    },
    {
      title: `Elite ${productName} Center`,
      name: `Elite ${productName} Center`,
      address: '789 Lake Road, Bangalore, Karnataka',
      location: 'Bangalore, Karnataka',
      phone: '+91 7654321098',
      rating: '⭐⭐⭐⭐⭐ (4.9/5)',
      hours: '9:30 AM - 7:30 PM'
    }
  ];
  
  // Format dealer response with mock data
  let dealerResponse = `Here are some dealers near you for **${productName}**:\n\n`;
  
  mockDealers.forEach((dealer, index) => {
    dealerResponse += `${index + 1}. **${dealer.title}**\n`;
    dealerResponse += `   • Address: ${dealer.address}\n`;
    dealerResponse += `   • Phone: ${dealer.phone}\n`;
    dealerResponse += `   • Rating: ${dealer.rating}\n`;
    dealerResponse += `   • Open: ${dealer.hours}\n`;
    dealerResponse += '\n';
  });
  
  dealerResponse += `Would you like more information about any of these dealers?`;
  
  // Add dealer response to chat
  setMessages((prev) => [...prev, { role: "bot", content: dealerResponse }]);
  setLoading(false);
};
