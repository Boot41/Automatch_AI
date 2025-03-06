import axios from 'axios';
import dotenv from 'dotenv';
import { SERP_API_KEY } from '../secrets';

dotenv.config();

const SERPAPI_API_KEY = SERP_API_KEY;

interface DealerSearchParams {
  location: string;
  productName: string;
}

export interface DealerInfo {
  name: string;
  address: string;
  rating?: number;
  reviewCount?: number;
  phone?: string;
  website?: string;
  directions?: string;
  openHours?: string;
  imageUrl?: string;
}

export const searchDealers = async ({ location, productName }: DealerSearchParams): Promise<DealerInfo[]> => {
  try {
    if (!SERPAPI_API_KEY) {
      throw new Error('SERPAPI_API_KEY is not defined in environment variables');
    }

    if (!location || !productName) {
      throw new Error('Location and product name are required for dealer search');
    }

    const query = `${productName} dealer near ${location}`;
    
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_maps',
        q: query,
        api_key: SERPAPI_API_KEY,
        type: 'search',
      },
    }).catch(error => {
      console.error('SerpAPI request failed:', error.message);
      throw new Error(`Failed to fetch dealer data: ${error.message}`);
    });

    if (!response.data) {
      console.warn('No data returned from SerpAPI');
      return [];
    }

    if (!response.data.local_results || !Array.isArray(response.data.local_results)) {
      console.warn('No local results found in SerpAPI response');
      return [];
    }

    const dealers = response.data.local_results.map((result: any) => {
      // Safely extract data with fallbacks
      return {
        name: result.title || 'Unknown Dealer',
        address: result.address || 'Address not available',
        rating: typeof result.rating === 'number' ? result.rating : undefined,
        reviewCount: typeof result.reviews === 'number' ? result.reviews : undefined,
        phone: result.phone || 'Phone not available',
        website: result.website || '',
        directions: result.directions || '',
        openHours: result.open_state || 'Hours not available',
        imageUrl: result.thumbnail || '',
      };
    });

    // Limit to 5 dealers to avoid overwhelming the user
    return dealers.slice(0, 5);
  } catch (error: any) {
    console.error('Error searching for dealers:', error);
    // Rethrow with a user-friendly message
    throw new Error(`Failed to search for dealers: ${error.message || 'Unknown error'}`);
  }
};
