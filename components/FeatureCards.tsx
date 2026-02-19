import React from 'react';
import { Image as ImageIcon, Globe, MessageCircle, BarChart2 } from 'lucide-react';
import { AppMode } from '../types';

interface FeatureCardsProps {
  onSelectFeature: (mode: AppMode) => void;
  isVisible: boolean;
}

const features = [
  { id: AppMode.IMAGE_GEN, title: 'Create Image', icon: ImageIcon },
  { id: AppMode.NEWS, title: 'Latest News', icon: Globe },
  { id: AppMode.CHAT, title: 'Get Advice', icon: MessageCircle },
  { id: AppMode.DATA_ANALYSIS, title: 'Analyze Data', icon: BarChart2 },
];

export const FeatureCards: React.FC<FeatureCardsProps> = ({ onSelectFeature, isVisible }) => {
  return (
    <div 
      className={`grid grid-cols-2 gap-4 w-full max-w-md px-6 transition-all duration-500 ease-in-out transform
        ${isVisible ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-10 scale-95 pointer-events-none absolute'}
      `}
    >
      {features.map((feature, index) => (
        <button
          key={feature.id}
          onClick={() => onSelectFeature(feature.id)}
          className="flex flex-col items-center justify-center gap-3 p-6 rounded-3xl bg-surface border border-border hover:bg-surfaceHover transition-all hover:scale-[1.02] active:scale-95 group"
          style={{ transitionDelay: isVisible ? `${index * 50}ms` : '0ms' }}
        >
          <div className="p-3 rounded-full bg-white/5 text-white/80 group-hover:text-white group-hover:bg-white/10 transition-colors">
            <feature.icon className="w-6 h-6" strokeWidth={1.5} />
          </div>
          <span className="text-sm font-medium text-white/80 group-hover:text-white">{feature.title}</span>
        </button>
      ))}
    </div>
  );
};