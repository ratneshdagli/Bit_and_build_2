import { type Palette } from '../types';

/**
 * Encodes a palette to a URL-safe string
 */
export const encodePaletteToUrl = (palette: Palette): string => {
  const paletteData = {
    name: palette.paletteName,
    colors: palette.colors.map(color => ({
      role: color.role,
      hex: color.hex,
      description: color.description
    }))
  };

  // Convert to base64 and make URL-safe
  const jsonString = JSON.stringify(paletteData);
  const base64 = btoa(unescape(encodeURIComponent(jsonString)));
  return base64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
};

/**
 * Decodes a URL-safe string back to a palette
 */
export const decodePaletteFromUrl = (encodedString: string): Palette | null => {
  try {
    // Restore base64 padding and convert back
    let base64 = encodedString.replace(/-/g, '+').replace(/_/g, '/');
    while (base64.length % 4) {
      base64 += '=';
    }

    const jsonString = decodeURIComponent(escape(atob(base64)));
    const paletteData = JSON.parse(jsonString);

    // Convert back to full palette format with RGB values
    const colors = paletteData.colors.map((color: any) => {
      const rgb = hexToRgb(color.hex);
      return {
        role: color.role,
        hex: color.hex,
        rgb: rgb,
        description: color.description,
        locked: false
      };
    });

    return {
      paletteName: paletteData.name,
      colors: colors
    };
  } catch (error) {
    console.error('Failed to decode palette from URL:', error);
    return null;
  }
};

/**
 * Converts hex to RGB
 */
const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
};

/**
 * Generates a shareable URL for a palette
 */
export const generateShareableUrl = (palette: Palette, baseUrl: string = window.location.origin): string => {
  const encoded = encodePaletteToUrl(palette);
  return `${baseUrl}/demo?palette=${encoded}`;
};

/**
 * Extracts palette from URL parameters
 */
export const getPaletteFromUrl = (): Palette | null => {
  if (typeof window === 'undefined') return null;
  
  const urlParams = new URLSearchParams(window.location.search);
  const paletteParam = urlParams.get('palette');
  
  if (!paletteParam) return null;
  
  return decodePaletteFromUrl(paletteParam);
};

/**
 * Updates the URL with a palette without causing a page reload
 */
export const updateUrlWithPalette = (palette: Palette): void => {
  if (typeof window === 'undefined') return;
  
  const encoded = encodePaletteToUrl(palette);
  const url = new URL(window.location.href);
  url.searchParams.set('palette', encoded);
  
  // Use history.replaceState to update URL without reload
  window.history.replaceState({}, '', url.toString());
};

/**
 * Clears palette from URL
 */
export const clearPaletteFromUrl = (): void => {
  if (typeof window === 'undefined') return;
  
  const url = new URL(window.location.href);
  url.searchParams.delete('palette');
  
  window.history.replaceState({}, '', url.toString());
};
