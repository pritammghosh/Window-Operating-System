import { GoogleGenAI } from "@google/genai";

const apiKey = process.env.API_KEY || '';

// Safely initialize client only when called to avoid init errors if key is missing during render
const getClient = () => new GoogleGenAI({ apiKey });

export const enhanceText = async (text: string): Promise<string> => {
  if (!text.trim()) return "";
  
  try {
    const ai = getClient();
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview', // Good balance of speed and reasoning for text
      contents: `
        You are a professional editor. Rewrite the following text to improve originality, 
        tone, and clarity while preserving the core meaning. 
        Do not explain your changes, just provide the rewritten text.
        
        Text to rewrite:
        "${text}"
      `,
      config: {
        systemInstruction: "You are a helpful writing assistant for a premium OS.",
      }
    });

    return response.text || "Could not generate text.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Error: Unable to connect to AI service. Please check your API key.";
  }
};

export const chatWithGemini = async (history: { role: string, parts: { text: string }[] }[], newMessage: string): Promise<string> => {
  if (!newMessage.trim()) return "";

  try {
    const ai = getClient();
    const chat = ai.chats.create({
      model: 'gemini-3-pro-preview',
      history: history,
      config: {
        systemInstruction: "You are TOS AI, an intelligent, concise, and helpful assistant embedded within a web-based operating system. Your goal is to provide accurate and useful information to the user.",
      }
    });

    const result = await chat.sendMessage({ message: newMessage });
    return result.text || "";
  } catch (error) {
    console.error("Gemini Chat Error:", error);
    return "I apologize, but I am unable to connect to the network at this moment.";
  }
};