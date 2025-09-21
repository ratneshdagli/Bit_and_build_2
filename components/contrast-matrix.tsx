"use client"

import React, { useState } from 'react';
import { calculateContrastRatio, checkWcagCompliance } from '@/lib/services/accessibilityService';
import { type ColorData } from '@/lib/types';

interface ContrastMatrixProps {
  colors: ColorData[];
  onFixContrast?: (textColor: ColorData, bgColor: ColorData) => void;
}

export const ContrastMatrix: React.FC<ContrastMatrixProps> = ({ colors, onFixContrast }) => {
  const [showMatrix, setShowMatrix] = useState(false);

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
        <table className="min-w-full border-collapse">
          <thead>
            <tr>
              <th className="p-2 text-left text-xs font-bold text-gray-700 dark:text-gray-300">Color</th>
              {colors.map((col, idx) => (
                <th key={col.hex} className="p-2 text-xs font-bold text-gray-700 dark:text-gray-300">{col.role}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {colors.map((rowColor, rowIdx) => (
              <tr key={rowColor.hex}>
                <td className="p-2 align-middle">
                  <div className="flex items-center gap-2">
                    <span className="inline-block w-5 h-5 rounded" style={{ background: rowColor.hex }}></span>
                    <span className="font-mono text-xs">{rowColor.hex.toUpperCase()}</span>
                    <span className="text-xs text-gray-600 dark:text-gray-400">{rowColor.role}</span>
                    {/* Suggestion label */}
                    {getContrastSuggestion(rowColor, colors) === 'text' && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-emerald-100 dark:bg-emerald-900 text-emerald-700 dark:text-emerald-300 text-[10px] font-semibold">Best for Text</span>
                    )}
                    {getContrastSuggestion(rowColor, colors) === 'background' && (
                      <span className="ml-2 px-2 py-0.5 rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 text-[10px] font-semibold">Best for Background</span>
                    )}
                  </div>
                </td>
                {colors.map((colColor, colIdx) => {
                  if (rowIdx === colIdx) {
                    return <td key={colColor.hex} className="p-2 text-center text-xs text-gray-400">—</td>;
                  }
                  const ratio = calculateContrastRatio(rowColor.rgb, colColor.rgb);
                  const wcag = checkWcagCompliance(ratio);
                  return (
                    <td key={colColor.hex} className="p-2 text-center text-xs">
                      <span className={
                        ratio >= 7 ? 'font-bold text-emerald-600 dark:text-emerald-400' :
                        ratio >= 4.5 ? 'font-semibold text-yellow-700 dark:text-yellow-300' :
                        'text-red-600 dark:text-red-400'
                      }>
                        {ratio.toFixed(2)}
                      </span>
                      <span className="block text-[10px] mt-1">
                        {wcag.normal.aa ? 'AA' : ''} {wcag.normal.aaa ? 'AAA' : ''}
                      </span>
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

// Helper to suggest color role based on contrast with others
function getContrastSuggestion(color: ColorData, allColors: ColorData[]): 'text' | 'background' | null {
  // Exclude self
  const others = allColors.filter((c) => c.hex !== color.hex);
  let highContrastCount = 0;
  let lowContrastCount = 0;
  for (const other of others) {
    const ratio = calculateContrastRatio(color.rgb, other.rgb);
    if (ratio >= 4.5) highContrastCount++;
    if (ratio < 3) lowContrastCount++;
  }
  // If high contrast with most others, good for text
  if (highContrastCount >= Math.ceil(others.length * 0.6)) return 'text';
  // If low contrast with many, good for background
  if (lowContrastCount >= Math.ceil(others.length * 0.5)) return 'background';
  return null;
}