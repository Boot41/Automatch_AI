import { Request, Response } from "express";
import { prisma } from "../db";

// Fetch all sessions of the authenticated user
export const getSessions = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const sessions = await prisma.session.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
      include: {
        messages: {
          where: { role: "user" }, // Filter only user messages
          orderBy: { createdAt: "asc" }, // Get the first user message
          take: 1, // Fetch only the first message
        },
      },
    });

    res.status(200).json({ sessions });
  } catch (error: any) {
    console.error("Error fetching sessions:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};


// Fetch messages for a given session
export const getMessages = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Validate session ownership
    const session = await prisma.session.findUnique({
      where: { id: Number(sessionId) },
      include: { user: true },
    });

    if (!session || session.userId !== user.id) {
      return res.status(403).json({ message: "Unauthorized access to session" });
    }

    // Fetch messages for the session
    const messages = await prisma.message.findMany({
      where: { sessionId: Number(sessionId) },
      orderBy: { createdAt: "asc" },
    });

    res.status(200).json({ messages });
  } catch (error: any) {
    console.error("Error fetching messages:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// Delete a session
export const deleteSession = async (req: Request, res: Response) => {
  try {
    const { sessionId } = req.params;
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Validate session ownership
    const session = await prisma.session.findUnique({
      where: { id: Number(sessionId) },
    });

    if (!session || session.userId !== user.id) {
      return res.status(403).json({ message: "Unauthorized access to session" });
    }

    // Delete all messages in the session first
    await prisma.message.deleteMany({
      where: { sessionId: Number(sessionId) },
    });

    // Delete the session
    await prisma.session.delete({
      where: { id: Number(sessionId) },
    });

    res.status(200).json({ message: "Session deleted successfully" });
  } catch (error: any) {
    console.error("Error deleting session:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
