
import { GoogleGenAI, Type } from "@google/genai";
import { WordPair } from "../types";

export const generateWordPack = async (): Promise<Omit<WordPair, 'id'>[]> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: "Genera 5 pares de palabras y pistas para el juego 'El Impostor'. " + 
                "La 'palabra' es el objeto secreto. La 'pista' es una descripción vaga pero útil que solo ve el impostor. " +
                "El impostor debe poder fingir que sabe la palabra usando la pista. " +
                "Ejemplo: Palabra: 'Pizza', Pista: 'Comida redonda popular'. " +
                "Evita palabras demasiado complejas. Retorna solo JSON.",
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              word: { type: Type.STRING, description: "La palabra secreta" },
              hint: { type: Type.STRING, description: "La pista para el impostor" }
            },
            required: ["word", "hint"]
          }
        }
      }
    });

    if (response.text) {
        return JSON.parse(response.text) as Omit<WordPair, 'id'>[];
    }
    return [];
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw new Error("No se pudieron generar palabras. Verifica tu conexión o intenta más tarde.");
  }
};

/**
 * Generates an image using the gemini-3-pro-image-preview model.
 * Always creates a new GoogleGenAI instance to ensure the most up-to-date API key is used.
 */
// Added fix for missing generateImageWithGemini export for high-quality image generation tasks
export const generateImageWithGemini = async (
  prompt: string,
  size: '1K' | '2K' | '4K' = '1K',
  ratio: '1:1' | '16:9' | '9:16' = '1:1'
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: {
        parts: [{ text: prompt }],
      },
      config: {
        imageConfig: {
          aspectRatio: ratio,
          imageSize: size,
        },
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("No response candidates available from Gemini.");
    }

    // Iterate through response parts to locate the image part as it may not be the first part
    for (const part of response.candidates[0].content.parts) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }

    throw new Error("The model response did not contain image data.");
  } catch (error: any) {
    console.error("Gemini Image Generation Error:", error);
    
    // Check if the error indicates a billing or project configuration issue (missing entity)
    // as specified in the Veo/Pro model guidelines to trigger an API key re-selection
    if (error.message && error.message.includes("Requested entity was not found")) {
      throw new Error("KEY_NOT_FOUND");
    }
    throw error;
  }
};
