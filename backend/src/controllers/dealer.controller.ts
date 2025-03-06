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
    // Validate request body
    const validationResult = dealerSearchSchema.safeParse(req.body);
    
    if (!validationResult.success) {
      return res.status(400).json({
        success: false,
        message: 'Invalid request data',
        errors: validationResult.error.errors,
      });
    }

    const { location, productName } = validationResult.data;
    
    // Search for dealers
    const dealers = await searchDealers({ location, productName });
    
    return res.status(200).json({
      success: true,
      data: dealers,
    });
  } catch (error: any) {
    console.error('Error in findDealers controller:', error);
    
    return res.status(500).json({
      success: false,
      message: error.message || 'Failed to find dealers',
    });
  }
};
