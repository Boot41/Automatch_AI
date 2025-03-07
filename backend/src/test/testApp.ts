import express from 'express';
import authRoutes from '../routes/auth.routes';
import sessionRoutes from '../routes/session.routes';
import chatbotRoutes from '../routes/chatbot.routes';
import dealerRoutes from '../routes/dealer.routes';

// Create Express app for testing
const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/session', sessionRoutes);
app.use('/api/v1/ai', chatbotRoutes);
app.use('/api/v1/dealer', dealerRoutes);

export { app };
