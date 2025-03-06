import { Request, Response } from "express";
import { prisma } from "../db";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { JWT_SECRET } from "../secrets";

interface CustomRequest extends Request {
  user?: any;
}

export const signup = async (req: Request, res: Response) => {
  try {
    const { name, email, password } = req.body;

    console.log("Signup request received:", { name, email });

    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    try {
      const existingUser = await prisma.user.findUnique({
        where: { email },
      });

      if (existingUser) {
        return res.status(400).json({ message: "User Already Exists" });
      }

      const hashedPassword = await bcrypt.hash(password, 10);

      const user = await prisma.user.create({
        data: { 
          name, 
          email, 
          password: hashedPassword 
        },
      });

      // Generate token immediately after user creation
      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      console.log("User created successfully:", { id: user.id, email: user.email });

      return res.status(201).json({
        message: "User created successfully",
        user: userWithoutPassword,
        token
      });
    } catch (dbError:any) {
      console.error("Database error during signup:", dbError);
      return res.status(500).json({ message: "Database error during signup", error: dbError.message });
    }
  } catch (error:any) {
    console.error("Signup error:", error);
    return res.status(500).json({ message: "Internal server error during signup", error: error.message });
  }
};

export const signin = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    console.log("Signin request received:", { email });

    if (!email || !password) {
      return res.status(400).json({ message: "Email and password are required" });
    }

    try {
      const user = await prisma.user.findUnique({
        where: { email },
      });

      if (!user) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const isValid = await bcrypt.compare(password, user.password);
      if (!isValid) {
        return res.status(400).json({ message: "Invalid credentials" });
      }

      const token = jwt.sign({ userId: user.id }, JWT_SECRET, { expiresIn: '24h' });

      // Remove password from response
      const { password: _, ...userWithoutPassword } = user;

      console.log("Login successful:", { id: user.id, email: user.email });

      return res.status(200).json({
        message: "Login successful",
        user: userWithoutPassword,
        token
      });
    } catch (dbError:any) {
      console.error("Database error during signin:", dbError);
      return res.status(500).json({ message: "Database error during signin", error: dbError.message });
    }
  } catch (error:any) {
    console.error("Signin error:", error);
    return res.status(500).json({ message: "Internal server error during signin", error: error.message });
  }
};

export const getLoggedInUser = async (req: CustomRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ message: "Not authenticated" });
    }

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user;

    return res.status(200).json({
      message: "User data retrieved successfully",
      user: userWithoutPassword
    });
  } catch (error:any) {
    console.error("Error getting logged in user:", error);
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};