import React from 'react';
import { Palette } from '@/lib/types';
import { getPaletteColorSuggestions } from '@/lib/utils';

interface ChartPreviewProps {
  palette: Palette;
}

export const ChartPreview: React.FC<ChartPreviewProps> = ({ palette }) => {
  // Use accent colors for chart bars
  const suggestions = getPaletteColorSuggestions(palette.colors);
  const barColors: typeof palette.colors = (suggestions.accents && suggestions.accents.length > 0) ? suggestions.accents : palette.colors;
  return (
    <div style={{
      background: suggestions.background.hex,
      color: suggestions.text.hex,
      borderRadius: 12,
      minHeight: 220,
      padding: 24,
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 14 }}>Chart Preview</div>
      <div style={{ display: 'flex', alignItems: 'flex-end', gap: 12, height: 100, marginBottom: 14, width: '100%', justifyContent: 'center' }}>
        {barColors.length > 0 ? barColors.map((c, i) => (
          <div key={c.hex} style={{
            background: c.hex,
            width: 28,
            height: 40 + (i * 18),
            borderRadius: 7,
            boxShadow: '0 1px 4px rgba(0,0,0,0.08)'
          }} />
        )) : <div style={{color: suggestions.text.hex}}>No colors to display</div>}
      </div>
      <div style={{ display: 'flex', gap: 10 }}>
        {barColors.map((c) => (
          <span key={c.hex} style={{ background: c.hex, width: 18, height: 18, borderRadius: '50%' }} />
        ))}
      </div>
    </div>
  );
}
