import express from 'express';
import { findDealers } from '../controllers/dealer.controller';
import { authMiddleware } from '../middlewares/authMiddleware';

const router = express.Router();

// Route to find dealers based on location and product name
router.post('/search', authMiddleware as any, findDealers as any);

export default router;
