import { GoogleGenerativeAI } from '@google/generative-ai';
import * as geminiService from '../../services/gemini.service';

// Mock the GoogleGenerativeAI class
jest.mock('@google/generative-ai');

describe('Gemini Service', () => {
  // Create a mock instance for the GoogleGenerativeAI
  const mockGenerateContent = jest.fn().mockResolvedValue({
    response: {
      text: () => 'Mocked AI response'
    }
  });

  const mockGetGenerativeModel = jest.fn().mockReturnValue({
    generateContent: mockGenerateContent
  });

  beforeEach(() => {
    // Reset all mocks before each test
    jest.clearAllMocks();
    
    // Setup the mock implementation
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: mockGetGenerativeModel
    }));
  });

  describe('generateContent', () => {
    it('should generate content successfully', async () => {
      // Create a mock conversation
      const conversation = [
        'user: Hello, I need help finding a smartphone',
        'bot: What is your budget?',
        'user: Around $500'
      ];

      const result = await geminiService.generateContent(conversation);

      // Check that the result is a string
      expect(typeof result).toBe('string');
      
      // Verify the Gemini API was called
      expect(mockGetGenerativeModel).toHaveBeenCalled();
      expect(mockGenerateContent).toHaveBeenCalled();
    });

    it('should handle errors gracefully', async () => {
      // Mock the Gemini API to throw an error
      mockGenerateContent.mockRejectedValueOnce(new Error('API error'));

      // Create a mock conversation
      const conversation = [
        'user: Hello, I need help finding a smartphone',
        'bot: What is your budget?',
        'user: Around $500'
      ];

      // The service should throw an error
      await expect(geminiService.generateContent(conversation)).rejects.toThrow();
    });
  });

  it('should handle first message in conversation', async () => {
    const conversation = ['user: Hello'];

    const result = await geminiService.generateContent(conversation);

    expect(result).toBe('Mocked AI response');

    // Get the mock model instance
    const mockModel = (GoogleGenerativeAI as jest.Mock).mock.results[0].value
      .getGenerativeModel.mock.results[0].value;
    
    // Verify the prompt contains instruction for first message
    const promptArg = mockModel.generateContent.mock.calls[0][0];
    expect(promptArg).toContain('Ask the user what specific product category');
  });

  it('should provide recommendations after enough questions', async () => {
    const conversation = [
      'user: I need a new phone',
      'bot: What is your budget?',
      'user: Around $500',
      'bot: Do you prefer Android or iOS?',
      'user: Android'
    ];

    const result = await geminiService.generateContent(conversation);

    expect(result).toBe('Mocked AI response');

    // Get the mock model instance
    const mockModel = (GoogleGenerativeAI as jest.Mock).mock.results[0].value
      .getGenerativeModel.mock.results[0].value;
    
    // Verify the prompt contains instruction for recommendations
    const promptArg = mockModel.generateContent.mock.calls[0][0];
    expect(promptArg).toContain('provide THREE specific product recommendations');
  });

  it('should ask about budget when product category is known', async () => {
    const conversation = [
      'user: I need a new smartphone',
      'bot: What features are you looking for?'
    ];

    const result = await geminiService.generateContent(conversation);

    expect(result).toBe('Mocked AI response');

    // Get the mock model instance
    const mockModel = (GoogleGenerativeAI as jest.Mock).mock.results[0].value
      .getGenerativeModel.mock.results[0].value;
    
    // Verify the prompt asks about budget
    const promptArg = mockModel.generateContent.mock.calls[0][0];
    expect(promptArg).toContain('Ask about their budget range');
  });

  it('should handle API errors gracefully', async () => {
    // Mock the API to throw an error
    const mockGenerateContent = jest.fn().mockRejectedValue(new Error('API error'));
    (GoogleGenerativeAI as jest.Mock).mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockImplementation(() => ({
        generateContent: mockGenerateContent
      }))
    }));

    const conversation = ['user: Hello'];

    await expect(geminiService.generateContent(conversation)).rejects.toThrow('AI Recommendation failed');
  });

  it('should detect product category from user messages', async () => {
    const conversation = [
      'user: I want to buy a laptop',
      'bot: What is your budget?'
    ];

    await geminiService.generateContent(conversation);

    // Get the mock model instance
    const mockModel = (GoogleGenerativeAI as jest.Mock).mock.results[0].value
      .getGenerativeModel.mock.results[0].value;
    
    // Verify the prompt contains the detected category
    const promptArg = mockModel.generateContent.mock.calls[0][0];
    expect(promptArg).toContain('laptop');
  });

  it('should detect budget information from user messages', async () => {
    const conversation = [
      'user: I want to buy a smartphone',
      'bot: What is your budget?',
      'user: Around ₹20000'
    ];

    await geminiService.generateContent(conversation);

    // Get the mock model instance
    const mockModel = (GoogleGenerativeAI as jest.Mock).mock.results[0].value
      .getGenerativeModel.mock.results[0].value;
    
    // Verify the prompt asks for more preferences (not budget again)
    const promptArg = mockModel.generateContent.mock.calls[0][0];
    expect(promptArg).toContain('Ask ONE more essential question');
  });
});
