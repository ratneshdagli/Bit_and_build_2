import React from 'react';
import { Palette } from '@/lib/types';
import { getPaletteColorSuggestions } from '@/lib/utils';

interface LandingPagePreviewProps {
  palette: Palette;
}

export const LandingPagePreview: React.FC<LandingPagePreviewProps> = ({ palette }) => {
  const suggestions = getPaletteColorSuggestions(palette.colors);
    return (
      <div style={{
        background: suggestions.background.hex,
        color: suggestions.text.hex,
        border: `2px solid ${suggestions.borders[0]?.hex || suggestions.text.hex}`,
        borderRadius: 12,
        padding: 24,
        minHeight: 220,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        boxShadow: '0 2px 12px rgba(0,0,0,0.07)'
      }}>
        <h1 style={{ fontSize: 18, fontWeight: 700, marginBottom: 10, textAlign: 'center', lineHeight: 1.2 }}>Landing Page Headline</h1>
        <p style={{ fontSize: 15, margin: '0 0 16px 0', textAlign: 'center' }}>This is a sample landing page preview using your palette.</p>
        <button style={{
          background: suggestions.accents[0]?.hex || suggestions.text.hex,
          color: suggestions.text.hex,
          border: 'none',
          borderRadius: 8,
          padding: '9px 24px',
          fontWeight: 600,
          cursor: 'pointer',
          marginTop: 14
        }}>Get Started</button>
      </div>
  );
}
