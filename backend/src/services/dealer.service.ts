import axios from 'axios';
import dotenv from 'dotenv';
import { SERP_API_KEY } from '../secrets';

dotenv.config();

const SERPAPI_API_KEY = SERP_API_KEY;

interface DealerSearchParams {
  location: string;
  productName: string;
}

interface DealerInfo {
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

    const query = `${productName} dealer near ${location}`;
    
    const response = await axios.get('https://serpapi.com/search', {
      params: {
        engine: 'google_maps',
        q: query,
        api_key: SERPAPI_API_KEY,
        type: 'search',
      },
    });

    if (!response.data || !response.data.local_results) {
      return [];
    }

    const dealers = response.data.local_results.map((result: any) => {
      return {
        name: result.title || 'Unknown Dealer',
        address: result.address || 'Address not available',
        rating: result.rating,
        reviewCount: result.reviews,
        phone: result.phone,
        website: result.website,
        directions: result.directions,
        openHours: result.open_state,
        imageUrl: result.thumbnail,
      };
    });

    return dealers.slice(0,4);
  } catch (error) {
    console.error('Error searching for dealers:', error);
    throw error;
  }
};
