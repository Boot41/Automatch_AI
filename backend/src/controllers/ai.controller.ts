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

    // Check if the user is asking for dealers
    const isDealerRequest = userReply.toLowerCase().includes("dealer") || 
                          userReply.toLowerCase().includes("find dealer") ||
                          userReply.toLowerCase().includes("nearby") ||
                          userReply.toLowerCase().includes("store");

    // Handle dealer search request
    if (userReply.toLowerCase().includes('find dealers') || userReply.toLowerCase().includes('dealers near me')) {
      const productName = extractProduct(previousMessages);
      
      if (productName) {
        try {
          // Get user location (would normally come from frontend)
          const location = "New Delhi"; // Default location
          
          // Call dealer service
          const dealerResponse = await axios.post(
            'http://localhost:3000/api/v1/dealers/search',
            { location, productName },
            { headers: { Authorization: req.headers.authorization } }
          );
          
          const dealerData = {
            type: 'dealer',
            message: `Here are some dealers for ${productName} near ${location}`,
            dealers: dealerResponse.data.data || []
          };
          
          // Save dealer response as JSON string
          await prisma.message.create({
            data: { 
              sessionId: Number(sessionId), 
              role: "bot", 
              content: JSON.stringify(dealerData)
            },
          });
          
          return res.status(200).json(dealerData);
        } catch (error) {
          console.error('Dealer search error:', error);
          // Continue with normal AI response if dealer search fails
        }
      }
    }

    // Format messages for the AI prompt
    const prompt = previousMessages.map((msg) => `${msg.role}: ${msg.content}`).join("\n");
    
    // If it's a dealer request, handle it differently
    if (isDealerRequest) {
      // Extract product from conversation history
      const product = extractProduct(previousMessages);
      
      if (product) {
        try {
          // Use default coordinates if not provided
          const userLat = latitude || 12.9715; // Default to Bangalore
          const userLng = longitude || 77.5945;
          
          // Include authentication token in the dealer API request
          const dealerResponse = await axios.post(DEALER_API_URL, {
            product,
            latitude: userLat,
            longitude: userLng,
          }, {
            headers: {
              Authorization: `Bearer ${(req as any).token}` // Use the token from the request
            }
          });
          
          const dealers = dealerResponse.data.dealers;
          let dealerResponseMessage = "";
          
          if (dealers && dealers.length > 0) {
            dealerResponseMessage = `Here are some dealers near you that sell **${product}**:

`;
            
            // Format dealer information in a more structured way
            dealers.forEach((dealer: any, index: number) => {
              dealerResponseMessage += `**${index + 1}. ${dealer.name}**
`;
              dealerResponseMessage += `📍 ${dealer.address}
`;
              if (dealer.phone) dealerResponseMessage += `📞 ${dealer.phone}
`;
              if (dealer.rating) dealerResponseMessage += `⭐ Rating: ${dealer.rating}
`;
              dealerResponseMessage += `
`;
            });
          } else {
            dealerResponseMessage = `I couldn't find any dealers for **${product}** near your location. Would you like to try a different product or expand your search area?`;
          }
          
          // Save dealer response to DB
          const botMessage = await prisma.message.create({
            data: { sessionId, role: "bot", content: dealerResponseMessage },
          });
          
          return res.status(200).json({ 
            message: botMessage.content,
            dealers: dealers || [] 
          });
        } catch (error) {
          console.error("Dealer API Error:", error);
          const errorMessage = `Sorry, I couldn't fetch dealer information for ${product} at the moment. Please try again later.`;
          
          const botMessage = await prisma.message.create({
            data: { sessionId, role: "bot", content: errorMessage },
          });
          
          return res.status(200).json({ message: botMessage.content });
        }
      } else {
        const noProductMessage = "I'm not sure which product you're looking for dealers of. Could you please specify the product name or choose one from my recommendations?"; 
        
        const botMessage = await prisma.message.create({
          data: { sessionId, role: "bot", content: noProductMessage },
        });
        
        return res.status(200).json({ message: botMessage.content });
      }
    }
    
    // Normal conversation flow (not dealer request)
    let aiResponse = await generateContent([prompt]);

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

// Save dealer message
export const saveDealerMessage = async (req: Request, res: Response) => {
  try {
    const { sessionId, userMessage, dealerData } = req.body;
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

    // Save user message if provided
    if (userMessage) {
      await prisma.message.create({
        data: { sessionId: Number(sessionId), role: "user", content: userMessage },
      });
    }

    // Save dealer message
    await prisma.message.create({
      data: { 
        sessionId: Number(sessionId), 
        role: "bot", 
        content: JSON.stringify(dealerData)
      },
    });

    return res.status(200).json({ success: true });
  } catch (error: any) {
    console.error("Save Dealer Message Error:", error.message);
    return res.status(500).json({ message: "Internal Server Error" });
  }
};

// Helper function to extract product name from the conversation
function extractProduct(messages: any[]): string | null {
  // First try to find product in a recommendation message
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === 'bot') {
      // Look for product names in recommendations
      const content = msg.content;
      
      // Try to extract product names from structured recommendations
      const productMatches = content.match(/\*\*([^*]+)\*\*/g);
      if (productMatches && productMatches.length > 0) {
        // Return the first product name without the ** markers
        return productMatches[0].replace(/\*\*/g, '').trim();
      }
    }
  }
  
  // If no product found in recommendations, try to extract from user messages
  for (let i = messages.length - 1; i >= 0; i--) {
    const msg = messages[i];
    if (msg.role === 'user') {
      const userMessage = msg.content.toLowerCase();
      
      // Check for explicit mentions of products
      const productKeywords = [
        'iphone', 'samsung', 'galaxy', 'pixel', 'oneplus', 'xiaomi', 'redmi', 'oppo', 'vivo',
        'macbook', 'dell', 'hp', 'lenovo', 'asus', 'acer', 'surface',
        'sony', 'lg', 'panasonic', 'tcl', 'hisense',
        'tata', 'hyundai', 'maruti', 'honda', 'toyota', 'kia', 'mahindra',
        'royal enfield', 'bajaj', 'tvs', 'yamaha', 'hero'
      ];
      
      for (const keyword of productKeywords) {
        if (userMessage.includes(keyword)) {
          return keyword;
        }
      }
      
      // Check for product categories
      const categoryKeywords = [
        'phone', 'smartphone', 'mobile',
        'laptop', 'computer', 'pc',
        'tv', 'television', 'monitor',
        'camera', 'headphone', 'earphone', 'speaker',
        'car', 'bike', 'motorcycle'
      ];
      
      for (const keyword of categoryKeywords) {
        if (userMessage.includes(keyword)) {
          return keyword;
        }
      }
    }
  }
  
  return null;
}
