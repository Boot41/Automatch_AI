import { searchDealers } from '../services/dealer.service';
import axios from 'axios';
import dotenv from 'dotenv';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

// Mock dotenv config
jest.mock('dotenv', () => ({
  config: jest.fn(),
}));

describe('Dealer Service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    // Mock process.env
    process.env.SERPAPI_API_KEY = 'test-api-key';
  });

  afterEach(() => {
    // Clean up
    delete process.env.SERPAPI_API_KEY;
  });

  it('should search for dealers successfully', async () => {
    // Mock response data
    const mockDealerData = {
      data: {
        local_results: [
          {
            title: 'Test Dealer 1',
            address: '123 Test St, Test City',
            rating: 4.5,
            reviews: 100,
            phone: '123-456-7890',
            website: 'https://testdealer1.com',
            directions: 'https://maps.google.com/directions',
            open_state: 'Open now',
            thumbnail: 'https://example.com/image1.jpg',
          },
          {
            title: 'Test Dealer 2',
            address: '456 Test Ave, Test Town',
            rating: 4.2,
            reviews: 50,
            phone: '987-654-3210',
            website: 'https://testdealer2.com',
            directions: 'https://maps.google.com/directions',
            open_state: 'Closes at 6 PM',
            thumbnail: 'https://example.com/image2.jpg',
          },
        ],
      },
    };

    // Set up axios mock
    mockedAxios.get.mockResolvedValueOnce(mockDealerData);

    // Call the function
    const result = await searchDealers({
      location: 'Test City',
      productName: 'Test Product',
    });

    // Assertions
    expect(mockedAxios.get).toHaveBeenCalledWith('https://serpapi.com/search', {
      params: {
        engine: 'google_maps',
        q: 'Test Product dealer near Test City',
        api_key: 'test-api-key',
        type: 'search',
      },
    });

    expect(result).toEqual([
      {
        name: 'Test Dealer 1',
        address: '123 Test St, Test City',
        rating: 4.5,
        reviewCount: 100,
        phone: '123-456-7890',
        website: 'https://testdealer1.com',
        directions: 'https://maps.google.com/directions',
        openHours: 'Open now',
        imageUrl: 'https://example.com/image1.jpg',
      },
      {
        name: 'Test Dealer 2',
        address: '456 Test Ave, Test Town',
        rating: 4.2,
        reviewCount: 50,
        phone: '987-654-3210',
        website: 'https://testdealer2.com',
        directions: 'https://maps.google.com/directions',
        openHours: 'Closes at 6 PM',
        imageUrl: 'https://example.com/image2.jpg',
      },
    ]);
  });

  it('should handle empty results', async () => {
    // Mock response with no results
    const mockEmptyData = {
      data: {
        local_results: [],
      },
    };

    // Set up axios mock
    mockedAxios.get.mockResolvedValueOnce(mockEmptyData);

    // Call the function
    const result = await searchDealers({
      location: 'Non-existent City',
      productName: 'Rare Product',
    });

    // Assertions
    expect(result).toEqual([]);
  });

  it('should handle API errors', async () => {
    // Mock axios to throw an error
    const errorMessage = 'API request failed';
    mockedAxios.get.mockRejectedValueOnce(new Error(errorMessage));

    // Call the function and expect it to throw
    await expect(
      searchDealers({
        location: 'Test City',
        productName: 'Test Product',
      })
    ).rejects.toThrow(errorMessage);
  });

  it('should throw error when API key is missing', async () => {
    // Remove API key from env
    delete process.env.SERPAPI_API_KEY;

    // Call the function and expect it to throw
    await expect(
      searchDealers({
        location: 'Test City',
        productName: 'Test Product',
      })
    ).rejects.toThrow('SERPAPI_API_KEY is not defined in environment variables');
  });
});
