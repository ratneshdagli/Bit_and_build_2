"use client"

import React, { useState } from 'react';
import { type Palette } from '@/lib/types';
import { XIcon, CopyIcon, CheckIcon, ExternalLinkIcon, FigmaIcon } from './icons';

interface FigmaExportModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: Palette;
}

const Step: React.FC<{ number: number, title: string, children: React.ReactNode }> = ({ number, title, children }) => (
    <div className="flex items-start space-x-4">
        <div className="flex-shrink-0 flex items-center justify-center h-8 w-8 rounded-full bg-indigo-600 text-white font-bold text-sm">
            {number}
        </div>
        <div className="flex-grow">
            <h4 className="font-bold text-gray-800 dark:text-gray-100">{title}</h4>
            <div className="mt-1 text-sm text-gray-600 dark:text-gray-400">
                {children}
            </div>
        </div>
    </div>
);

export const FigmaExportModal: React.FC<FigmaExportModalProps> = ({ isOpen, onClose, palette }) => {
    const [isCopied, setIsCopied] = useState(false);
    const figmaPluginUrl = `https://www.figma.com/community/plugin/1365525488344770000/ChromaGen-Auto-Apply`;

    const handleCopy = () => {
        const jsonString = JSON.stringify([palette], null, 2);
        navigator.clipboard.writeText(jsonString);
        setIsCopied(true);
        setTimeout(() => setIsCopied(false), 2500);
    };

    if (!isOpen) {
        return null;
    }

    return (
        <div 
          className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50"
          aria-labelledby="figma-export-modal-title"
          role="dialog"
          aria-modal="true"
          onClick={onClose}
        >
          <div 
            className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg transform transition-all"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex items-center gap-3">
                <FigmaIcon className="w-6 h-6" />
                <h2 id="figma-export-modal-title" className="text-xl font-bold text-gray-900 dark:text-white">
                  Export to Figma
                </h2>
              </div>
              <button 
                onClick={onClose} 
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
                aria-label="Close export modal"
              >
                <XIcon className="w-6 h-6" />
              </button>
            </div>
            <div className="p-6 space-y-6">
                <Step number={1} title="Copy Palette Data">
                    <p>Click the button below to copy the palette's JSON data to your clipboard.</p>
                    <button
                        onClick={handleCopy}
                        className={`mt-2 w-full flex items-center justify-center gap-2 text-sm font-medium py-2 px-3 rounded-md transition-all ${
                            isCopied
                            ? 'bg-emerald-100 dark:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300'
                            : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                        }`}
                    >
                        {isCopied ? (
                            <>
                                <CheckIcon className="w-4 h-4" />
                                Copied to clipboard!
                            </>
                        ) : (
                            <>
                                <CopyIcon className="w-4 h-4" />
                                Copy JSON
                            </>
                        )}
                    </button>
                </Step>
                <Step number={2} title="Open the Plugin in Figma">
                    <p>If you haven't already, install the ChromaGen plugin from the Figma Community.</p>
                     <a
                        href={figmaPluginUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="mt-2 w-full flex items-center justify-center gap-2 text-sm font-medium py-2 px-3 rounded-md transition-all bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200"
                    >
                        <ExternalLinkIcon className="w-4 h-4" />
                        Go to Figma Community
                    </a>
                </Step>
                <Step number={3} title="Paste and Apply">
                    <p>In Figma, run the ChromaGen plugin, paste the copied data into the text area, and click "Apply to Selection".</p>
                </Step>
            </div>
            <div className="flex justify-end p-4 bg-gray-50 dark:bg-gray-800/50 border-t border-gray-200 dark:border-gray-700 rounded-b-xl">
              <button
                onClick={onClose}
                className="bg-indigo-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 dark:focus:ring-offset-gray-900"
              >
                Done
              </button>
            </div>
          </div>
        </div>
    );
};
