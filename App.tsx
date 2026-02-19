import React, { useState, useCallback } from 'react';
import { AppMode, Message } from './types';
import { Header } from './components/Header';
import { Orb } from './components/Orb';
import { FeatureCards } from './components/FeatureCards';
import { ChatInput } from './components/ChatInput';
import { ChatList } from './components/ChatList';
import { ImageGenerator } from './components/ImageGenerator';
import { NewsFeed } from './components/NewsFeed';
import { DataAnalyzer } from './components/DataAnalyzer';
import { sendChatMessage } from './services/geminiService';

const App: React.FC = () => {
  const [currentMode, setCurrentMode] = useState<AppMode>(AppMode.HOME);
  const [messages, setMessages] = useState<Message[]>([]);
  const [isChatLoading, setIsChatLoading] = useState(false);
  const [isOrbActive, setIsOrbActive] = useState(false);

  // Note: Using an empty array [] in useEffect ensures the API instance is created only when needed via the service.
  // The service implementation fetches process.env.API_KEY dynamically simulating the environment injection.

  const handleReset = useCallback(() => {
    setCurrentMode(AppMode.HOME);
    setMessages([]);
    setIsOrbActive(false);
  }, []);

  const handleSelectFeature = useCallback((mode: AppMode) => {
    setCurrentMode(mode);
    setIsOrbActive(false);
  }, []);

  const handleOrbClick = useCallback(() => {
    if (currentMode !== AppMode.HOME) {
      setCurrentMode(AppMode.HOME);
    }
    setIsOrbActive(true);
  }, [currentMode]);

  const handleCloseOrb = useCallback(() => {
    setIsOrbActive(false);
  }, []);

  const handleSendMessage = useCallback(async (text: string) => {
    if (currentMode === AppMode.HOME) {
      setCurrentMode(AppMode.CHAT);
    }
    
    const newUserMsg: Message = { id: Date.now().toString(), role: 'user', text, timestamp: Date.now() };
    setMessages(prev => [...prev, newUserMsg]);
    setIsChatLoading(true);

    try {
      // Basic implementation without full history preservation for simplicity
      const responseText = await sendChatMessage([], text);
      const newModelMsg: Message = { id: (Date.now() + 1).toString(), role: 'model', text: responseText, timestamp: Date.now() };
      setMessages(prev => [...prev, newModelMsg]);
    } catch (error: any) {
      const errorMsg: Message = { 
        id: (Date.now() + 1).toString(), 
        role: 'model', 
        text: error.message || "An error occurred.", 
        timestamp: Date.now(),
        isError: true
      };
      setMessages(prev => [...prev, errorMsg]);
    } finally {
      setIsChatLoading(false);
    }
  }, [currentMode]);

  return (
    <div className="flex flex-col h-full w-full bg-background text-white font-sans overflow-hidden">
      <Header onReset={handleReset} />

      {/* Main Dynamic Content Area */}
      <main className="flex-1 relative flex flex-col items-center justify-start overflow-hidden w-full">
        
        {/* HOME STATE & VOICE STATE */}
        {(currentMode === AppMode.HOME || isOrbActive) && (
          <div className="absolute inset-0 flex flex-col items-center justify-center w-full z-10 px-4 pt-10 pb-32">
            <Orb 
              isActive={isOrbActive} 
              onClick={handleOrbClick} 
              onClose={handleCloseOrb}
            />
            
            <div className="mt-12 w-full flex justify-center">
              <FeatureCards 
                onSelectFeature={handleSelectFeature} 
                isVisible={!isOrbActive && messages.length === 0} 
              />
            </div>
          </div>
        )}

        {/* SPECIFIC FEATURE VIEWS */}
        <div className={`absolute inset-0 z-20 flex flex-col bg-background transition-opacity duration-500 ease-in-out
          ${currentMode !== AppMode.HOME && !isOrbActive ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'}
        `}>
          {currentMode === AppMode.CHAT && (
            <div className="flex flex-col h-full w-full">
               <ChatList messages={messages} isLoading={isChatLoading} />
               <div className="shrink-0 bg-background/80 backdrop-blur-md">
                 <ChatInput onSendMessage={handleSendMessage} disabled={isChatLoading} />
               </div>
            </div>
          )}
          {currentMode === AppMode.IMAGE_GEN && <ImageGenerator />}
          {currentMode === AppMode.NEWS && <NewsFeed />}
          {currentMode === AppMode.DATA_ANALYSIS && <DataAnalyzer />}
        </div>

      </main>

      {/* Persistent Bottom Bar (Only visible in HOME state before any action) */}
      <div className={`shrink-0 w-full absolute bottom-0 z-30 bg-gradient-to-t from-black via-black/80 to-transparent pt-10 pb-4 transition-transform duration-500
         ${currentMode === AppMode.HOME && !isOrbActive ? 'translate-y-0' : 'translate-y-full opacity-0 pointer-events-none'}
      `}>
        <ChatInput onSendMessage={handleSendMessage} />
      </div>

    </div>
  );
};

export default App;