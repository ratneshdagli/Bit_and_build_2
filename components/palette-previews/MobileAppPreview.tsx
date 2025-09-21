import React from 'react';
import { Palette } from '@/lib/types';
import { getPaletteColorSuggestions } from '@/lib/utils';

interface MobileAppPreviewProps {
  palette: Palette;
}

export const MobileAppPreview: React.FC<MobileAppPreviewProps> = ({ palette }) => {
  const suggestions = getPaletteColorSuggestions(palette.colors);
  return (
    <div style={{
      background: suggestions.background.hex,
      color: suggestions.text.hex,
      borderRadius: 12,
      width: 240,
      height: 320,
      margin: '0 auto',
      boxShadow: '0 2px 12px rgba(0,0,0,0.07)',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 16,
      padding: 24,
      position: 'relative',
      left: '50%',
      transform: 'translateX(-50%)'
    }}>
      <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4 }}>App Title</div>
      <div style={{ fontSize: 14, marginBottom: 8, textAlign: 'center' }}>Welcome to your app preview!</div>
      <div style={{ display: 'flex', gap: 12, marginBottom: 12, justifyContent: 'center' }}>
        {palette.colors.map((c) => (
          <span key={c.hex} style={{ background: c.hex, width: 28, height: 28, borderRadius: '50%', border: '2px solid #fff', boxShadow: '0 1px 4px rgba(0,0,0,0.08)' }} />
        ))}
      </div>
      <button style={{
        background: suggestions.accents[0]?.hex || suggestions.text.hex,
        color: suggestions.text.hex,
        border: 'none',
        borderRadius: 8,
        padding: '8px 18px',
        fontWeight: 600,
        cursor: 'pointer',
        marginTop: 16
      }}>Sign In</button>
    </div>
  );
}
