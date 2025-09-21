"use client"

import React from 'react';
import { calculateContrastRatio, checkWcagCompliance, simulateColorBlindness } from '@/lib/services/accessibilityService';
import { ColorBlindnessType, type ColorData } from '@/lib/types';
import { CheckIcon, XIcon } from './icons';
import { ContrastMatrix } from './contrast-matrix';

interface AccessibilityReportProps {
  colors: ColorData[];
  simulationType: ColorBlindnessType;
  setSimulationType: (type: ColorBlindnessType) => void;
  onFixContrast?: (textColor: ColorData, bgColor: ColorData) => void;
}

const whiteRgb: [number, number, number] = [255, 255, 255];
const blackRgb: [number, number, number] = [0, 0, 0];

const ContrastBadge: React.FC<{ pass: boolean; label: string }> = ({ pass, label }) => (
    <span className={`px-2 py-0.5 text-xs font-semibold rounded-full ${pass ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900 dark:text-emerald-300' : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300'}`}>
        {label}
    </span>
);

export const AccessibilityReport: React.FC<AccessibilityReportProps> = ({ colors, simulationType, setSimulationType, onFixContrast }) => {
  // Simulate colors for the selected color blindness type
  const simulatedColors = colors.map((color) => ({
    ...color,
    hex: simulateColorBlindness(color.rgb, simulationType)
  }));

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100">Accessibility Audit</h3>
        <p className="text-sm text-gray-500 dark:text-gray-400">Contrast ratios and color blindness simulation.</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div>
          <label htmlFor="sim-select" className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
            Color Blindness Simulation
          </label>
          <select
            id="sim-select"
            value={simulationType}
            onChange={(e) => setSimulationType(e.target.value as ColorBlindnessType)}
            className="w-full p-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            {Object.values(ColorBlindnessType).map((type) => (
              <option key={type} value={type}>{type}</option>
            ))}
          </select>
        </div>
        {/* Pass simulated colors to ContrastMatrix */}
        <ContrastMatrix colors={simulatedColors} onFixContrast={onFixContrast} />
      </div>
    </div>
  );
};
