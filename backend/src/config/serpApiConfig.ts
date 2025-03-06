import axios from "axios";
import {SERP_API_KEY} from "../secrets"

export const getGoogleDealers = async (query: string, location: string) => {
  const apiKey = SERP_API_KEY;  // Replace your key
  const url = `https://serpapi.com/search?engine=google_local&q=${query}&location=${encodeURIComponent(
    location
  )}&api_key=${apiKey}`;

  try {
    // Try to get real data from the API
    const response = await axios.get(url);

    if (response.data.local_results && response.data.local_results.length > 0) {
      // Map the API response to a consistent format
      return response.data.local_results.slice(0, 3).map((dealer: any) => ({
        title: dealer.title,
        name: dealer.title,
        address: dealer.address || dealer.direction || `${location}`,
        location: dealer.location || location,
        phone: dealer.phone || 'Phone not available',
        rating: dealer.rating ? `${dealer.rating}/5` : '4.5/5',
        hours: dealer.hours || '9:00 AM - 6:00 PM',
        thumbnail: dealer.thumbnail
      }));
    }
    
    // If no results, fall back to mock data
    console.log("No dealers found in API response, using mock data");
    return getMockDealers(query);
  } catch (err: any) {
    console.error("SerpAPI Error:", err.response?.data?.error || err.message);
    console.log("Falling back to mock dealer data");
    return getMockDealers(query);
  }
};

// Function to generate mock dealer data
const getMockDealers = (product: string) => {
  return [
    {
      title: `${product.toUpperCase()} Authorized Dealer`,
      name: `${product.toUpperCase()} Authorized Dealer`,
      address: '123 Main Street, Bangalore, Karnataka',
      location: 'Bangalore, Karnataka',
      phone: '+91 9876543210',
      rating: '4.8/5',
      hours: '9:00 AM - 8:00 PM'
    },
    {
      title: `Premium ${product} Showroom`,
      name: `Premium ${product} Showroom`,
      address: '456 Park Avenue, Bangalore, Karnataka',
      location: 'Bangalore, Karnataka',
      phone: '+91 8765432109',
      rating: '4.2/5',
      hours: '10:00 AM - 7:00 PM'
    },
    {
      title: `Elite ${product} Center`,
      name: `Elite ${product} Center`,
      address: '789 Lake Road, Bangalore, Karnataka',
      location: 'Bangalore, Karnataka',
      phone: '+91 7654321098',
      rating: '4.9/5',
      hours: '9:30 AM - 7:30 PM'
    }
  ];
};
