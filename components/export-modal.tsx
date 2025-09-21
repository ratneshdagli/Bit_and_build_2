"use client"

import React, { useState } from 'react';
import { type Palette } from '@/lib/types';
import { 
  exportAsCSS, 
  exportAsTailwind, 
  exportAsJSON, 
  exportAsSCSS, 
  exportAsDesignTokens,
  downloadFile,
  copyToClipboard
} from '@/lib/services/exportService';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: Palette;
}

type ExportFormat = 'css' | 'tailwind' | 'json' | 'scss' | 'design-tokens';

const formatOptions = [
  { value: 'css', label: 'CSS Variables', description: 'CSS custom properties' },
  { value: 'tailwind', label: 'Tailwind Config', description: 'Tailwind CSS configuration' },
  { value: 'json', label: 'JSON', description: 'Structured JSON format' },
  { value: 'scss', label: 'SCSS Variables', description: 'SCSS variables' },
  { value: 'design-tokens', label: 'Design Tokens', description: 'Design token format' }
];

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose, palette }) => {
  const [selectedFormat, setSelectedFormat] = useState<ExportFormat>('css');
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;

  const getExportContent = () => {
    switch (selectedFormat) {
      case 'css': return exportAsCSS(palette);
      case 'tailwind': return exportAsTailwind(palette);
      case 'json': return exportAsJSON(palette);
      case 'scss': return exportAsSCSS(palette);
      case 'design-tokens': return exportAsDesignTokens(palette);
      default: return '';
    }
  };

  const getFileExtension = () => {
    switch (selectedFormat) {
      case 'css': return 'css';
      case 'tailwind': return 'js';
      case 'json': return 'json';
      case 'scss': return 'scss';
      case 'design-tokens': return 'json';
      default: return 'txt';
    }
  };

  const getMimeType = () => {
    switch (selectedFormat) {
      case 'css': return 'text/css';
      case 'tailwind': return 'application/javascript';
      case 'json': return 'application/json';
      case 'scss': return 'text/scss';
      case 'design-tokens': return 'application/json';
      default: return 'text/plain';
    }
  };

  const handleDownload = () => {
    const content = getExportContent();
    const filename = `${palette.paletteName.toLowerCase().replace(/\s+/g, '-')}-palette.${getFileExtension()}`;
    downloadFile(content, filename, getMimeType());
  };

  const handleCopy = async () => {
    const content = getExportContent();
    const success = await copyToClipboard(content);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-4xl max-h-[90vh] overflow-hidden">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Export Palette: {palette.paletteName}
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close export modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="flex h-[600px]">
          {/* Format Selection */}
          <div className="w-1/3 p-4 border-r border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800/50">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Export Format</h3>
            <div className="space-y-2">
              {formatOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => setSelectedFormat(option.value as ExportFormat)}
                  className={`w-full text-left p-3 rounded-lg border transition-all ${
                    selectedFormat === option.value
                      ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300'
                      : 'border-gray-200 dark:border-gray-700 hover:border-gray-300 dark:hover:border-gray-600 text-gray-700 dark:text-gray-300'
                  }`}
                >
                  <div className="font-medium">{option.label}</div>
                  <div className="text-sm opacity-75">{option.description}</div>
                </button>
              ))}
            </div>
            
            <div className="mt-6 space-y-2">
              <button
                onClick={handleDownload}
                className="w-full flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                Download
              </button>
              
              <button
                onClick={handleCopy}
                className={`w-full flex items-center justify-center gap-2 font-medium py-2 px-4 rounded-lg transition-colors ${
                  copied
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                }`}
              >
                {copied ? (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                    </svg>
                    Copied!
                  </>
                ) : (
                  <>
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                    </svg>
                    Copy to Clipboard
                  </>
                )}
              </button>
            </div>
          </div>
          
          {/* Code Preview */}
          <div className="flex-1 p-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-4">Preview</h3>
            <div className="bg-gray-900 rounded-lg p-4 h-full overflow-auto">
              <pre className="text-sm text-gray-100 font-mono whitespace-pre-wrap">
                {getExportContent()}
              </pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
