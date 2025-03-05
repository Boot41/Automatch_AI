import { GoogleGenerativeAI } from "@google/generative-ai";
import { GEMINI_API_KEY } from "../secrets"; // Use from .env

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY!);

export async function generateContent(conversation: string[]) {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

    let prompt = `${conversation.join("\n")}\n`;

    if (conversation.length >= 4) {
      prompt += `Now, based on the information provided, recommend exactly three products with:

1. Product Name - Price Range
   Features: Feature 1, Feature 2, Feature 3

2. Product Name - Price Range
   Features: Feature 1, Feature 2, Feature 3

3. Product Name - Price Range
   Features: Feature 1, Feature 2, Feature 3

Reply only with the product recommendations. No further questions.`;
    } else {
      prompt += `Ask only one **essential** question to finalize the recommendation if needed.`;
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