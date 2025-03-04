import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../secrets"; // Use from .env

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

export async function generateContent(conversation: string[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `${conversation.join("\n")}\n`;

    if (conversation.length >= 5) {
      prompt += `Based on the information provided, recommend exactly three products from the category with their name, price range, and top 3 features in a structured format like this:

1. Product Name - Price Range
   Features: Feature 1, Feature 2, Feature 3

2. Product Name - Price Range
   Features: Feature 1, Feature 2, Feature 3

3. Product Name - Price Range
   Features: Feature 1, Feature 2, Feature 3`;
    } else {
      prompt += `Ask only one more simple question if needed, otherwise provide the best recommendation possible.`;
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
