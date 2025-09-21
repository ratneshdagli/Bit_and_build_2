import { type Palette } from '../types';

/**
 * Converts RGB to HSL
 */
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

  return [Math.round(h * 360), Math.round(s * 100), Math.round(l * 100)];
};

/**
 * Export palette as CSS variables
 */
export const exportAsCSS = (palette: Palette): string => {
  const cssVars = palette.colors.map(color => {
    const [h, s, l] = rgbToHsl(color.rgb[0], color.rgb[1], color.rgb[2]);
    return `  --${color.role.toLowerCase().replace(/\s+/g, '-')}: ${color.hex};
  --${color.role.toLowerCase().replace(/\s+/g, '-')}-rgb: ${color.rgb.join(', ')};
  --${color.role.toLowerCase().replace(/\s+/g, '-')}-hsl: ${h}, ${s}%, ${l}%;`;
  }).join('\n');

  return `/* ${palette.paletteName} Color Palette */
:root {
${cssVars}
}

/* Usage Examples */
.text-primary { color: var(--primary); }
.bg-primary { background-color: var(--primary); }
.border-primary { border-color: var(--primary); }`;
};

/**
 * Export palette as Tailwind CSS config
 */
export const exportAsTailwind = (palette: Palette): string => {
  const colors = palette.colors.reduce((acc, color) => {
    const [h, s, l] = rgbToHsl(color.rgb[0], color.rgb[1], color.rgb[2]);
    acc[color.role.toLowerCase().replace(/\s+/g, '-')] = {
      DEFAULT: color.hex,
      rgb: color.rgb.join(', '),
      hsl: `${h}, ${s}%, ${l}%`
    };
    return acc;
  }, {} as Record<string, any>);

  return `// ${palette.paletteName} - Add to your tailwind.config.js
module.exports = {
  theme: {
    extend: {
      colors: ${JSON.stringify(colors, null, 2)}
    }
  }
}`;
};

/**
 * Export palette as JSON
 */
export const exportAsJSON = (palette: Palette): string => {
  const exportData = {
    name: palette.paletteName,
    colors: palette.colors.map(color => ({
      role: color.role,
      hex: color.hex,
      rgb: color.rgb,
      hsl: rgbToHsl(color.rgb[0], color.rgb[1], color.rgb[2]),
      description: color.description
    })),
    exportedAt: new Date().toISOString(),
    format: 'chromagen-v1'
  };

  return JSON.stringify(exportData, null, 2);
};

/**
 * Export palette as SCSS variables
 */
export const exportAsSCSS = (palette: Palette): string => {
  const scssVars = palette.colors.map(color => {
    const [h, s, l] = rgbToHsl(color.rgb[0], color.rgb[1], color.rgb[2]);
    return `$${color.role.toLowerCase().replace(/\s+/g, '-')}: ${color.hex};
$${color.role.toLowerCase().replace(/\s+/g, '-')}-rgb: ${color.rgb.join(', ')};
$${color.role.toLowerCase().replace(/\s+/g, '-')}-hsl: ${h}, ${s}%, ${l}%;`;
  }).join('\n');

  return `// ${palette.paletteName} Color Palette
${scssVars}

// Usage Examples
// .text-primary { color: $primary; }
// .bg-primary { background-color: $primary; }`;
};

/**
 * Export palette as Design Tokens (JSON format)
 */
export const exportAsDesignTokens = (palette: Palette): string => {
  const tokens = {
    $metadata: {
      tokenSetOrder: ['colors']
    },
    colors: palette.colors.reduce((acc, color) => {
      const [h, s, l] = rgbToHsl(color.rgb[0], color.rgb[1], color.rgb[2]);
      acc[color.role.toLowerCase().replace(/\s+/g, '-')] = {
        $type: 'color',
        $value: color.hex,
        $description: color.description,
        rgb: color.rgb,
        hsl: [h, s, l]
      };
      return acc;
    }, {} as Record<string, any>)
  };

  return JSON.stringify(tokens, null, 2);
};

/**
 * Download a file with the given content and filename
 */
export const downloadFile = (content: string, filename: string, mimeType: string = 'text/plain') => {
  const blob = new Blob([content], { type: mimeType });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
};

/**
 * Copy text to clipboard
 */
export const copyToClipboard = async (text: string): Promise<boolean> => {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (err) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    try {
      document.execCommand('copy');
      document.body.removeChild(textArea);
      return true;
    } catch (err) {
      document.body.removeChild(textArea);
      return false;
    }
  }
};
