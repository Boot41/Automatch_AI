import { Router } from "express";
import authRoutes from "./auth.routes";
import airouter from "./chatbot.routes";
import dealerRouter from "./dealer.routes";
import sessionRouter from "./session.routes";

const rootRouter:Router = Router();

rootRouter.use("/auth" , authRoutes);
rootRouter.use("/ai" , airouter);
rootRouter.use("/dealer" , dealerRouter);
rootRouter.use("/user" , sessionRouter);

export default rootRouter;