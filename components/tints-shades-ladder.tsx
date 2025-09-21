"use client"

import React, { useState } from 'react';
import { type ColorData } from '@/lib/types';
import { generateTintsAndShades } from '@/lib/services/colorVariationsService';

interface TintsShadesLadderProps {
  color: ColorData;
  onClose: () => void;
}

export const TintsShadesLadder: React.FC<TintsShadesLadderProps> = ({ color, onClose }) => {
  const [variations] = useState(() => generateTintsAndShades(color, 5));

  const copyToClipboard = (hex: string) => {
    navigator.clipboard.writeText(hex);
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Tints & Shades for {color.role}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close tints and shades modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {variations.map((variation, index) => (
              <div 
                key={index}
                className="relative group rounded-lg overflow-hidden shadow-sm border border-gray-200 dark:border-gray-700"
                style={{ backgroundColor: variation.hex }}
              >
                <div className="p-4 h-24 flex flex-col justify-end">
                  <div className="bg-black/20 backdrop-blur-sm rounded p-2">
                    <p className="text-white text-sm font-medium truncate">{variation.role}</p>
                    <div className="flex items-center justify-between mt-1">
                      <p className="text-white text-xs font-mono">{variation.hex.toUpperCase()}</p>
                      <button
                        onClick={() => copyToClipboard(variation.hex)}
                        className="text-white hover:text-gray-200 transition-opacity opacity-0 group-hover:opacity-100"
                        title="Copy hex code"
                      >
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="mt-6 p-4 bg-gray-50 dark:bg-gray-800/50 rounded-lg">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">Usage Tips</h3>
            <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
              <li>• Tints are lighter variations, great for backgrounds and highlights</li>
              <li>• Shades are darker variations, perfect for text and shadows</li>
              <li>• Click the copy icon to copy hex codes to your clipboard</li>
              <li>• Use these variations to create consistent color hierarchies</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};
