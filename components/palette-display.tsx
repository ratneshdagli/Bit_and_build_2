"use client"

import React from 'react';
import { PaletteCard } from './palette-card';
import { type Palette } from '@/lib/types';
import { LandingPagePreview } from './palette-previews/LandingPagePreview';
import { MobileAppPreview } from './palette-previews/MobileAppPreview';
import { ChartPreview } from './palette-previews/ChartPreview';

interface PaletteDisplayProps {
  palettes: Palette[];
  onRerollUnlocked?: (palette: Palette) => void;
  onToggleLock?: (paletteIndex: number, colorIndex: number) => void;
  onUpdatePalette?: (paletteIndex: number, updatedPalette: Palette) => void;
}

export const PaletteDisplay: React.FC<PaletteDisplayProps> = ({ 
  palettes, 
  onRerollUnlocked, 
  onToggleLock,
  onUpdatePalette
}) => {
  return (
    <div className="flex flex-col items-center justify-center w-full py-12">
      {palettes.map((palette, index) => (
        <div key={`${palette.paletteName}-${index}`} className="flex flex-col gap-10 w-full max-w-6xl">
          <div className="rounded-3xl bg-white dark:bg-gray-900 shadow-xl border border-gray-200 dark:border-gray-800 p-8">
            <PaletteCard 
              palette={palette}
              onRerollUnlocked={onRerollUnlocked}
              onToggleLock={onToggleLock}
              onUpdatePalette={onUpdatePalette}
              paletteIndex={index}
            />
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-8 items-start">
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-6 flex flex-col items-center justify-center shadow-md" style={{minHeight:320}}>
                <div className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-300">Landing Page Preview</div>
                <LandingPagePreview palette={palette} />
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-6 flex flex-col items-center justify-center shadow-md" style={{minHeight:320}}>
                <div className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-300">Mobile App Preview</div>
                <MobileAppPreview palette={palette} />
              </div>
              <div className="rounded-xl bg-gray-50 dark:bg-gray-800 p-6 flex flex-col items-center justify-center shadow-md" style={{minHeight:320}}>
                <div className="text-base font-semibold mb-4 text-gray-700 dark:text-gray-300">Chart Preview</div>
                <ChartPreview palette={palette} />
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
