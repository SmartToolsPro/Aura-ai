import React, { useEffect, useRef } from 'react';
import { Message } from '../types';
import { ChatMessage } from './ChatMessage';

interface ChatListProps {
  messages: Message[];
  isLoading: boolean;
}

export const ChatList: React.FC<ChatListProps> = ({ messages, isLoading }) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (messages.length === 0 && !isLoading) {
    return (
      <div className="flex-1 flex items-center justify-center opacity-50">
        <p className="text-sm">Start a conversation...</p>
      </div>
    );
  }

  return (
    <div className="flex-1 overflow-y-auto px-4 sm:px-6 w-full max-w-3xl mx-auto no-scrollbar pt-6">
      {messages.map((msg) => (
        <ChatMessage key={msg.id} message={msg} />
      ))}
      
      {isLoading && (
        <div className="flex w-full mb-6 justify-start">
           <div className="flex gap-3">
              <div className="flex-shrink-0 w-8 h-8 rounded-full bg-white/10 animate-pulse flex items-center justify-center mt-1">
                 <div className="w-3 h-3 bg-white/50 rounded-full"></div>
              </div>
              <div className="px-5 py-4 rounded-3xl bg-transparent">
                 <div className="flex gap-1.5 items-center h-full">
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce"></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '150ms' }}></div>
                    <div className="w-1.5 h-1.5 rounded-full bg-white/40 animate-bounce" style={{ animationDelay: '300ms' }}></div>
                 </div>
              </div>
           </div>
        </div>
      )}
      <div ref={bottomRef} className="h-4" />
    </div>
  );
};