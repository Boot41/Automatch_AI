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
Be concise, friendly, and professional while maintaining context throughout the conversation.

### IMPORTANT RULES:
1. **Memory & Context Awareness**:
   - NEVER repeat questions if the user has already provided the information.
   - If the user gives a budget, don't ask for it again.
   - If the user mentions a product category, don't ask about it again.
   - Always acknowledge the user's previous answers.
   - If the user asks to compare two or more products, do so with key specifications.

2. **Conversation Flow**:
   - Ask AT MOST 5 questions before making recommendations. Fewer questions are better.
   - If the user has answered 3 or more essential questions, provide recommendations immediately.
   - If you don't have enough details after 2 questions, make an educated guess and recommend.

3. **Comparison Requests**:
   - If the user mentions two or more product names and asks for a comparison, compare them with key features like price, specs, and pros/cons.
   - Use structured bullet points for comparison.
   - End the comparison with: "Would you like recommendations based on these comparisons?"

4. **Product Recommendations**:
   - Always recommend exactly **THREE** products.
   - Format recommendations in a structured way with bullet points.
   - Include accurate pricing for the Indian market.
   - Provide links to Amazon and Flipkart if available.

### PRODUCT RECOMMENDATION FORMAT:

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

5. **Dealer Inquiry**:
   - Always end recommendations with:  
     "Would you like to find dealers near you for any of these products?"

### HANDLING DIFFERENT CASES:
1. **First message**: Ask the user what product they are looking for. Be brief and friendly.
2. **User provides a product category**: Acknowledge it and ask about their budget if not mentioned.
3. **User provides budget**: Acknowledge and ask about key preferences (brand, features, etc.).
4. **User asks for a comparison**: Provide a structured comparison with clear pros/cons.
5. **User has answered enough questions**: Provide recommendations immediately.
6. **User is vague or unsure**: Ask for their general preferences and make an informed recommendation.

Now, generate a response based on the following conversation history:  
\n\nConversation history:\n${conversation.join("\n")}\n\n`;


    
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