import { GoogleGenAI, Type } from "@google/genai";
import { WordPair } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateWordPack = async (): Promise<Omit<WordPair, 'id'>[]> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
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
