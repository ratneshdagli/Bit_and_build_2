import { type ColorData } from '../types';
import { calculateContrastRatio } from './accessibilityService';

/**
 * Adjusts the lightness of a color to meet contrast requirements
 */
export const adjustColorForContrast = (
  textColor: ColorData, 
  bgColor: ColorData, 
  targetRatio: number = 4.5
): { textColor: ColorData; bgColor: ColorData } => {
  // Convert RGB to HSL for easier lightness adjustment
  const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
    r /= 255;
    g /= 255;
    b /= 255;
    
    const max = Math.max(r, g, b);
    const min = Math.min(r, g, b);
    let h = 0, s = 0, l = (max + min) / 2;

    if (max !== min) {
      const d = max - min;
      s = l > 0.5 ? d / (2 - max - min) : d / (max + min);
      
      switch (max) {
        case r: h = (g - b) / d + (g < b ? 6 : 0); break;
        case g: h = (b - r) / d + 2; break;
        case b: h = (r - g) / d + 4; break;
      }
      h /= 6;
    }

    return [h * 360, s * 100, l * 100];
  };

  const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
    h /= 360;
    s /= 100;
    l /= 100;

    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1/6) return p + (q - p) * 6 * t;
      if (t < 1/2) return q;
      if (t < 2/3) return p + (q - p) * (2/3 - t) * 6;
      return p;
    };

    let r, g, b;

    if (s === 0) {
      r = g = b = l;
    } else {
      const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
      const p = 2 * l - q;
      r = hue2rgb(p, q, h + 1/3);
      g = hue2rgb(p, q, h);
      b = hue2rgb(p, q, h - 1/3);
    }

    return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
  };

  const rgbToHex = (r: number, g: number, b: number): string => {
    const toHex = (c: number) => {
      const hex = Math.round(c).toString(16);
      return hex.length === 1 ? '0' + hex : hex;
    };
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
  };

  // Get current contrast ratio
  let currentRatio = calculateContrastRatio(textColor.rgb, bgColor.rgb);
  
  if (currentRatio >= targetRatio) {
    return { textColor, bgColor }; // Already meets requirements
  }

  // Determine which color to adjust (usually the text color)
  const [textH, textS, textL] = rgbToHsl(textColor.rgb[0], textColor.rgb[1], textColor.rgb[2]);
  const [bgH, bgS, bgL] = rgbToHsl(bgColor.rgb[0], bgColor.rgb[1], bgColor.rgb[2]);

  let adjustedTextColor = { ...textColor };
  let adjustedBgColor = { ...bgColor };

  // Try adjusting text color first (make it darker or lighter)
  let newTextL = textL;
  let attempts = 0;
  const maxAttempts = 20;

  while (currentRatio < targetRatio && attempts < maxAttempts) {
    attempts++;
    
    // If background is light, make text darker; if background is dark, make text lighter
    if (bgL > 50) {
      newTextL = Math.max(5, newTextL - 5); // Make text darker
    } else {
      newTextL = Math.min(95, newTextL + 5); // Make text lighter
    }

    const [newR, newG, newB] = hslToRgb(textH, textS, newTextL);
    const newHex = rgbToHex(newR, newG, newB);
    
    adjustedTextColor = {
      ...textColor,
      hex: newHex,
      rgb: [newR, newG, newB]
    };

    currentRatio = calculateContrastRatio(adjustedTextColor.rgb, bgColor.rgb);
  }

  // If still not enough contrast, try adjusting background color
  if (currentRatio < targetRatio) {
    let newBgL = bgL;
    attempts = 0;

    while (currentRatio < targetRatio && attempts < maxAttempts) {
      attempts++;
      
      // If text is light, make background darker; if text is dark, make background lighter
      if (textL > 50) {
        newBgL = Math.max(5, newBgL - 5); // Make background darker
      } else {
        newBgL = Math.min(95, newBgL + 5); // Make background lighter
      }

      const [newR, newG, newB] = hslToRgb(bgH, bgS, newBgL);
      const newHex = rgbToHex(newR, newG, newB);
      
      adjustedBgColor = {
        ...bgColor,
        hex: newHex,
        rgb: [newR, newG, newB]
      };

      currentRatio = calculateContrastRatio(adjustedTextColor.rgb, adjustedBgColor.rgb);
    }
  }

  return { textColor: adjustedTextColor, bgColor: adjustedBgColor };
};
