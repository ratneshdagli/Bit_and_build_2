import React, { useState } from 'react';
import { ColorData, Palette, ColorBlindnessType } from '@/lib/types';
import { ColorSwatch } from './color-swatch';
import { checkWcagCompliance, calculateContrastRatio } from '@/lib/services/accessibilityService';

function rgbToHsl([r, g, b]: [number, number, number]): [number, number, number] {
  r /= 255; g /= 255; b /= 255;
  const max = Math.max(r, g, b), min = Math.min(r, g, b);
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
  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
}

function hslToRgb([h, s, l]: [number, number, number]): [number, number, number] {
  h /= 360; s /= 100; l /= 100;
  let r, g, b;
  if (s === 0) {
    r = g = b = l;
  } else {
    const hue2rgb = (p: number, q: number, t: number) => {
      if (t < 0) t += 1;
      if (t > 1) t -= 1;
      if (t < 1 / 6) return p + (q - p) * 6 * t;
      if (t < 1 / 2) return q;
      if (t < 2 / 3) return p + (q - p) * (2 / 3 - t) * 6;
      return p;
    };
    const q = l < 0.5 ? l * (1 + s) : l + s - l * s;
    const p = 2 * l - q;
    r = hue2rgb(p, q, h + 1 / 3);
    g = hue2rgb(p, q, h);
    b = hue2rgb(p, q, h - 1 / 3);
  }
  return [Math.round(r * 255), Math.round(g * 255), Math.round(b * 255)];
}

function rgbToHex([r, g, b]: [number, number, number]): string {
  return '#' + [r, g, b].map(x => x.toString(16).padStart(2, '0')).join('');
}

