"use client"

import React, { useState, useEffect } from 'react';
import { simulateColorBlindness } from '@/lib/services/accessibilityService';
import { ColorBlindnessType, type ColorData } from '@/lib/types';
import { CopyIcon, CheckIcon } from './icons';

interface ColorSwatchProps {
  colorData: ColorData;
  simulationType: ColorBlindnessType;
  onToggleLock?: (colorIndex: number) => void;
  onShowTintsShades?: (color: ColorData) => void;
  colorIndex?: number;
}

export const ColorSwatch: React.FC<ColorSwatchProps> = ({ 
  colorData, 
  simulationType, 
  onToggleLock, 
  onShowTintsShades,
  colorIndex 
}) => {
  const [copied, setCopied] = useState(false);
  const simulatedHex = simulateColorBlindness(colorData.rgb, simulationType);

  const handleCopy = () => {
    navigator.clipboard.writeText(colorData.hex.toUpperCase());
    setCopied(true);
  };

  const handleToggleLock = () => {
    if (onToggleLock && colorIndex !== undefined) {
      onToggleLock(colorIndex);
    }
  };

  const handleShowTintsShades = () => {
    if (onShowTintsShades) {
      onShowTintsShades(colorData);
    }
  };

  useEffect(() => {
    if (copied) {
      const timer = setTimeout(() => setCopied(false), 2000);
      return () => clearTimeout(timer);
    }
  }, [copied]);

  return (
    <div 
      className={`flex-1 text-center p-6 min-w-[140px] relative rounded-xl transition-all duration-300 hover:scale-[1.02] ${
        colorData.locked ? 'ring-2 ring-yellow-400 ring-offset-2 ring-offset-background' : ''
      }`} 
      style={{ backgroundColor: simulatedHex }}
    >
      {/* Lock button */}
      {onToggleLock && colorIndex !== undefined && (
        <button
          onClick={handleToggleLock}
          className={`absolute top-3 left-3 p-2 rounded-full transition-all duration-200 text-white hover:scale-110 focus-ring ${
            colorData.locked 
              ? 'bg-yellow-500/90 hover:bg-yellow-500 shadow-lg' 
              : 'bg-black/30 hover:bg-black/50'
          }`}
          title={colorData.locked ? "Unlock color" : "Lock color"}
        >
          {colorData.locked ? (
            <svg className="w-4 h-4 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
          ) : (
            <svg className="w-4 h-4 drop-shadow-sm" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 015.905-.75 1 1 0 001.937-.5A5.002 5.002 0 0010 2z" />
            </svg>
          )}
        </button>
      )}

      <div className="p-4 rounded-xl bg-black/25 backdrop-blur-md border border-white/10 shadow-lg">
        <p className="font-bold text-white text-base tracking-wide drop-shadow-sm">{colorData.role}</p>
        <div className="flex items-center justify-center space-x-3 mt-2">
          <p className="font-mono text-white text-sm font-medium drop-shadow-sm">{colorData.hex.toUpperCase()}</p>
          <button 
            onClick={handleCopy} 
            className="text-white hover:text-gray-200 transition-all duration-200 hover:scale-110 p-1 rounded focus-ring" 
            title="Copy hex code"
          >
            {copied ? (
              <CheckIcon className="w-4 h-4 text-emerald-400 drop-shadow-sm" />
            ) : (
              <CopyIcon className="w-4 h-4 drop-shadow-sm" />
            )}
          </button>
        </div>
        {onShowTintsShades && (
          <button
            onClick={handleShowTintsShades}
            className="mt-3 w-full text-xs bg-white/20 hover:bg-white/30 text-white py-2 px-3 rounded-lg transition-all duration-200 font-medium hover:scale-105 focus-ring backdrop-blur-sm border border-white/10"
            title="Show tints and shades"
          >
            Tints & Shades
          </button>
        )}
      </div>
    </div>
  );
};