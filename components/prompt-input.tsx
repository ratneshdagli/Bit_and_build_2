"use client"

import React, { useState, useCallback } from 'react';
// Simple enhancer icon (magic wand)
const EnhancerIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 20 20" fill="currentColor" {...props}><path d="M7.293 14.707a1 1 0 001.414 0l6-6a1 1 0 00-1.414-1.414l-6 6a1 1 0 000 1.414z"/><path d="M3 8a1 1 0 011-1h1V6a1 1 0 112 0v1h1a1 1 0 110 2H7v1a1 1 0 11-2 0V9H4a1 1 0 01-1-1z"/></svg>
);
import { SparklesIcon, UploadIcon, XIcon } from './icons';

interface PromptInputProps {
  onGenerate: (data: { text?: string, image?: File }) => void;
  isLoading: boolean;
}

type ActiveTab = 'text' | 'image' | 'combined';

const ImageUploader: React.FC<{
  image: { file: File; preview: string } | null;
  onImageChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  onRemoveImage: () => void;
}> = ({ image, onImageChange, onRemoveImage }) => (
  <div>
    {image ? (
      <div className="relative group rounded-xl overflow-hidden">
        <img src={image.preview} alt="Prompt image preview" className="w-full max-h-64 object-contain rounded-xl bg-muted shadow-lg" />
        <button
          type="button"
          onClick={onRemoveImage}
          className="absolute top-3 right-3 bg-black/60 text-white rounded-full p-2 opacity-0 group-hover:opacity-100 transition-all duration-200 focus:opacity-100 hover:bg-black/80 hover:scale-110 focus-ring"
          aria-label="Remove image"
        >
          <XIcon className="w-5 h-5" />
        </button>
      </div>
    ) : (
      <label htmlFor="image-upload" className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-border rounded-xl cursor-pointer bg-muted/30 hover:bg-muted/50 transition-all duration-200 hover:border-primary/50 group">
        <div className="flex flex-col items-center justify-center pt-5 pb-6 group-hover:scale-105 transition-transform duration-200">
          <UploadIcon className="w-10 h-10 mb-3 text-muted-foreground group-hover:text-primary transition-colors duration-200" />
          <p className="mb-2 text-sm text-center text-muted-foreground"><span className="font-semibold">Click to upload</span></p>
          <p className="text-xs text-muted-foreground">PNG, JPG, WEBP (MAX. 4MB)</p>
        </div>
        <input id="image-upload" type="file" className="hidden" accept="image/png, image/jpeg, image/webp" onChange={onImageChange} />
      </label>
    )}
  </div>
);

export const PromptInput: React.FC<PromptInputProps> = ({ onGenerate, isLoading }) => {
  const [activeTab, setActiveTab] = useState<ActiveTab>('text');
  const [prompt, setPrompt] = useState<string>('');
  const [image, setImage] = useState<{ file: File; preview: string; } | null>(null);
  const [projectContext, setProjectContext] = useState<string>('');

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 4 * 1024 * 1024) { // 4MB limit
        alert("Image size should not exceed 4MB.");
        return;
      }
      if (image) {
        URL.revokeObjectURL(image.preview);
      }
      setImage({
        file,
        preview: URL.createObjectURL(file),
      });
    }
  };

  const removeImage = () => {
    if (image) {
      URL.revokeObjectURL(image.preview);
    }
    setImage(null);
    const input = document.getElementById('image-upload') as HTMLInputElement;
    if (input) {
        input.value = '';
    }
  };

  const handleSubmit = useCallback(async (event: React.FormEvent) => {
    event.preventDefault();
    if (isLoading) return;

    switch (activeTab) {
      case 'text':
        if (prompt.trim()) onGenerate({ text: prompt });
        break;
      case 'image':
        if (image) onGenerate({ image: image.file });
        break;
      case 'combined':
        if (prompt.trim() && image) onGenerate({ text: prompt, image: image.file });
        break;
    }
  }, [prompt, image, activeTab, onGenerate, isLoading]);
  
  const isSubmitDisabled = isLoading || 
    (activeTab === 'text' && !prompt.trim()) || 
    (activeTab === 'image' && !image) ||
    (activeTab === 'combined' && (!prompt.trim() || !image));

  const TabButton: React.FC<{tabName: ActiveTab, label: string}> = ({ tabName, label }) => (
    <button
      type="button"
      onClick={() => setActiveTab(tabName)}
      className={`${
        activeTab === tabName
          ? 'border-primary text-primary font-semibold'
          : 'border-transparent text-muted-foreground hover:text-foreground hover:border-border'
      } whitespace-nowrap py-3 px-2 border-b-2 font-medium text-sm transition-all duration-200 hover:scale-105`}
    >
      {label}
    </button>
  );

  return (
    <div className="glass p-8 rounded-2xl shadow-2xl border border-border/50">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="project-context" className="block text-sm font-semibold text-foreground mb-3">
            What are you making?
          </label>
          <input
            id="project-context"
            type="text"
            value={projectContext}
            onChange={e => setProjectContext(e.target.value)}
            placeholder="e.g. Website, Mobile App, Brand Identity, Dashboard..."
            className="w-full p-4 bg-background/50 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 backdrop-blur-sm shadow-sm focus:shadow-md"
          />
        </div>
        <div className="border-b border-border/50">
          <nav className="-mb-px flex space-x-8" aria-label="Tabs">
            <TabButton tabName="text" label="Text Prompt" />
            <TabButton tabName="image" label="Image Upload" />
            <TabButton tabName="combined" label="Text + Image" />
          </nav>
        </div>

        <div>
          {activeTab === 'text' && (
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="e.g., A calming palette for a yoga studio website"
              className="w-full h-40 p-4 text-base bg-background/50 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 backdrop-blur-sm shadow-sm focus:shadow-md resize-none"
              disabled={isLoading}
            />
          )}

          {activeTab === 'image' && (
            <ImageUploader image={image} onImageChange={handleImageChange} onRemoveImage={removeImage} />
          )}

          {activeTab === 'combined' && (
            <div className="space-y-4">
               <textarea
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                placeholder="e.g., Make it more vibrant and energetic"
                className="w-full h-32 p-4 text-base bg-background/50 border border-input rounded-xl focus:ring-2 focus:ring-ring focus:border-ring transition-all duration-200 backdrop-blur-sm shadow-sm focus:shadow-md resize-none"
                disabled={isLoading}
              />
              <ImageUploader image={image} onImageChange={handleImageChange} onRemoveImage={removeImage} />
            </div>
          )}
        </div>

        <div className="flex items-center gap-2 w-full">
          <button
            type="submit"
            disabled={isSubmitDisabled}
            className="flex-1 flex items-center justify-center gap-3 bg-primary text-primary-foreground font-bold py-4 px-6 rounded-xl hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-ring disabled:bg-muted disabled:text-muted-foreground disabled:cursor-not-allowed transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-[1.02] active:scale-[0.98]"
          >
            {isLoading ? (
              <>
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-foreground"></div>
                Generating...
              </>
            ) : (
              <>
                <SparklesIcon className="w-5 h-5" />
                Generate Palette
              </>
            )}
          </button>
        </div>

      </form>
    </div>
  );
};