export const ColorAdjustmentSwatch: React.FC<{
  color: ColorData;
  index: number;
  palette: Palette;
  onUpdatePalette?: (paletteIndex: number, updatedPalette: Palette) => void;
  paletteIndex?: number;
  suggestions: any;
  open?: boolean;
  setOpen?: () => void;
}> = ({ color, index, palette, onUpdatePalette, paletteIndex, suggestions, open = false, setOpen }) => {
  const [hsl, setHsl] = useState<[number, number, number]>(rgbToHsl(color.rgb));
  const [contrast, setContrast] = useState(100);
  const [original, setOriginal] = useState<[number, number, number]>(color.rgb);

  // Update color in palette
  const handleSlider = (type: 'hue' | 'sat' | 'light' | 'contrast', value: number) => {
    let newHsl = [...hsl] as [number, number, number];
    if (type === 'hue') newHsl[0] = value;
    if (type === 'sat') newHsl[1] = value;
    if (type === 'light') newHsl[2] = value;
    setHsl(newHsl);
    if (type === 'contrast') setContrast(value);
    let rgb = hslToRgb(newHsl);
    // Simple contrast adjustment: scale lightness
    if (type === 'contrast') {
      const avg = (rgb[0] + rgb[1] + rgb[2]) / 3;
      rgb = rgb.map(c => Math.max(0, Math.min(255, avg + (c - avg) * (value / 100)))) as [number, number, number];
    }
    updateColor(rgb);
  };

  const updateColor = (rgb: [number, number, number]) => {
    if (onUpdatePalette && paletteIndex !== undefined) {
      const updatedColors = palette.colors.map((c, i) => i === index ? { ...c, rgb, hex: rgbToHex(rgb) } : c);
      onUpdatePalette(paletteIndex, { ...palette, colors: updatedColors });
    }
  };

  const handleReset = () => {
    setHsl(rgbToHsl(original));
    setContrast(100);
    updateColor(original);
  };

  // Accessibility check (contrast with background/text)
  let contrastFail = false;
  if (color.hex === suggestions.text.hex) {
    const ratio = calculateContrastRatio(color.rgb, suggestions.background.rgb);
    contrastFail = !checkWcagCompliance(ratio).normal.aa;
  }
  if (color.hex === suggestions.background.hex) {
    const ratio = calculateContrastRatio(suggestions.text.rgb, color.rgb);
    contrastFail = !checkWcagCompliance(ratio).normal.aa;
  }

  return (
  <div className={`flex flex-col items-center w-full relative ${open ? 'py-6 bg-indigo-50 dark:bg-indigo-900/30 rounded-xl shadow-lg' : 'py-4'} transition-all duration-300`}> 
      <ColorSwatch 
        colorData={color}
        simulationType={ColorBlindnessType.NORMAL}
        colorIndex={index}
      />
      <div className="mt-2 text-xs text-gray-700 dark:text-gray-300 flex flex-wrap gap-2 justify-center">
        {color.hex === suggestions.background.hex && <span className="block font-bold bg-blue-50 dark:bg-blue-900 px-2 py-1 rounded">Background</span>}
        {color.hex === suggestions.text.hex && <span className="block font-bold bg-yellow-50 dark:bg-yellow-900 px-2 py-1 rounded">Text</span>}
        {suggestions.borders.some((b: any) => b.hex === color.hex) && <span className="block font-bold bg-gray-100 dark:bg-gray-800 px-2 py-1 rounded">Border</span>}
        {suggestions.accents.some((a: any) => a.hex === color.hex) && <span className="block font-bold bg-pink-100 dark:bg-pink-900 px-2 py-1 rounded">Accent</span>}
      </div>
      <button
        className="mt-3 text-sm px-4 py-2 rounded-lg bg-indigo-100 dark:bg-indigo-900 hover:bg-indigo-200 dark:hover:bg-indigo-800 text-indigo-700 dark:text-indigo-200 font-semibold shadow"
        onClick={setOpen}
      >
        {open ? 'Hide Adjustments' : 'Adjust Color'}
      </button>
      {open && (
        <div
          className="absolute left-0 top-full z-10 w-80 p-4 rounded-xl bg-white dark:bg-gray-900 border border-indigo-200 dark:border-indigo-700 flex flex-col gap-4 shadow-lg transition-all duration-500"
          style={{ marginTop: '8px' }}
        >
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold">Hue</label>
            <input type="range" min={0} max={360} value={hsl[0]} onInput={e => handleSlider('hue', Number(e.currentTarget.value))} className="w-full accent-indigo-500" />
            <div className="text-xs text-right">{hsl[0]}°</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold">Saturation</label>
            <input type="range" min={0} max={100} value={hsl[1]} onInput={e => handleSlider('sat', Number(e.currentTarget.value))} className="w-full accent-indigo-500" />
            <div className="text-xs text-right">{hsl[1]}%</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold">Lightness</label>
            <input type="range" min={0} max={100} value={hsl[2]} onInput={e => handleSlider('light', Number(e.currentTarget.value))} className="w-full accent-indigo-500" />
            <div className="text-xs text-right">{hsl[2]}%</div>
          </div>
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold">Contrast</label>
            <input type="range" min={50} max={200} value={contrast} onInput={e => handleSlider('contrast', Number(e.currentTarget.value))} className="w-full accent-indigo-500" />
            <div className="text-xs text-right">{contrast}%</div>
          </div>
          <div className="flex gap-2 justify-end mt-2">
            <button className="px-4 py-2 rounded bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-200 hover:bg-gray-300 dark:hover:bg-gray-600 text-xs font-semibold" onClick={handleReset}>Reset</button>
          </div>
          <div className="text-xs mt-2">
            HEX: <span className="font-mono">{color.hex}</span> | RGB: <span className="font-mono">{color.rgb.join(', ')}</span> | HSL: <span className="font-mono">{hsl.join(', ')}</span>
          </div>
          {contrastFail && (
            <div className="mt-2 text-xs text-red-600 dark:text-red-400 font-semibold">Accessibility warning: Insufficient contrast!</div>
          )}
        </div>
      )}
    </div>
  );
};