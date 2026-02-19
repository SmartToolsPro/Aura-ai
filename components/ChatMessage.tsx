import React from 'react';
import { Message } from '../types';
import { Sparkles } from 'lucide-react';

interface ChatMessageProps {
  message: Message;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message }) => {
  const isUser = message.role === 'user';

  return (
    <div className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}>
      <div className={`flex max-w-[85%] sm:max-w-[75%] gap-3 ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>
        
        {!isUser && (
          <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white flex items-center justify-center mt-1">
            <Sparkles className="w-4 h-4 text-black" />
          </div>
        )}

        <div 
          className={`px-5 py-3.5 rounded-3xl text-[15px] leading-relaxed relative
            ${isUser 
              ? 'bg-surface border border-border text-white rounded-tr-sm' 
              : 'bg-transparent text-white/90'
            }
            ${message.isError ? 'text-red-400 border-red-900/50 bg-red-950/20' : ''}
          `}
        >
          {message.text.split('\n').map((line, i) => (
             <React.Fragment key={i}>
                {line}
                {i < message.text.split('\n').length - 1 && <br />}
             </React.Fragment>
          ))}
        </div>
      </div>
    </div>
  );
};