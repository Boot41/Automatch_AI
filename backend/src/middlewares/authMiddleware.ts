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

    (req as any).user = user; // Type casting here
    next();
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong." });
  }
};