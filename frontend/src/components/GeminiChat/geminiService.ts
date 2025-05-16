import { GoogleGenerativeAI } from "@google/generative-ai";

// Initialize the Gemini API client
const genAI = new GoogleGenerativeAI("AIzaSyAr9OyNOheTeJk-gO3hQyFHbFa66D-iq28");

// Define message structure expected by Gemini
export interface GeminiMessage {
  role: "user" | "model" | string;
  parts: { text: string }[];
}

// Send a message using the Gemini chat model
export const sendGeminiMessage = async (messages: GeminiMessage[]): Promise<string> => {
  try {
    if (!Array.isArray(messages) || messages.length === 0) {
      throw new Error("Message history must start with a valid user message.");
    }

    // Separate history (all messages except the last one) from the new message
    const history = messages.slice(0, -1);
    const newMessage = messages[messages.length - 1]?.parts?.[0]?.text || "";

    if (!newMessage) {
      throw new Error("No new message to send.");
    }

    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const chat = model.startChat({ history: history });
    const result = await chat.sendMessage(newMessage);
    const response = await result.response;
    return response.text();
  } catch (err) {
    console.error("Gemini chat error:", err);
    return "⚠️ AI generation failed.";
  }
};

// Generate a 4-step learning plan as JSON for a given topic
export const generateLearningPlan = async (userTopic: string): Promise<string> => {
  const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

  const prompt = `
  Generate a 4-step learning plan for the topic: "${userTopic}".
  For each step, give:
  - Subtopic name
  - Estimated duration (e.g., 2 days)
  - A YouTube link (should provide me only active and famous video about that section)
  - Mark as completed: false

  Format the entire output as pure JSON (not Markdown, no \`\`\`), like this:
  [
    {
      "subtopic": "Intro to AI",
      "duration": "1 day",
      "resource": "https://example.com",
      "completed": false
    },
    ...
  ]
  `;

  try {
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    // Clean and extract valid JSON
    const cleaned = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .trim();

    return cleaned;
  } catch (err) {
    console.error("Gemini API error:", err);
    return "[]"; // Fallback: return empty array as string
  }
};
