import ColorThief from 'colorthief';
import { type Palette } from '../types';

/**
 * Converts an RGB color array to a hex string.
 */
const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => {
    const clamped = Math.max(0, Math.min(255, Math.round(c)));
    const hex = clamped.toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Extracts a color palette from an image file using the ColorThief library.
 * This function runs entirely in the browser and does not make any API calls.
 */
export const generatePalettesFromImage = (imageFile: File): Promise<Palette[]> => {
  return new Promise((resolve, reject) => {
    const img = document.createElement('img');
    const objectUrl = URL.createObjectURL(imageFile);
    img.src = objectUrl;

    img.onload = () => {
      try {
        const colorThief = new ColorThief();
        // Extract a palette of 6 colors.
        const paletteRgb = colorThief.getPalette(img, 6);

        if (!paletteRgb) {
          throw new Error('Could not extract palette from the image.');
        }

        const palette: Palette = {
          paletteName: `Palette from ${imageFile.name}`,
          colors: paletteRgb.map((rgb, index) => {
            const [r, g, b] = rgb;
            return {
              role: index === 0 ? 'Primary' : index === 1 ? 'Secondary' : index === 2 ? 'Accent' : `Color ${index - 2}`,
              hex: rgbToHex(r, g, b),
              rgb: [r, g, b],
              description: `A prominent color from the image.`
            };
          })
        };
        
        // The app expects an array of palettes, so we wrap our single palette in an array.
        resolve([palette]);

      } catch (error) {
        reject(error);
      } finally {
        // Clean up the object URL to avoid memory leaks.
        URL.revokeObjectURL(objectUrl);
      }
    };

    img.onerror = (err) => {
      URL.revokeObjectURL(objectUrl);
      reject(new Error(`Failed to load image: ${err.toString()}`));
    };
  });
};
