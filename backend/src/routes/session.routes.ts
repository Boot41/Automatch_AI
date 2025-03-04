import express from "express";
import { getMessages,getSessions } from "../controllers/session.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const sessionRouter = express.Router();

sessionRouter.get("/sessions", authMiddleware as any, getSessions as any);
sessionRouter.get("/messages/:sessionId", authMiddleware as any, getMessages as any);

export default sessionRouter;
