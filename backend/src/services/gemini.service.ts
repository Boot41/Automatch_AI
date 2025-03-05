import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../secrets";

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

// Define key product categories
const PRODUCT_CATEGORIES = [
  "smartphone", "mobile", "phone", 
  "laptop", "computer", 
  "tv", "television", 
  "car", "bike", "motorcycle",
  "headphone", "earphone", "earbuds",
  "camera", "smartwatch", "tablet"
];

// Function to detect product category from user messages
function detectProductCategory(conversation: string[]): string | null {
  const userMessages = conversation
    .filter(msg => msg.startsWith('user:'))
    .map(msg => msg.replace('user:', '').toLowerCase().trim());
  
  // Check most recent messages first
  for (let i = userMessages.length - 1; i >= 0; i--) {
    const message = userMessages[i];
    for (const category of PRODUCT_CATEGORIES) {
      if (message.includes(category)) {
        return category;
      }
    }
  }
  return null;
}

// Count how many questions the bot has asked
function countBotQuestions(conversation: string[]): number {
  return conversation
    .filter(msg => msg.startsWith('bot:'))
    .filter(msg => msg.includes('?'))
    .length;
}

// Check if user has mentioned budget
function hasBudgetInfo(conversation: string[]): boolean {
  return conversation
    .filter(msg => msg.startsWith('user:'))
    .some(msg => {
      const content = msg.toLowerCase();
      return content.includes('budget') || 
             content.includes('₹') || 
             content.includes('rs') || 
             content.includes('rupees') || 
             content.includes('k') || 
             /\d+/.test(content); // Has numbers
    });
}

export async function generateContent(conversation: string[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    // Detect product category
    const category = detectProductCategory(conversation);
    
    // Count how many questions have been asked
    const questionCount = countBotQuestions(conversation);
    
    // Check if budget has been mentioned
    const hasBudget = hasBudgetInfo(conversation);
    
    // System prompt that defines the chatbot's behavior
    const systemPrompt = `You are an expert product recommendation chatbot specializing in consumer electronics and vehicles.
    Your goal is to understand the user's needs and provide personalized product recommendations.
    Be concise, friendly, and professional.
    
    IMPORTANT RULES:
    1. Ask AT MOST 5 questions before making recommendations. Fewer questions is better.
    2. NEVER repeat the same question twice.
    3. Always acknowledge the user's previous answers.
    4. If the user has answered 3 or more questions, provide recommendations immediately.
    5. Format your product recommendations in a structured way with bullet points.
    6. Always end your recommendations with: "Would you like to find dealers near you for any of these products?"
    7. Focus on smartphones, cars, bikes, and electronics as the main product categories.
    8. Provide exactly THREE specific product recommendations with accurate pricing for the Indian market.
    9. Include links to Amazon and Flipkart for each product.
    10. If you don't have enough information after 2 questions, make your best guess for recommendations.
    
    Your product recommendations should follow this format EXACTLY:
    
    1. **[Product Name]** - ₹[Price Range]
       • [Key Feature 1]
       • [Key Feature 2]
       • [Key Feature 3]
       • Amazon: [URL or 'Available on Amazon']
       • Flipkart: [URL or 'Available on Flipkart']
    
    2. **[Product Name]** - ₹[Price Range]
       • [Key Feature 1]
       • [Key Feature 2]
       • [Key Feature 3]
       • Amazon: [URL or 'Available on Amazon']
       • Flipkart: [URL or 'Available on Flipkart']
    
    3. **[Product Name]** - ₹[Price Range]
       • [Key Feature 1]
       • [Key Feature 2]
       • [Key Feature 3]
       • Amazon: [URL or 'Available on Amazon']
       • Flipkart: [URL or 'Available on Flipkart']
    `;
    
    // Combine system prompt with conversation history
    let prompt = systemPrompt + `\n\nConversation history:\n${conversation.join("\n")}\n\n`;
    
    // First message
    if (conversation.length === 1) {
      prompt += `Ask the user what specific product category they're interested in buying. Be brief and friendly.`;
    }
    // If we've asked enough questions or have enough information, provide recommendations
    else if (questionCount >= 2 || (category && hasBudget) || conversation.length >= 5) {
      prompt += `Based on the conversation so far, provide THREE specific product recommendations that match the user's needs. Follow the format specified in the system prompt EXACTLY. Make sure to include the exact formatting with bullet points and proper markdown.`;
    }
    // Otherwise, ask another relevant question
    else {
      if (category) {
        if (!hasBudget) {
          prompt += `The user is interested in a ${category}. Ask about their budget range. Be brief.`;
        } else {
          prompt += `Ask ONE more essential question about their ${category} preferences (like features or brand preference). Be brief.`;
        }
      } else {
        prompt += `Ask the user what specific product they're looking for. Be brief.`;
      }
    }

    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    console.log("AI Response:", responseText);
    return responseText;
  } catch (error: any) {
    console.error("Gemini API Error ❌:", error.message);
    throw new Error("AI Recommendation failed");
  }
}