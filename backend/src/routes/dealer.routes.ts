import { Router } from "express";
import { authMiddleware } from "../middlewares/authMiddleware";
import { getNearbyDealers } from '../controllers/dealer.controller';


const dealerRouter:Router = Router();

dealerRouter.post("/find" , authMiddleware as any, getNearbyDealers);

export default dealerRouter;