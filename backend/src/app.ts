import express from 'express';
import cors from 'cors';
import authRoutes from './routes/auth.routes';
import aiRoutes from './routes/chatbot.routes';

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);

export { app };
