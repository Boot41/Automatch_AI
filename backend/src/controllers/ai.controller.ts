import { Request, Response } from "express";
import { prisma } from "../db";
import { generateContent } from "../services/gemini.service";
import { getNearbyDealers } from "../services/dealer.service";

export const startChat = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Create a new session
    const newSession = await prisma.session.create({
      data: {
        userId: user.id,
      },
    });

    // Initial bot message
    const welcomeMessage = await prisma.message.create({
      data: {
        sessionId: newSession.id,
        role: "bot",
        content: "Hello! How can I help you today?",
      },
    });

    res.status(201).json({
      session: newSession,
      message: welcomeMessage.content,
    });
  } catch (error: any) {
    console.error("Start Chat Error:", error.message);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const replyChat = async (req: Request, res: Response) => {
  try {
    const { sessionId, userReply, latitude, longitude } = req.body;
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    // Store User Reply
    await prisma.message.create({
      data: { sessionId, role: "user", content: userReply },
    });

    // Fetch previous messages
    const previousMessages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    const prompt = previousMessages
      .map((msg) => `${msg.role}: ${msg.content}`)
      .join("\n");

    // Generate AI Response
    let aiResponse = await generateContent([
      prompt,
      `AI: If the user shows interest in any product, recommend exactly three products and fetch their nearby dealers automatically if latitude and longitude are provided.
      
      Use this format:
      
      1. Product Name: Apple MacBook Pro
         Price Range: ₹1,20,000 - ₹1,50,000
         Features: M2 Chip, Retina Display, 18hr Battery

      Nearby Dealers:
      - Supreme Computers | 4.6 ⭐ | +91 98802 06523
      - Karthik Laptop World | 4.7 ⭐ | +91 98456 77189
      - Laptop Clinic | 4.1 ⭐ | +91 80 4122 4579
      `,
    ]);

    // Check if the AI has finalized product recommendations
    if (aiResponse.includes("Product Name") && latitude && longitude) {
      const productName = aiResponse.match(/Product Name: (.+)/)?.[1];

      if (productName) {
        const dealers = await getNearbyDealers(productName, { latitude, longitude });
        const dealersText = dealers
          .map((d: any) => `${d.name} | ${d.rating} ⭐ | ${d.phone}`)
          .join("\n");

        aiResponse += `\n\nNearby Dealers:\n${dealersText}`;
      }
    }

    // Store Bot Reply
    const botMessage = await prisma.message.create({
      data: { sessionId, role: "bot", content: aiResponse },
    });

    res.status(200).json({ message: botMessage.content });
  } catch (error: any) {
    console.error("Reply Chat Error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};