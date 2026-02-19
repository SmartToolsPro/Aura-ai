import React, { useState, useRef, useEffect } from 'react';
import { Sparkles, Paperclip, Mic, ArrowUp } from 'lucide-react';

interface ChatInputProps {
  onSendMessage: (text: string) => void;
  onFileUpload?: (file: File) => void;
  placeholder?: string;
  disabled?: boolean;
}

export const ChatInput: React.FC<ChatInputProps> = ({ 
  onSendMessage, 
  onFileUpload, 
  placeholder = "Message Aura...", 
  disabled = false 
}) => {
  const [input, setInput] = useState('');
  const fileInputRef = useRef<HTMLInputElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    if (input.trim() && !disabled) {
      onSendMessage(input.trim());
      setInput('');
      if (textareaRef.current) {
         textareaRef.current.style.height = 'auto'; // Reset height
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && onFileUpload) {
      onFileUpload(file);
    }
    // Reset input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  }, [input]);

  return (
    <div className="w-full max-w-3xl mx-auto px-4 pb-6 pt-2">
      <form 
        onSubmit={handleSubmit}
        className="relative flex items-end gap-2 bg-surface border border-border rounded-[2rem] p-2 pl-4 transition-all focus-within:border-white/30 focus-within:bg-surfaceHover"
      >
        <div className="flex items-center justify-center pb-2 text-white/50">
          <Sparkles className="w-5 h-5" />
        </div>

        <textarea
          ref={textareaRef}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          disabled={disabled}
          rows={1}
          className="flex-1 bg-transparent border-none outline-none resize-none text-white placeholder-white/40 max-h-[120px] py-2.5 px-2 text-base leading-relaxed no-scrollbar"
        />

        <div className="flex items-center gap-1 pb-1 pr-1">
          {onFileUpload && (
            <>
              <input 
                type="file" 
                ref={fileInputRef} 
                onChange={handleFileChange} 
                className="hidden" 
                accept=".csv,.txt,.pdf"
              />
              <button 
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
                disabled={disabled}
              >
                <Paperclip className="w-5 h-5" />
              </button>
            </>
          )}
          <button 
            type="button"
            className="p-2 text-white/50 hover:text-white hover:bg-white/10 rounded-full transition-colors"
            disabled={disabled}
          >
            <Mic className="w-5 h-5" />
          </button>
          <button 
            type="submit"
            disabled={!input.trim() || disabled}
            className={`p-2 rounded-full transition-all flex items-center justify-center
              ${input.trim() && !disabled ? 'bg-white text-black hover:scale-105' : 'bg-white/10 text-white/30 cursor-not-allowed'}
            `}
          >
            <ArrowUp className="w-5 h-5" strokeWidth={2.5} />
          </button>
        </div>
      </form>
    </div>
  );
};