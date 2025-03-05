import express from "express";
import cors from "cors";
import authRoutes from "../routes/auth.routes";
import aiRoutes from "../routes/chatbot.routes";
import dealerRoutes from "../routes/dealer.routes";
import sessionRoutes from "../routes/session.routes";

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/v1/auth', authRoutes);
app.use('/api/v1/ai', aiRoutes);
app.use('/api/v1/dealer', dealerRoutes);
app.use('/api/v1/user', sessionRoutes);

export { app };
