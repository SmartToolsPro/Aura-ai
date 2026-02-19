import React from 'react';
import { Menu, Plus } from 'lucide-react';

interface HeaderProps {
  onReset: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onReset }) => {
  return (
    <header className="flex items-center justify-between px-6 py-4 w-full z-50">
      <button 
        className="p-2 -ml-2 text-white/70 hover:text-white transition-colors"
        aria-label="Menu"
      >
        <Menu className="w-6 h-6" strokeWidth={1.5} />
      </button>
      
      <button 
        onClick={onReset}
        className="text-xl font-light tracking-widest hover:opacity-80 transition-opacity flex items-center gap-2"
      >
        AURA
      </button>

      <button 
        onClick={onReset}
        className="p-2 -mr-2 text-white/70 hover:text-white transition-colors"
        aria-label="New Chat"
      >
        <Plus className="w-6 h-6" strokeWidth={1.5} />
      </button>
    </header>
  );
};