import { GoogleGenAI, Type } from "@google/genai";
import { WordPair } from "../types";

/**
 * Generates a pack of word pairs for the "Impostor" game using Gemini 3 Flash.
 * This model is ideal for basic text tasks like this.
 */
export const generateWordPack = async (): Promise<Omit<WordPair, 'id'>[]> => {
  // Always initialize with the current environment key right before making a call
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Genera 5 pares de palabras y pistas para el juego 'El Impostor'. " + 
                "La 'palabra' es el objeto secreto. La 'pista' debe ser OBLIGATORIAMENTE UNA SOLA PALABRA. " +
                "La pista es una descripción vaga que solo ve el impostor para poder fingir. " +
                "Ejemplo: Palabra: 'Pizza', Pista: 'Comida'. " +
                "Evita palabras demasiado complejas. Retorna solo JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING, description: "La palabra secreta" },
              hint: { type: Type.STRING, description: "La pista para el impostor (una sola palabra)" }
            },
            required: ["word", "hint"]
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text.trim()) as Omit<WordPair, 'id'>[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("No se pudieron generar palabras. Verifica tu conexión o intenta más tarde.");
  }
};

/**
 * Generates an image using Gemini 3 Pro Image Preview.
 * Follows guidelines for high-quality image generation and API key management.
 */
export const generateImageWithGemini = async (
  prompt: string,
  imageSize: '1K' | '2K' | '4K' = '1K',
  aspectRatio: '1:1' | '16:9' | '9:16' = '1:1'
): Promise<string> => {
  // Create a new GoogleGenAI instance right before making an API call to ensure it always uses the most up-to-date API key.
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [
          {
            text: prompt,
          },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: aspectRatio,
          imageSize: imageSize
        }
      },
    });

    // The output response may contain both image and text parts; iterate to find the image part.
    if (response.candidates && response.candidates[0] && response.candidates[0].content.parts) {
      for (const part of response.candidates[0].content.parts) {
        if (part.inlineData) {
          const base64EncodeString: string = part.inlineData.data;
          return `data:image/png;base64,${base64EncodeString}`;
        }
      }
    }
    
    throw new Error("No se encontró ninguna imagen en la respuesta de la IA.");
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    
    // If the request fails with "Requested entity was not found.", reset key selection and prompt again via component logic.
    if (error.message?.includes("Requested entity was not found")) {
      throw new Error("KEY_NOT_FOUND");
    }
    
    throw error;
  }
};