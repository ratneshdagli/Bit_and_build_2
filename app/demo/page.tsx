"use client"

import React, { useState, useCallback, useEffect } from 'react';
import { Palette } from "lucide-react";
import { PromptInput } from '@/components/prompt-input';
import { PaletteDisplay } from '@/components/palette-display';
import { Loader } from '@/components/loader';
import { generatePalettesFromImage } from '@/lib/services/colorThiefService';
import { generatePalettesFromText } from '@/lib/services/groqService';
import { generatePaletteFromImageAndText } from '@/lib/services/geminiService';
import { getPaletteFromUrl, updateUrlWithPalette } from '@/lib/services/urlService';
import { AppStatus, type Palette as PaletteType } from '@/lib/types';

interface GenerationInput {
  text?: string;
  image?: File;
}

export default function DemoPage() {
  const [palettes, setPalettes] = useState<PaletteType[]>([]);
  const [status, setStatus] = useState<AppStatus>(AppStatus.IDLE);
  const [error, setError] = useState<string | null>(null);

  // Load palette from URL on component mount
  useEffect(() => {
    const urlPalette = getPaletteFromUrl();
    if (urlPalette) {
      setPalettes([urlPalette]);
      setStatus(AppStatus.SUCCESS);
    }
  }, []);

  const handleGenerate = useCallback(async (data: GenerationInput) => {
    setStatus(AppStatus.LOADING);
    setError(null);
    setPalettes([]);
    
    try {
  let generatedPalettes: PaletteType[];
      if (data.text && data.image) {
        generatedPalettes = await generatePaletteFromImageAndText(data.text, data.image);
      } else if (data.text) {
        generatedPalettes = await generatePalettesFromText(data.text);
      } else if (data.image) {
        generatedPalettes = await generatePalettesFromImage(data.image);
      } else {
        throw new Error("No prompt provided.");
      }
      setPalettes(generatedPalettes);
      setStatus(AppStatus.SUCCESS);
      
      // Update URL with the first generated palette
      if (generatedPalettes.length > 0) {
        updateUrlWithPalette(generatedPalettes[0]);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while generating the palette.');
      setStatus(AppStatus.ERROR);
    }
  }, []);

  const handleToggleLock = useCallback((paletteIndex: number, colorIndex: number) => {
    setPalettes(prevPalettes => {
      const newPalettes = [...prevPalettes];
      const palette = { ...newPalettes[paletteIndex] };
      const colors = [...palette.colors];
      colors[colorIndex] = { ...colors[colorIndex], locked: !colors[colorIndex].locked };
      palette.colors = colors;
      newPalettes[paletteIndex] = palette;
      
      // Update URL with the modified palette
      if (paletteIndex === 0) {
        updateUrlWithPalette(palette);
      }
      
      return newPalettes;
    });
  }, []);

  const handleRerollUnlocked = useCallback(async (palette: PaletteType) => {
    setStatus(AppStatus.LOADING);
    setError(null);
    
    try {
      // Generate new colors for unlocked positions
      const unlockedIndices = palette.colors
        .map((color, index) => color.locked ? -1 : index)
        .filter(index => index !== -1);
      
      if (unlockedIndices.length === 0) {
        setStatus(AppStatus.SUCCESS);
        return;
      }

      // Generate a new palette and replace only unlocked colors
      const newPalettes = await generatePalettesFromText(`Generate a color palette similar to ${palette.paletteName}`);
      if (newPalettes.length > 0) {
        const newColors = [...palette.colors];
        unlockedIndices.forEach((originalIndex, newIndex) => {
          if (newPalettes[0].colors[newIndex]) {
            newColors[originalIndex] = {
              ...newPalettes[0].colors[newIndex],
              role: palette.colors[originalIndex].role, // Keep original role
              locked: false
            };
          }
        });
        
        const updatedPalette = { ...palette, colors: newColors };
        setPalettes([updatedPalette]);
        setStatus(AppStatus.SUCCESS);
        updateUrlWithPalette(updatedPalette);
      }
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred while rerolling colors.');
      setStatus(AppStatus.ERROR);
    }
  }, []);

  const handleUpdatePalette = useCallback((paletteIndex: number, updatedPalette: PaletteType) => {
    setPalettes(prevPalettes => {
      const newPalettes = [...prevPalettes];
      newPalettes[paletteIndex] = updatedPalette;
      return newPalettes;
    });
  }, []);

  // Update URL when palettes[0] changes
  React.useEffect(() => {
    if (palettes.length > 0) {
      updateUrlWithPalette(palettes[0]);
    }
  }, [palettes]);

  return (
  <div className="min-h-screen font-sans text-foreground antialiased bg-background gradient-bg">
      <main className="container mx-auto p-4 md:p-8 lg:p-12">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-12 animate-fade-in">
            <h1 className="text-5xl lg:text-6xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-6">
              ChromaGen Demo
            </h1>
            <p className="text-xl lg:text-2xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
              Generate beautiful color palettes from text prompts or images using AI
            </p>
          </div>

          <div className="animate-slide-up" style={{ animationDelay: '0.1s' }}>
            <PromptInput onGenerate={handleGenerate} isLoading={status === AppStatus.LOADING} />
          </div>

          <div className="mt-12">
            {status === AppStatus.IDLE && (
              <div className="text-center p-12 glass rounded-2xl border border-border/50 animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                  <Palette className="w-8 h-8 text-primary" />
                </div>
                <h3 className="text-2xl font-bold text-foreground mb-3">Ready to Generate</h3>
                <p className="text-muted-foreground text-lg">Enter a text prompt or upload an image to get started</p>
                    </div>
            )}
            {status === AppStatus.LOADING && (
              <div className="animate-fade-in">
                <Loader />
              </div>
            )}
            {status === AppStatus.ERROR && (
              <div className="text-center p-12 bg-destructive/10 border border-destructive/20 rounded-2xl animate-fade-in">
                <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-destructive/10 flex items-center justify-center">
                  <svg className="w-8 h-8 text-destructive" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                  </svg>
                </div>
                <h3 className="text-2xl font-bold text-destructive mb-3">Generation Failed</h3>
                <p className="mt-2 text-destructive/80 text-lg">{error}</p>
                </div>
            )}
            {status === AppStatus.SUCCESS && (
              <div className="animate-scale-in">
                <PaletteDisplay 
                  palettes={palettes}
                  onRerollUnlocked={handleRerollUnlocked}
                  onToggleLock={handleToggleLock}
                  onUpdatePalette={handleUpdatePalette}
                />
              </div>
            )}
          </div>
        </div>
      </main>
      <footer className="text-center py-8 text-sm text-muted-foreground border-t border-border/30 mt-16">
        <p>&copy; {new Date().getFullYear()} ChromaGen. AI-powered creativity.</p>
      </footer>
    </div>
  );
}