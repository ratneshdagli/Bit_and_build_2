"use client"

import React, { useState, useEffect } from 'react';
import { type Palette } from '@/lib/types';
import { generateShareableUrl } from '@/lib/services/urlService';
import { copyToClipboard } from '@/lib/services/exportService';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  palette: Palette;
}

export const ShareModal: React.FC<ShareModalProps> = ({ isOpen, onClose, palette }) => {
  const [shareUrl, setShareUrl] = useState('');
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (isOpen) {
      const url = generateShareableUrl(palette);
      setShareUrl(url);
    }
  }, [isOpen, palette]);

  const handleCopy = async () => {
    const success = await copyToClipboard(shareUrl);
    if (success) {
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `ChromaGen Palette: ${palette.paletteName}`,
          text: `Check out this beautiful color palette: ${palette.paletteName}`,
          url: shareUrl
        });
      } catch (err) {
        // User cancelled or error occurred
        console.log('Share cancelled or failed:', err);
      }
    } else {
      // Fallback to copy
      handleCopy();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl border border-gray-200 dark:border-gray-700 w-full max-w-lg">
        <div className="flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">
            Share Palette
          </h2>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200"
            aria-label="Close share modal"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div className="p-6">
          <div className="mb-4">
            <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
              {palette.paletteName}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400">
              Share this palette with others. They'll be able to view and use it in ChromaGen.
            </p>
          </div>

          {/* Palette Preview */}
          <div className="mb-6">
            <div className="flex rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
              {palette.colors.map((color, index) => (
                <div
                  key={index}
                  className="flex-1 h-16 flex flex-col justify-end p-2"
                  style={{ backgroundColor: color.hex }}
                >
                  <div className="bg-black/20 backdrop-blur-sm rounded p-1">
                    <p className="text-white text-xs font-medium truncate">{color.role}</p>
                    <p className="text-white text-xs font-mono">{color.hex.toUpperCase()}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Share URL */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Shareable Link
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={shareUrl}
                readOnly
                className="flex-1 p-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-mono"
              />
              <button
                onClick={handleCopy}
                className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
                  copied
                    ? 'bg-green-100 dark:bg-green-900/50 text-green-700 dark:text-green-300'
                    : 'bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200'
                }`}
              >
                {copied ? 'Copied!' : 'Copy'}
              </button>
            </div>
          </div>

          {/* Share Buttons */}
          <div className="flex gap-3">
            {navigator.share && (
              <button
                onClick={handleShare}
                className="flex-1 flex items-center justify-center gap-2 bg-blue-600 text-white font-medium py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.367 2.684 3 3 0 00-5.367-2.684z" />
                </svg>
                Share
              </button>
            )}
            
            <button
              onClick={handleCopy}
              className="flex-1 flex items-center justify-center gap-2 bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-200 font-medium py-2 px-4 rounded-lg transition-colors"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
              </svg>
              Copy Link
            </button>
          </div>

          <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <p className="text-sm text-blue-700 dark:text-blue-300">
              <strong>Tip:</strong> Anyone with this link can view and use your palette. The link includes all color information and can be opened directly in ChromaGen.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
