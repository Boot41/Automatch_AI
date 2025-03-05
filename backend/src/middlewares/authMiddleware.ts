import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";
import { prisma } from "../db";
import { JWT_SECRET } from "../secrets";

export const authMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { authorization } = req.headers;

    if (!authorization) {
      return res.status(401).json({ message: "User must be logged in." });
    }

    const token = authorization.replace("Bearer ", "");
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: number };

    const user = await prisma.user.findUnique({
      where: { id: decoded.userId },
    });

    if (!user) {
      return res.status(401).json({ message: "User not found." });
    }

    // Store both the user and the token in the request object
    (req as any).user = user;
    (req as any).token = token; // Add the token to the request object
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};