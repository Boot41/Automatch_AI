import { Request, Response } from 'express';
import { searchDealers } from '../services/dealer.service';
import { z } from 'zod';

// Validation schema for dealer search request
const dealerSearchSchema = z.object({
  location: z.string().min(1, 'Location is required'),
  productName: z.string().min(1, 'Product name is required'),
});

export const findDealers = async (req: Request, res: Response) => {
  try {
    console.log('Dealer search request received:', req.body);
    
    // Validate request body
    const validationResult = dealerSearchSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      console.warn('Invalid dealer search request:', validationResult.error.errors);
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: validationResult.error.errors,
      });
    }

    const { location, productName } = validationResult.data;
    console.log(`Searching for ${productName} dealers near ${location}`);
    
    // Search for dealers
    const dealers = await searchDealers({ location, productName });
    
    console.log(`Found ${dealers.length} dealers for ${productName} near ${location}`);
    
    if (dealers.length === 0) {
      return res.status(200).json({
        success: true,
        message: `No dealers found for ${productName} near ${location}`,
        data: [],
      });
    }
    
    return res.status(200).json({
      success: true,
      message: `Found ${dealers.length} dealers for ${productName} near ${location}`,
      data: dealers,
    });
  } catch (error: any) {
    console.error('Error in findDealers controller:', error);
    
    // Determine appropriate status code based on error
    const statusCode = error.message?.includes('API_KEY') ? 503 : 500;
    
    return res.status(statusCode).json({
      success: false,
      message: error.message || 'Failed to find dealers',
      error: process.env.NODE_ENV === 'development' ? error.stack : undefined,
    });
  }
};
