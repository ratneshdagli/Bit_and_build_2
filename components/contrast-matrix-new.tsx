"use client"

import React, { useState } from 'react';
import { calculateContrastRatio, checkWcagCompliance } from '@/lib/services/accessibilityService';
import { type ColorData } from '@/lib/types';

interface ContrastMatrixProps {
  colors: ColorData[];
  onFixContrast?: (textColor: ColorData, bgColor: ColorData) => void;
}

interface ContrastCellProps {
  textColor: ColorData;
  bgColor: ColorData;
  onFix?: () => void;
}

const ContrastCell: React.FC<ContrastCellProps> = ({ textColor, bgColor, onFix }) => {
  const contrast = calculateContrastRatio(textColor.rgb, bgColor.rgb);
  const compliance = checkWcagCompliance(contrast);
  const passesAA = compliance.normal.aa;
  const passesAAA = compliance.normal.aaa;

  const getStatusColor = () => {
    if (passesAAA) return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
    if (passesAA) return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
    return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
  };

  const getStatusText = () => {
    if (passesAAA) return 'AAA';
    if (passesAA) return 'AA';
    return 'Fail';
  };

  return (
    <div 
      className="relative p-2 text-center border border-gray-200 dark:border-gray-700 min-h-[60px] flex flex-col justify-center"
      style={{ 
        backgroundColor: bgColor.hex,
        color: textColor.hex
      }}
    >
      <div className="text-xs font-mono font-bold">
        {contrast.toFixed(1)}:1
      </div>
      <div className={`text-xs px-1 py-0.5 rounded mt-1 ${getStatusColor()}`}>
        {getStatusText()}
      </div>
      {!passesAA && onFix && (
        <button
          onClick={onFix}
          className="absolute top-1 right-1 w-4 h-4 bg-red-500 hover:bg-red-600 text-white rounded-full text-xs flex items-center justify-center"
          title="Fix contrast"
        >
          ✕
        </button>
      )}
    </div>
  );
};

export const ContrastMatrix: React.FC<ContrastMatrixProps> = ({ colors, onFixContrast }) => {
  const [showMatrix, setShowMatrix] = useState(false);

  const handleFixContrast = (textColor: ColorData, bgColor: ColorData) => {
    if (onFixContrast) {
      onFixContrast(textColor, bgColor);
    }
  };

  if (!showMatrix) {
    return (
      <div className="mt-4">
        <button
          onClick={() => setShowMatrix(true)}
          className="flex items-center gap-2 text-sm font-medium py-2 px-3 rounded-md transition-all bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          Show Contrast Matrix
        </button>
      </div>
    );
  }

  return (
    <div className="mt-4">
      <div className="flex items-center justify-between mb-4">
        <h4 className="font-semibold text-gray-800 dark:text-gray-200">Contrast Matrix</h4>
        <button
          onClick={() => setShowMatrix(false)}
          className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
      
      <div className="overflow-x-auto">
        <div className="min-w-full">
          <div className="flex">
            <div className="w-24 p-2 text-xs font-medium text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              Text ↓ / BG →
            </div>
            {colors.map((color) => (
              <div 
                key={`header-${color.hex}`}
                className="w-20 p-2 text-xs font-medium text-center border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: color.hex, color: color.hex === '#FFFFFF' ? '#000000' : '#FFFFFF' }}
              >
                {color.role}
              </div>
            ))}
          </div>
          
          {colors.map((textColor) => (
            <div key={`row-${textColor.hex}`} className="flex">
              <div 
                className="w-24 p-2 text-xs font-medium text-center border border-gray-200 dark:border-gray-700 flex items-center justify-center"
                style={{ backgroundColor: textColor.hex, color: textColor.hex === '#FFFFFF' ? '#000000' : '#FFFFFF' }}
              >
                {textColor.role}
              </div>
              {colors.map((bgColor) => (
                <ContrastCell
                  key={`cell-${textColor.hex}-${bgColor.hex}`}
                  textColor={textColor}
                  bgColor={bgColor}
                  onFix={textColor.hex !== bgColor.hex ? () => handleFixContrast(textColor, bgColor) : undefined}
                />
              ))}
            </div>
          ))}
        </div>
      </div>
      
      <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
        <div className="flex items-center gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-100 dark:bg-green-900 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">AAA (7:1+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-yellow-100 dark:bg-yellow-900 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">AA (4.5:1+)</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-100 dark:bg-red-900 rounded"></div>
            <span className="text-gray-600 dark:text-gray-400">Fail (<4.5:1)</span>
          </div>
        </div>
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
          Click the ✕ button on failing combinations to automatically adjust colors for better contrast.
        </p>
      </div>
    </div>
  );
};
