
import { GoogleGenAI, Type } from "@google/genai";

const getAi = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateVerseBackground = async (verseText: string, theme?: string): Promise<string | null> => {
  const ai = getAi();
  const prompt = `Create a beautiful, atmospheric, high-quality cinematic background image for a bible verse about: "${verseText}". 
  Theme: ${theme || 'natural, serene, spiritual'}. 
  The image should be minimalist with plenty of space for text, high contrast, 1080x1350 aspect ratio style. 
  Avoid any text in the image.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: { parts: [{ text: prompt }] },
      config: {
        imageConfig: {
          aspectRatio: "3:4"
        }
      }
    });

    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error) {
    console.error("AI Background Generation Error:", error);
  }
  return null;
};

export interface SuggestedVerse {
  book: string;
  chapter: number;
  verse: number;
  reason: string;
}

export const searchVerseByTopic = async (topic: string): Promise<SuggestedVerse | null> => {
  const ai = getAi();
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Find a powerful and encouraging Bible verse related to the topic: "${topic}". 
      Return only the book name, chapter number, and verse number.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            book: { type: Type.STRING },
            chapter: { type: Type.INTEGER },
            verse: { type: Type.INTEGER },
            reason: { type: Type.STRING, description: "Short explanation why this verse fits the topic" }
          },
          required: ["book", "chapter", "verse", "reason"]
        }
      }
    });

    const result = JSON.parse(response.text);
    return result as SuggestedVerse;
  } catch (error) {
    console.error("AI Verse Search Error:", error);
    return null;
  }
};
