import { GoogleGenAI, Type } from "@google/genai";
import { type Palette } from '../types';

// Helper function to convert a File object to a base64 string
const fileToGenerativePart = (file: File): Promise<{mimeType: string, data: string}> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64Data = (reader.result as string).split(',')[1];
      if (base64Data) {
        resolve({
          mimeType: file.type,
          data: base64Data,
        });
      } else {
        reject(new Error("Failed to read file as base64."));
      }
    };
    reader.onerror = (error) => reject(error);
    reader.readAsDataURL(file);
  });
};

const paletteSchema = {
    type: Type.OBJECT,
    properties: {
        paletteName: { type: Type.STRING, description: 'A creative name for the palette.' },
        colors: {
            type: Type.ARRAY,
            description: 'An array of 5-6 color objects.',
            items: {
                type: Type.OBJECT,
                properties: {
                    role: { type: Type.STRING, description: 'e.g., "Primary", "Secondary", "Accent", "Background", "Text"' },
                    hex: { type: Type.STRING, description: '7-character hex code, e.g., "#RRGGBB"' },
                    rgb: { 
                        type: Type.ARRAY,
                        description: 'RGB values [0-255]',
                        items: { type: Type.INTEGER }
                    },
                    description: { type: Type.STRING, description: 'A brief description of the color\'s intended use.' },
                },
                required: ['role', 'hex', 'rgb', 'description']
            }
        }
    },
    required: ['paletteName', 'colors']
};

/**
 * Converts a hex color string to an [R, G, B] array.
 */
export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
};

export const generatePaletteFromImageAndText = async (prompt: string, imageFile: File): Promise<Palette[]> => {
    const ai = new GoogleGenAI(process.env.NEXT_PUBLIC_API_KEY || '');

    try {
        const imagePart = await fileToGenerativePart(imageFile);
        const model = ai.getGenerativeModel({ 
            model: "gemini-1.5-flash",
            generationConfig: {
                responseMimeType: "application/json",
                responseSchema: {
                    type: Type.ARRAY,
                    items: paletteSchema,
                },
            },
            systemInstruction: "You are an expert color palette generator. Create a single, aesthetically pleasing, and accessible color palette that is relevant to the user's image and text prompt. The final output must be a JSON array containing exactly one palette object."
        });
        
        const response = await model.generateContent([
            { inlineData: imagePart },
            `Analyze the attached image and consider the following theme: "${prompt}". Generate one color palette based on this combination.`
        ]);

        // FIX: Get text directly from `response.text` as per guidelines.
        const jsonString = response.text;
        if (!jsonString) {
            throw new Error('Received an empty response from the AI.');
        }

        let parsedPalettes: Palette[];
        try {
            parsedPalettes = JSON.parse(jsonString);
        } catch (e) {
            console.error("Failed to parse JSON response:", jsonString);
            throw new Error('Failed to parse the palette from the AI response. The format was invalid.');
        }

        // Data validation and sanitization
        return parsedPalettes.map((p: any) => ({
            ...p,
            colors: p.colors.map((c: any) => ({
                ...c,
                rgb: hexToRgb(c.hex) // Ensure RGB is correct based on hex
            }))
        }));

    } catch (error: any) {
        console.error('Gemini API Error:', error);
        // FIX: Updated error message to reflect API key is from environment variables.
        if (error.message.includes('API key not valid')) {
            throw new Error('Your Google Gemini API key is invalid. Please check the NEXT_PUBLIC_API_KEY environment variable.');
        }
        throw new Error(`Failed to generate palette with Gemini: ${error.message || 'An unknown error occurred'}`);
    }
};
