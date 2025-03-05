import { Request, Response } from "express";
import { prisma } from "../db";
import { generateContent } from "../services/gemini.service";
import axios from "axios";

const DEALER_API_URL = "http://localhost:3000/api/v1/dealer/find";

export const startChat = async (req: Request, res: Response) => {
  try {
    const user = (req as any).user;

    if (!user) {
      return res.status(401).json({ message: "User not authenticated" });
    }

    const newSession = await prisma.session.create({
      data: { userId: user.id },
    });

    const welcomeMessage = await prisma.message.create({
      data: {
        sessionId: newSession.id,
        role: "bot",
        content: "Hello! What product are you looking for today?",
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

    // Save user message to DB
    await prisma.message.create({
      data: { sessionId, role: "user", content: userReply },
    });

    // Fetch previous messages to build prompt
    const previousMessages = await prisma.message.findMany({
      where: { sessionId },
      orderBy: { createdAt: "asc" },
    });

    const prompt = previousMessages.map((msg) => `${msg.role}: ${msg.content}`).join("\n");

    let aiResponse = await generateContent([prompt]);

    // Check if the user is asking for dealers
    if (userReply.toLowerCase().includes("dealer") || userReply.toLowerCase().includes("find dealer")) {
      const product = extractProduct(userReply); // Function to extract product name
      if (product && latitude && longitude) {
        try {
          const dealerResponse = await axios.post(DEALER_API_URL, {
            product,
            latitude,
            longitude,
          });
          const dealers = dealerResponse.data.dealers;

          if (dealers.length > 0) {
            aiResponse += "\nHere are some nearby dealers:\n";
            dealers.forEach((dealer: any, index: number) => {
              aiResponse += `${index + 1}. ${dealer.name}, 📍 ${dealer.address}, 📞 ${dealer.phone}\n`;
            });
          } else {
            aiResponse += "\nSorry, no dealers found nearby.";
          }
        } catch (error) {
          console.error("Dealer API Error:", error);
          aiResponse += "\nSorry, I couldn't fetch dealer information at the moment.";
        }
      } else {
        aiResponse += "\nPlease provide your location (latitude and longitude) to find nearby dealers.";
      }
    }

    // Save AI Response to DB
    const botMessage = await prisma.message.create({
      data: { sessionId, role: "bot", content: aiResponse },
    });

    res.status(200).json({ message: botMessage.content });
  } catch (error: any) {
    console.error("Error:", error.message);
    res.status(500).json({ message: "Something went wrong" });
  }
};

// Helper function to extract product name from the user query
function extractProduct(query: string): string | null {
  const keywords = ["dealer", "find", "need"]
  let words = query.split(" ");

  for (let i = 0; i < words.length; i++) {
    if (keywords.includes(words[i].toLowerCase()) && i + 1 < words.length) {
      return words[i + 1];
    }
  }
  return null;
}
