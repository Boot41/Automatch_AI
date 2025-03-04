import { Request, Response } from "express";
import { prisma } from "../db";
import { generateContent } from "../services/gemini.service";

export const startChat = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const session = await prisma.session.create({
      data: { userId: user.id },
    });

    const welcomeMessage = `Hello ${user.name}! 👋 Welcome to AutoMatch AI! What product are you looking for today?`;
    
    await prisma.message.create({
      data: { sessionId: session.id, role: "bot", content: welcomeMessage },
    });

    res.status(200).json({
      message: welcomeMessage,
      sessionId: session.id,
    });
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

export const replyChat = async (req: Request, res: Response) => {
  try {
    const { sessionId, userReply } = req.body;
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    await prisma.message.create({
      data: { sessionId, role: "user", content: userReply },
    });

    // Fetch all previous messages
    const previousMessages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    // Convert messages to prompt format
    const prompt = previousMessages.map((msg) => `${msg.role}: ${msg.content}`).join("\n");

    // Let Gemini decide what to ask or recommend
    const aiResponse = await generateContent([
      prompt,
      `AI: Based on the conversation so far, if the user has provided enough preferences, recommend exactly three products with their Name, Price Range, and Top 3 Features.
      
    If more information is needed, ask only one **specific** question to finalize the recommendation. Never ask more than 6 questions in total.`
    ]);
    const botMessage = await prisma.message.create({
      data: { sessionId, role: "bot", content: aiResponse },
    });

    res.status(200).json({ message: botMessage.content });
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};
