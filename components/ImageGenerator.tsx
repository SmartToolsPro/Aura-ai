import React, { useState } from 'react';
import { Download, Image as ImageIcon } from 'lucide-react';
import { generateImage } from '../services/geminiService';
import { GeneratedImage } from '../types';
import { ChatInput } from './ChatInput';

export const ImageGenerator: React.FC = () => {
  const [images, setImages] = useState<GeneratedImage[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async (prompt: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const url = await generateImage(prompt);
      const newImage: GeneratedImage = {
        id: Date.now().toString(),
        url,
        prompt
      };
      setImages(prev => [newImage, ...prev]);
    } catch (err: any) {
      setError(err.message || "Failed to generate image");
    } finally {
      setIsLoading(false);
    }
  };

  const handleDownload = (url: string, id: string) => {
    const a = document.createElement('a');
    a.href = url;
    a.download = `aura-generated-${id}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="mb-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-surface rounded-full mb-4">
             <ImageIcon className="w-8 h-8 text-white/80" />
          </div>
          <h2 className="text-2xl font-light mb-2">Create an Image</h2>
          <p className="text-white/50 text-sm">Describe what you want to see, and Aura will generate it.</p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {isLoading && (
          <div className="w-full aspect-square max-w-md mx-auto rounded-3xl bg-surface border border-border flex items-center justify-center mb-8 animate-pulse">
             <div className="flex flex-col items-center gap-4 text-white/40">
                <ImageIcon className="w-8 h-8 animate-bounce" />
                <span className="text-sm font-medium tracking-widest uppercase">Generating...</span>
             </div>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-20">
          {images.map((img) => (
            <div key={img.id} className="group relative rounded-3xl overflow-hidden bg-surface border border-border">
              <img src={img.url} alt={img.prompt} className="w-full h-auto object-cover transition-transform duration-700 group-hover:scale-105" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-4">
                <p className="text-sm text-white line-clamp-2 mb-3 font-medium">{img.prompt}</p>
                <button 
                  onClick={() => handleDownload(img.url, img.id)}
                  className="self-end p-2 bg-white text-black rounded-full hover:scale-105 transition-transform"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <div className="shrink-0 bg-background/80 backdrop-blur-md">
         <ChatInput onSendMessage={handleGenerate} disabled={isLoading} placeholder="Describe the image to generate..." />
      </div>
    </div>
  );
};