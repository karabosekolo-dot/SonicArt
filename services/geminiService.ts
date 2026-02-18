
import { GoogleGenAI, GenerateContentResponse } from "@google/genai";

export class GeminiService {
  private static getClient() {
    return new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  }

  /**
   * Generates a new image from scratch using gemini-2.5-flash-image
   */
  static async generateImage(prompt: string): Promise<string | null> {
    const ai = this.getClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [{ text: prompt }],
        },
        config: {
          imageConfig: {
            aspectRatio: "1:1"
          }
        }
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image generation failed:", error);
      throw error;
    }
  }

  /**
   * Edits an image using gemini-2.5-flash-image
   */
  static async editImage(base64Image: string, mimeType: string, prompt: string): Promise<string | null> {
    const ai = this.getClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1] || base64Image,
                mimeType: mimeType,
              },
            },
            { text: prompt },
          ],
        },
      });

      for (const part of response.candidates?.[0]?.content?.parts || []) {
        if (part.inlineData) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
      return null;
    } catch (error) {
      console.error("Image editing failed:", error);
      throw error;
    }
  }

  /**
   * Analyzes an image using gemini-3-pro-preview
   */
  static async analyzeImage(base64Image: string, mimeType: string): Promise<string> {
    const ai = this.getClient();
    try {
      const response = await ai.models.generateContent({
        model: 'gemini-3-pro-preview',
        contents: {
          parts: [
            {
              inlineData: {
                data: base64Image.split(',')[1] || base64Image,
                mimeType: mimeType,
              },
            },
            { text: "Analyze this image in detail. Describe its composition, color palette, style, and potential emotional impact. If this were a music album cover, what genre of music would it best suit?" },
          ],
        },
      });
      return response.text || "No analysis generated.";
    } catch (error) {
      console.error("Image analysis failed:", error);
      throw error;
    }
  }
}
