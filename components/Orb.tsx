import React, { useState, useEffect, useCallback } from 'react';
import { Mic, Sparkles, X } from 'lucide-react';
import { voiceAssistantConverse } from '../services/geminiService';

interface OrbProps {
  isActive: boolean;
  onClick: () => void;
  onClose?: () => void;
}

// Ensure TypeScript knows about standard web speech APIs
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}

export const Orb: React.FC<OrbProps> = ({ isActive, onClick, onClose }) => {
  const [isListening, setIsListening] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [recognitionInstance, setRecognitionInstance] = useState<any>(null);

  useEffect(() => {
    // Initialize speech recognition
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      const recognition = new SpeechRecognition();
      recognition.continuous = false;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => setIsListening(true);
      
      recognition.onresult = (event: any) => {
        let currentTranscript = '';
        for (let i = event.resultIndex; i < event.results.length; i++) {
          currentTranscript += event.results[i][0].transcript;
        }
        setTranscript(currentTranscript);
      };

      recognition.onerror = (event: any) => {
        console.error("Speech recognition error", event.error);
        setIsListening(false);
        setIsProcessing(false);
      };

      recognition.onend = () => {
        setIsListening(false);
        // Process the final transcript if we have one and it wasn't aborted manually
        if (transcript) {
           processVoiceCommand(transcript);
        }
      };

      setRecognitionInstance(recognition);
    }
  }, [transcript]);

  const processVoiceCommand = async (text: string) => {
    if (!text.trim()) return;
    setIsProcessing(true);
    try {
      const responseText = await voiceAssistantConverse(text);
      setTranscript(responseText); // Show what it's saying
      speakResponse(responseText);
    } catch (error) {
      setTranscript("Sorry, I encountered an error.");
      setIsProcessing(false);
    }
  };

  const speakResponse = (text: string) => {
    if (!('speechSynthesis' in window)) {
      setIsProcessing(false);
      return;
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.onstart = () => {
      setIsSpeaking(true);
      setIsProcessing(false);
    };
    utterance.onend = () => {
      setIsSpeaking(false);
      setTranscript(''); // Clear transcript after speaking
      
      // Optionally auto-close or go back to idle state after speaking
      if (onClose) {
          setTimeout(onClose, 1000);
      }
    };
    utterance.onerror = () => {
      setIsSpeaking(false);
      setIsProcessing(false);
    };

    window.speechSynthesis.speak(utterance);
  };

  const stopEverything = useCallback(() => {
    if (recognitionInstance && isListening) {
      recognitionInstance.stop();
    }
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    setIsListening(false);
    setIsProcessing(false);
    setIsSpeaking(false);
    setTranscript('');
    if (onClose) onClose();
  }, [recognitionInstance, isListening, onClose]);

  const handleOrbClick = () => {
    if (isActive) {
      if (isListening || isSpeaking || isProcessing) {
        stopEverything();
      } else if (recognitionInstance) {
        setTranscript('');
        try {
          recognitionInstance.start();
        } catch (e) {
          console.error("Could not start recognition", e);
        }
      }
    } else {
      onClick();
      // Start listening immediately upon activation if available
      setTimeout(() => {
        if (recognitionInstance) {
            setTranscript('');
            try {
              recognitionInstance.start();
            } catch(e) {}
        }
      }, 500);
    }
  };

  // Clean up on unmount
  useEffect(() => {
    return () => {
      if (window.speechSynthesis) window.speechSynthesis.cancel();
      if (recognitionInstance && isListening) recognitionInstance.stop();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <div className={`relative flex flex-col items-center justify-center transition-all duration-700 ease-in-out ${isActive ? 'scale-125 my-12' : 'scale-100'}`}>
      {/* Orb Container */}
      <div className="relative flex items-center justify-center w-32 h-32">
        {/* Animated Rings */}
        <div className={`absolute rounded-full border border-white/20 transition-all duration-1000 ${isActive ? 'w-[150%] h-[150%] animate-ping-slow' : 'w-full h-full'}`}></div>
        <div className={`absolute rounded-full border border-white/10 transition-all duration-1000 delay-150 ${isActive ? 'w-[200%] h-[200%] animate-ping-slow' : 'w-[120%] h-[120%]'}`}></div>
        <div className={`absolute rounded-full border border-white/5 transition-all duration-1000 delay-300 ${isActive ? 'w-[250%] h-[250%] animate-ping-slow' : 'w-[140%] h-[140%]'}`}></div>
        
        {/* Glow behind the core */}
        <div className={`absolute w-20 h-20 rounded-full transition-all duration-500 ${isActive ? 'bg-white/30 blur-2xl' : 'bg-white/10 blur-xl'}`}></div>

        {/* Core Button */}
        <button 
          onClick={handleOrbClick}
          className={`z-10 rounded-full flex items-center justify-center transition-all duration-500 ease-out animate-float
            ${isActive ? 'w-24 h-24 bg-white text-black shadow-[0_0_80px_rgba(255,255,255,0.8)]' : 'w-20 h-20 bg-white/90 text-black shadow-[0_0_40px_rgba(255,255,255,0.5)] hover:scale-105 hover:bg-white'}
          `}
        >
          {isActive ? (
            isListening ? <Mic className="w-8 h-8 animate-pulse text-red-500" /> :
            isProcessing ? <div className="flex gap-1"><div className="w-2 h-2 rounded-full bg-black animate-bounce"></div><div className="w-2 h-2 rounded-full bg-black animate-bounce delay-100"></div><div className="w-2 h-2 rounded-full bg-black animate-bounce delay-200"></div></div> :
            isSpeaking ? <Sparkles className="w-8 h-8 animate-pulse text-blue-500" /> :
            <Mic className="w-8 h-8" />
          ) : (
            <Sparkles className="w-8 h-8" />
          )}
        </button>
      </div>

      {/* Assistant Status/Transcript */}
      {isActive && (
        <div className="mt-16 text-center max-w-xs transition-opacity duration-500">
          <p className="text-white/60 text-sm mb-2 uppercase tracking-widest font-semibold">
            {isListening ? 'Listening...' : isProcessing ? 'Thinking...' : isSpeaking ? 'Aura is speaking' : 'Tap to speak'}
          </p>
          <p className="text-white text-lg font-light leading-relaxed min-h-[3rem]">
            {transcript}
          </p>
          {(isListening || isSpeaking || isProcessing) && (
            <button 
              onClick={stopEverything}
              className="mt-6 mx-auto flex items-center justify-center w-10 h-10 rounded-full bg-white/10 hover:bg-white/20 text-white/70 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
};