import axios from 'axios';
import { searchDealers } from '../../services/dealer.service';

// Mock axios
jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('Dealer Service', () => {
  // Reset mocks before each test
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('should return dealer data when API call is successful', async () => {
    // Mock successful API response
    const mockApiResponse = {
      data: {
        local_results: [
          {
            title: 'Test Dealer 1',
            address: '123 Test St, Test City',
            rating: 4.5,
            reviews: 100,
            phone: '123-456-7890',
            website: 'https://testdealer1.com',
            directions: 'https://maps.google.com/directions/testdealer1',
            open_state: 'Open now: 9 AM - 6 PM',
            thumbnail: 'https://example.com/dealer1.jpg'
          },
          {
            title: 'Test Dealer 2',
            address: '456 Test Ave, Test Town',
            rating: 4.2,
            reviews: 75,
            phone: '987-654-3210',
            website: 'https://testdealer2.com',
            directions: 'https://maps.google.com/directions/testdealer2',
            open_state: 'Open now: 10 AM - 7 PM',
            thumbnail: 'https://example.com/dealer2.jpg'
          }
        ]
      }
    };

    mockedAxios.get.mockResolvedValue(mockApiResponse);

    const result = await searchDealers({
      location: 'Test City',
      productName: 'Smartphone'
    });

    // Verify axios was called correctly
    expect(mockedAxios.get).toHaveBeenCalledWith('https://serpapi.com/search', {
      params: expect.objectContaining({
        engine: 'google_maps',
        q: 'Smartphone dealer near Test City',
        api_key: expect.any(String),
        type: 'search',
      }),
    });

    // Verify the result structure
    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(2);
    
    // Check the first dealer's data
    expect(result[0]).toHaveProperty('name', 'Test Dealer 1');
    expect(result[0]).toHaveProperty('address', '123 Test St, Test City');
    expect(result[0]).toHaveProperty('rating', 4.5);
    expect(result[0]).toHaveProperty('reviewCount', 100);
    expect(result[0]).toHaveProperty('phone', '123-456-7890');
    expect(result[0]).toHaveProperty('website', 'https://testdealer1.com');
    expect(result[0]).toHaveProperty('directions', 'https://maps.google.com/directions/testdealer1');
    expect(result[0]).toHaveProperty('openHours', 'Open now: 9 AM - 6 PM');
    expect(result[0]).toHaveProperty('imageUrl', 'https://example.com/dealer1.jpg');
  });

  it('should return empty array when no local results are found', async () => {
    // Mock API response with no local results
    const mockApiResponse = {
      data: {
        // No local_results property
      }
    };

    mockedAxios.get.mockResolvedValue(mockApiResponse);

    const result = await searchDealers({
      location: 'Remote Location',
      productName: 'Rare Product'
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should return empty array when local_results is not an array', async () => {
    // Mock API response with local_results not being an array
    const mockApiResponse = {
      data: {
        local_results: 'not an array'
      }
    };

    mockedAxios.get.mockResolvedValue(mockApiResponse);

    const result = await searchDealers({
      location: 'Test City',
      productName: 'Smartphone'
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should return empty array when local_results is empty', async () => {
    // Mock API response with empty local_results
    const mockApiResponse = {
      data: {
        local_results: []
      }
    };

    mockedAxios.get.mockResolvedValue(mockApiResponse);

    const result = await searchDealers({
      location: 'Test City',
      productName: 'Smartphone'
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(0);
  });

  it('should handle missing fields in dealer data gracefully', async () => {
    // Mock API response with incomplete dealer data
    const mockApiResponse = {
      data: {
        local_results: [
          {
            // Only title is provided
            title: 'Incomplete Dealer'
            // Other fields are missing
          }
        ]
      }
    };

    mockedAxios.get.mockResolvedValue(mockApiResponse);

    const result = await searchDealers({
      location: 'Test City',
      productName: 'Smartphone'
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(1);
    expect(result[0]).toHaveProperty('name', 'Incomplete Dealer');
    expect(result[0]).toHaveProperty('address', 'Address not available');
    expect(result[0]).toHaveProperty('phone', 'Phone not available');
    expect(result[0]).not.toHaveProperty('rating'); // Rating should be undefined
  });

  it('should throw error when API call fails', async () => {
    // Mock API call failure
    mockedAxios.get.mockRejectedValue(new Error('API request failed'));

    await expect(searchDealers({
      location: 'Test City',
      productName: 'Smartphone'
    })).rejects.toThrow('Failed to fetch dealer data: API request failed');
  });

  it('should throw error when location is missing', async () => {
    await expect(searchDealers({
      location: '',
      productName: 'Smartphone'
    })).rejects.toThrow('Location and product name are required for dealer search');

    // Verify axios was not called
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('should throw error when productName is missing', async () => {
    await expect(searchDealers({
      location: 'Test City',
      productName: ''
    })).rejects.toThrow('Location and product name are required for dealer search');

    // Verify axios was not called
    expect(mockedAxios.get).not.toHaveBeenCalled();
  });

  it('should limit the number of dealers returned to 5', async () => {
    // Mock API response with more than 5 dealers
    const mockApiResponse = {
      data: {
        local_results: Array(10).fill(0).map((_, i) => ({
          title: `Test Dealer ${i + 1}`,
          address: `${i + 1}23 Test St, Test City`,
          rating: 4.0,
          reviews: 50,
          phone: '123-456-7890'
        }))
      }
    };

    mockedAxios.get.mockResolvedValue(mockApiResponse);

    const result = await searchDealers({
      location: 'Test City',
      productName: 'Smartphone'
    });

    expect(Array.isArray(result)).toBe(true);
    expect(result.length).toBe(5); // Should be limited to 5
  });
});
