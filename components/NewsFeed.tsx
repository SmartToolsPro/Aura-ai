import React, { useState, useEffect } from 'react';
import { Globe, ExternalLink, RefreshCw } from 'lucide-react';
import { fetchLatestNews } from '../services/geminiService';
import { NewsItem } from '../types';
import { ChatInput } from './ChatInput';

export const NewsFeed: React.FC = () => {
  const [news, setNews] = useState<{ summary: string, links: NewsItem[] } | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const loadNews = async (topic?: string) => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await fetchLatestNews(topic);
      setNews(data);
    } catch (err: any) {
      setError(err.message || "Failed to load news");
    } finally {
      setIsLoading(false);
    }
  };

  // Initial load
  useEffect(() => {
    loadNews();
  }, []);

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="flex items-center justify-between mb-8 border-b border-border pb-6">
          <div className="flex items-center gap-3">
             <div className="p-2.5 bg-surface rounded-full">
                <Globe className="w-6 h-6 text-white/80" />
             </div>
             <h2 className="text-2xl font-light">Latest News</h2>
          </div>
          <button 
            onClick={() => loadNews()} 
            disabled={isLoading}
            className={`p-2 rounded-full hover:bg-surface transition-colors ${isLoading ? 'animate-spin text-white/30' : 'text-white/70'}`}
          >
            <RefreshCw className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {isLoading ? (
          <div className="space-y-6">
             <div className="h-24 bg-surface rounded-2xl animate-pulse"></div>
             <div className="grid gap-4">
                {[1, 2, 3].map(i => (
                  <div key={i} className="h-16 bg-surface rounded-2xl animate-pulse delay-75"></div>
                ))}
             </div>
          </div>
        ) : news ? (
          <div className="space-y-8 pb-20">
            {/* Summary Card */}
            <div className="p-6 rounded-3xl bg-surface border border-border">
               <h3 className="text-sm uppercase tracking-widest text-white/50 mb-3 font-semibold">AI Summary</h3>
               <p className="text-white/90 leading-relaxed text-[15px] whitespace-pre-wrap">
                 {news.summary}
               </p>
            </div>

            {/* Sources List */}
            {news.links && news.links.length > 0 && (
              <div className="space-y-3">
                <h3 className="text-sm uppercase tracking-widest text-white/50 mb-3 font-semibold pl-2">Sources</h3>
                {news.links.map((link, idx) => (
                  <a 
                    key={idx} 
                    href={link.uri} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="flex items-center justify-between p-4 rounded-2xl bg-surface/50 border border-transparent hover:bg-surface hover:border-border transition-all group"
                  >
                    <span className="text-[15px] font-medium text-white/80 group-hover:text-white truncate pr-4">
                      {link.title}
                    </span>
                    <ExternalLink className="w-4 h-4 text-white/30 group-hover:text-white/70 shrink-0" />
                  </a>
                ))}
              </div>
            )}
          </div>
        ) : null}
      </div>
      
      <div className="shrink-0 bg-background/80 backdrop-blur-md">
         <ChatInput onSendMessage={(topic) => loadNews(topic)} disabled={isLoading} placeholder="Ask for news about a specific topic..." />
      </div>
    </div>
  );
};