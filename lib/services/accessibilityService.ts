import { ColorBlindnessType, type WCAGCompliance } from '../types';

/**
 * Converts a hex color string to an [R, G, B] array.
 */
export const hexToRgb = (hex: string): [number, number, number] => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
};

/**
 * Calculates the relative luminance of an RGB color.
 */
const getLuminance = (rgb: [number, number, number]): number => {
  const [r, g, b] = rgb.map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
};

/**
 * Calculates the contrast ratio between two RGB colors.
 */
export const calculateContrastRatio = (rgb1: [number, number, number], rgb2: [number, number, number]): number => {
  const lum1 = getLuminance(rgb1);
  const lum2 = getLuminance(rgb2);
  const lighter = Math.max(lum1, lum2);
  const darker = Math.min(lum1, lum2);
  return (lighter + 0.05) / (darker + 0.05);
};

/**
 * Checks WCAG compliance for a given contrast ratio.
 */
export const checkWcagCompliance = (ratio: number): { normal: WCAGCompliance; large: WCAGCompliance } => ({
  normal: {
    aa: ratio >= 4.5,
    aaa: ratio >= 7,
  },
  large: {
    aa: ratio >= 3,
    aaa: ratio >= 4.5,
  },
});

/**
 * Converts an RGB color to a hex string.
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
 * Simulates color blindness for a given RGB color.
 */
export const simulateColorBlindness = (rgb: [number, number, number], type: ColorBlindnessType): string => {
  if (type === ColorBlindnessType.NORMAL) {
    return rgbToHex(rgb[0], rgb[1], rgb[2]);
  }

  const [r, g, b] = rgb;
  let sr: number, sg: number, sb: number;

  switch (type) {
    case ColorBlindnessType.PROTANOPIA: // reds are weak
      sr = 0.567 * r + 0.433 * g + 0 * b;
      sg = 0.558 * r + 0.442 * g + 0 * b;
      sb = 0 * r + 0.242 * g + 0.758 * b;
      break;
    case ColorBlindnessType.DEUTERANOPIA: // greens are weak
      sr = 0.625 * r + 0.375 * g + 0 * b;
      sg = 0.7 * r + 0.3 * g + 0 * b;
      sb = 0 * r + 0.3 * g + 0.7 * b;
      break;
    case ColorBlindnessType.TRITANOPIA: // blues are weak
      sr = 0.95 * r + 0.05 * g + 0 * b;
      sg = 0 * r + 0.433 * g + 0.567 * b;
      sb = 0 * r + 0.475 * g + 0.525 * b;
      break;
    case ColorBlindnessType.ACHROMATOPSIA: // total color blindness
      const gray = 0.299 * r + 0.587 * g + 0.114 * b;
      sr = sg = sb = gray;
      break;
    default:
      [sr, sg, sb] = [r, g, b];
  }

  return rgbToHex(sr, sg, sb);
};
