import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { replyChat, startChat, saveDealerMessage } from "../controllers/ai.controller";


const airouter:Router = Router();

airouter.post("/start" , authMiddleware as any, startChat as any);
airouter.post("/reply" , authMiddleware as any, replyChat as any);
airouter.post("/save-dealer-message" , authMiddleware as any, saveDealerMessage as any);

export default airouter;