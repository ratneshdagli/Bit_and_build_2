"use client"

import React, { useState } from 'react';
import { ColorSwatch } from './color-swatch';
import { AccessibilityReport } from './accessibility-report';
import { FigmaExportModal } from './figma-export-modal';
import { TintsShadesLadder } from './tints-shades-ladder';
import { ExportModal } from './export-modal';
import { ShareModal } from './share-modal';
import { ColorBlindnessType, type Palette, type ColorData } from '@/lib/types';
import { FigmaIcon } from './icons';
import { adjustColorForContrast } from '@/lib/services/contrastFixService';
import { getPaletteColorSuggestions, generatePaletteNameAndMood } from '@/lib/utils';
import { ColorAdjustmentSwatch } from './ColorAdjustmentSwatch';

interface PaletteCardProps {
  palette: Palette;
  onRerollUnlocked?: (palette: Palette) => void;
  onToggleLock?: (paletteIndex: number, colorIndex: number) => void;
  onUpdatePalette?: (paletteIndex: number, updatedPalette: Palette) => void;
  paletteIndex?: number;
}

export const PaletteCard: React.FC<PaletteCardProps> = ({ 
  palette, 
  onRerollUnlocked, 
  onToggleLock, 
  onUpdatePalette,
  paletteIndex 
}) => {
  const [simulationType, setSimulationType] = useState<ColorBlindnessType>(ColorBlindnessType.NORMAL);
  const [isExportModalOpen, setIsExportModalOpen] = useState(false);
  const [isCodeExportModalOpen, setIsCodeExportModalOpen] = useState(false);
  const [isShareModalOpen, setIsShareModalOpen] = useState(false);
  const [selectedColorForTintsShades, setSelectedColorForTintsShades] = useState<ColorData | null>(null);
  // Track which color index has its adjustment panel open
  const [openAdjustmentIndex, setOpenAdjustmentIndex] = useState<number | null>(null);

  const handleToggleLock = (colorIndex: number) => {
    if (onToggleLock && paletteIndex !== undefined) {
      onToggleLock(paletteIndex, colorIndex);
    }
  };

  const handleReroll = () => {
    if (onRerollUnlocked) {
      onRerollUnlocked(palette);
    }
  };

  const hasUnlockedColors = palette.colors.some(color => !color.locked);

  const handleShowTintsShades = (color: ColorData) => {
    setSelectedColorForTintsShades(color);
  };

  const handleFixContrast = (textColor: ColorData, bgColor: ColorData) => {
    if (onUpdatePalette && paletteIndex !== undefined) {
      const { textColor: fixedTextColor, bgColor: fixedBgColor } = adjustColorForContrast(textColor, bgColor);
      
      const updatedColors = palette.colors.map(color => {
        if (color.hex === textColor.hex) {
          return fixedTextColor;
        }
        if (color.hex === bgColor.hex) {
          return fixedBgColor;
        }
        return color;
      });

      const updatedPalette = {
        ...palette,
        colors: updatedColors
      };

      onUpdatePalette(paletteIndex, updatedPalette);
    }
  };


  // Generate name and mood if not present, but do NOT set state during render
  const [generatedName, setGeneratedName] = useState(palette.generatedName);
  const [brandMood, setBrandMood] = useState(palette.brandMood);

  React.useEffect(() => {
    if (!palette.generatedName || !palette.brandMood) {
      const gen = generatePaletteNameAndMood(palette.colors);
      setGeneratedName(gen.name);
      setBrandMood(gen.mood);
      if (onUpdatePalette && paletteIndex !== undefined) {
        onUpdatePalette(paletteIndex, { ...palette, generatedName: gen.name, brandMood: gen.mood });
      }
    } else {
      setGeneratedName(palette.generatedName);
      setBrandMood(palette.brandMood);
    }
  }, [palette, onUpdatePalette, paletteIndex]);

  // Get color suggestions for this palette
  const suggestions = getPaletteColorSuggestions(palette.colors);

  return (
    <>
      <div className="glass rounded-2xl shadow-2xl border border-border/50 overflow-hidden card-animate">
        <div className="p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h2 className="text-3xl font-bold text-foreground mb-2">{palette.paletteName}</h2>
            {generatedName && (
              <p className="text-lg font-semibold text-primary">{generatedName}</p>
            )}
            {brandMood && (
              <p className="text-sm text-muted-foreground mt-1">{brandMood}</p>
            )}
          </div>
          <div className="flex flex-wrap gap-2">
            {hasUnlockedColors && onRerollUnlocked && (
              <button
                onClick={handleReroll}
                className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 bg-blue-100 dark:bg-blue-900/50 hover:bg-blue-200 dark:hover:bg-blue-900 text-blue-700 dark:text-blue-300 hover:scale-105 shadow-sm hover:shadow-md focus-ring"
                title="Reroll unlocked colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                </svg>
                Reroll
              </button>
            )}
            <button
              onClick={() => setIsShareModalOpen(true)}
              className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 bg-purple-100 dark:bg-purple-900/50 hover:bg-purple-200 dark:hover:bg-purple-900 text-purple-700 dark:text-purple-300 hover:scale-105 shadow-sm hover:shadow-md focus-ring"
              title="Share palette link"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
              </svg>
              Share
            </button>
            <button
              onClick={() => setIsCodeExportModalOpen(true)}
              className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 bg-green-100 dark:bg-green-900/50 hover:bg-green-200 dark:hover:bg-green-900 text-green-700 dark:text-green-300 hover:scale-105 shadow-sm hover:shadow-md focus-ring"
              title="Export as CSS/JSON/etc"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4" />
              </svg>
              Export Code
            </button>
            <button
              onClick={() => setIsExportModalOpen(true)}
              className="flex items-center justify-center gap-2 text-sm font-semibold py-2.5 px-4 rounded-lg transition-all duration-200 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 hover:scale-105 shadow-sm hover:shadow-md focus-ring"
            >
              <FigmaIcon className="w-4 h-4" />
              Export for Figma
            </button>
          </div>
        </div>
        <div className="flex flex-col lg:flex-row w-full border-t border-border/30">
          {palette.colors.map((color, index) => (
            <ColorAdjustmentSwatch
              key={color.hex}
              color={color}
              index={index}
              palette={palette}
              onUpdatePalette={onUpdatePalette}
              paletteIndex={paletteIndex}
              suggestions={suggestions}
              open={openAdjustmentIndex === index}
              setOpen={() => setOpenAdjustmentIndex(openAdjustmentIndex === index ? null : index)}
            />
          ))}
        </div>
        <div className="p-8 bg-muted/30 border-t border-border/30">
          <AccessibilityReport
            colors={palette.colors}
            simulationType={simulationType}
            setSimulationType={setSimulationType}
            onFixContrast={handleFixContrast}
          />
        </div>
      </div>
      <FigmaExportModal 
        isOpen={isExportModalOpen} 
        onClose={() => setIsExportModalOpen(false)} 
        palette={palette} 
      />
      <ExportModal 
        isOpen={isCodeExportModalOpen} 
        onClose={() => setIsCodeExportModalOpen(false)} 
        palette={palette} 
      />
      <ShareModal 
        isOpen={isShareModalOpen} 
        onClose={() => setIsShareModalOpen(false)} 
        palette={palette} 
      />
      {selectedColorForTintsShades && (
        <TintsShadesLadder 
          color={selectedColorForTintsShades}
          onClose={() => setSelectedColorForTintsShades(null)}
        />
      )}
    </>
  );
};
