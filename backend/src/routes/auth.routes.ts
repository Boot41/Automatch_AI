import { Router } from "express";
import { signup, signin, getLoggedInUser } from "../controllers/auth.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

const router = Router();

router.post("/signup", signup as any);
router.post("/signin", signin as any);
router.get("/me", authMiddleware as any, getLoggedInUser as any); 

export default router;
