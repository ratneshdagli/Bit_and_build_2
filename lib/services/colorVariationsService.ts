import { type ColorData } from '../types';

/**
 * Converts RGB to HSL
 */
export const rgbToHsl = (r: number, g: number, b: number): [number, number, number] => {
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

/**
 * Converts HSL to RGB
 */
export const hslToRgb = (h: number, s: number, l: number): [number, number, number] => {
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
    r = g = b = l; // achromatic
  } else {
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1/3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1/3);
  }

  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
};

/**
 * Converts RGB to hex
 */
export const rgbToHex = (r: number, g: number, b: number): string => {
  const toHex = (c: number) => {
    const hex = Math.round(c).toString(16);
    return hex.length === 1 ? '0' + hex : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

/**
 * Generates tints and shades for a color
 */
export const generateTintsAndShades = (color: ColorData, steps: number = 5): ColorData[] => {
  const [h, s, l] = rgbToHsl(color.rgb[0], color.rgb[1], color.rgb[2]);
  const variations: ColorData[] = [];

  // Generate tints (lighter)
  for (let i = steps; i > 0; i--) {
    const newLightness = Math.min(95, l + (i * 8)); // Increase lightness by 8% per step
    const [r, g, b] = hslToRgb(h, s, newLightness);
    const hex = rgbToHex(r, g, b);
    
    variations.push({
      role: `${color.role} Tint ${i}`,
      hex,
      rgb: [r, g, b],
      description: `Lighter variation of ${color.role}`,
      locked: false
    });
  }

  // Add original color
  variations.push({
    ...color,
    role: `${color.role} (Original)`,
    locked: false
  });

  // Generate shades (darker)
  for (let i = 1; i <= steps; i++) {
    const newLightness = Math.max(5, l - (i * 8)); // Decrease lightness by 8% per step
    const [r, g, b] = hslToRgb(h, s, newLightness);
    const hex = rgbToHex(r, g, b);
    
    variations.push({
      role: `${color.role} Shade ${i}`,
      hex,
      rgb: [r, g, b],
      description: `Darker variation of ${color.role}`,
      locked: false
    });
  }

  return variations;
};
