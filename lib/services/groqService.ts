import Groq from "groq-sdk";
import { type Palette } from '../types';

// Securely load Groq API key from environment (.env)
const groqApiKey = "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";

if (!groqApiKey) {
    console.error("Groq API key is missing. Please set GROQ_API_KEY in your .env file.");
}

/**
 * Converts a hex color string to an [R, G, B] array.
 */
export const hexToRgb = (hex: string): [number, number, number] => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
        ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
        : [0, 0, 0];
}

/**
 * Generates color palettes from a text prompt using Groq API.
 */
export const generatePalettesFromText = async (prompt: string): Promise<Palette[]> => {
    if (!groqApiKey) {
        throw new Error("Groq API key is missing. Set GROQ_API_KEY in your .env file.");
    }

    const groq = new Groq({
        apiKey: groqApiKey,
        dangerouslyAllowBrowser: true // Allow browser usage as requested
    });

    try {
        const response = await groq.chat.completions.create({
            messages: [
                {
                    role: "system",
                    content: "You are an expert color palette generator. Create a single, aesthetically pleasing, and accessible color palette that is relevant to the user's text prompt. Return ONLY a valid JSON object (not array) with this exact structure: {\"paletteName\": \"string\", \"colors\": [{\"role\": \"string\", \"hex\": \"#RRGGBB\", \"rgb\": [r,g,b], \"description\": \"string\"}]}. Do not include any markdown formatting or additional text."
                },
                {
                    role: "user",
                    content: `Generate one color palette based on this theme: "${prompt}". Return only the JSON object, no other text.`
                }
            ],
            model: "llama-3.1-8b-instant",
            temperature: 0.7,
            max_tokens: 1000
        });

        const jsonString = response.choices[0]?.message?.content;
        if (!jsonString) {
            throw new Error('Received an empty response from the AI.');
        }

        console.log('Raw Groq response:', jsonString);

        let parsedData: any;
        try {
            // Clean the response to extract JSON
            const cleanedJson = jsonString.replace(/```json\n?/g, '').replace(/```\n?/g, '').trim();
            parsedData = JSON.parse(cleanedJson);
        } catch (e) {
            console.error("Failed to parse JSON response:", jsonString);
            throw new Error('Failed to parse the palette from the AI response. The format was invalid.');
        }

        // Ensure we have an array of palettes
        let parsedPalettes: Palette[];
        if (Array.isArray(parsedData)) {
            parsedPalettes = parsedData;
        } else if (parsedData && typeof parsedData === 'object') {
            // If it's a single palette object, wrap it in an array
            parsedPalettes = [parsedData];
        } else {
            throw new Error('Invalid response format: expected an array or object');
        }

        // Data validation and sanitization
        const validatedPalettes = parsedPalettes.map((p: any) => {
            if (!p || typeof p !== 'object') {
                throw new Error('Invalid palette object structure');
            }
            
            if (!p.paletteName || typeof p.paletteName !== 'string') {
                p.paletteName = 'Generated Palette';
            }
            
            if (!Array.isArray(p.colors)) {
                throw new Error('Palette colors must be an array');
            }
            
            return {
                paletteName: p.paletteName,
                colors: p.colors.map((c: any) => {
                    if (!c || !c.hex || !c.role) {
                        throw new Error('Invalid color object structure');
                    }
                    return {
                        role: c.role,
                        hex: c.hex,
                        rgb: hexToRgb(c.hex),
                        description: c.description || `${c.role} color`
                    };
                })
            };
        });

        return validatedPalettes;

    } catch (error: any) {
        console.error('Groq API Error (from text prompt):', error);
        // Fallback: Generate a simple palette if Groq fails
        console.log('Falling back to simple palette generation...');
        const fallbackPalette: Palette = {
            paletteName: `Fallback Palette for "${prompt}"`,
            colors: [
                { role: 'Primary', hex: '#3B82F6', rgb: [59, 130, 246], description: 'Primary blue color' },
                { role: 'Secondary', hex: '#10B981', rgb: [16, 185, 129], description: 'Secondary green color' },
                { role: 'Accent', hex: '#F59E0B', rgb: [245, 158, 11], description: 'Accent orange color' },
                { role: 'Background', hex: '#F9FAFB', rgb: [249, 250, 251], description: 'Light background color' },
                { role: 'Text', hex: '#111827', rgb: [17, 24, 39], description: 'Dark text color' }
            ]
        };
        if (error.message && error.message.includes('API key')) {
            throw new Error('Your Groq API key is invalid. Please check the GROQ_API_KEY environment variable.');
        }
        // Return fallback palette instead of throwing error
        console.warn('Using fallback palette due to API error:', error.message);
        return [fallbackPalette];
    }
};
