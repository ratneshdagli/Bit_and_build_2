// Generate a creative name and brand mood description for a palette
export function generatePaletteNameAndMood(colors: ColorData[]): { name: string; mood: string } {
  // Simple heuristics: use color names, brightness, and contrast
  const colorNames = colors.map(c => c.description || c.role).join(', ');
  const avgLuminance = colors.reduce((sum, c) => sum + getLuminance(c.rgb), 0) / colors.length;
  let mood = '';
  if (avgLuminance > 0.7) mood = 'Bright, uplifting, energetic';
  else if (avgLuminance > 0.4) mood = 'Balanced, modern, friendly';
  else mood = 'Bold, dramatic, sophisticated';
  // Name: combine a color and mood word
  const mainColor = colors[0]?.description || colors[0]?.role || 'Palette';
  const name = `${mainColor} ${mood.split(',')[0]}`;
  return { name, mood: `${mood} — ${colorNames}` };
}

import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { calculateContrastRatio, hexToRgb, checkWcagCompliance } from './services/accessibilityService';
import { ColorData } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Suggest color roles for palette: background, text, border, accent
export function getPaletteColorSuggestions(colors: ColorData[]): {
  background: ColorData;
  text: ColorData;
  borders: ColorData[];
  accents: ColorData[];
} {
  // Sort colors by luminance
  const withLuminance = colors.map(c => ({
    ...c,
    luminance: getLuminance(c.rgb)
  }));
  withLuminance.sort((a, b) => a.luminance - b.luminance);

  // Darkest for background, lightest for text
  const background = withLuminance[0];
  const text = withLuminance[withLuminance.length - 1];

  // Find medium contrast colors for borders/accents
  const borderAccentCandidates = withLuminance.slice(1, withLuminance.length - 1);
  // Filter by WCAG contrast with background and text
  const borders = borderAccentCandidates.filter(c => {
    const ratioBg = calculateContrastRatio(c.rgb, background.rgb);
    const ratioText = calculateContrastRatio(c.rgb, text.rgb);
    return checkWcagCompliance(ratioBg).normal.aa || checkWcagCompliance(ratioText).normal.aa;
  });
  const accents = borderAccentCandidates.filter(c => !borders.includes(c));

  return { background, text, borders, accents };
}

// Helper: get luminance from rgb
function getLuminance(rgb: [number, number, number]): number {
  const [r, g, b] = rgb.map((c) => {
    c /= 255;
    return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4);
  });
  return 0.2126 * r + 0.7152 * g + 0.0722 * b;
}
