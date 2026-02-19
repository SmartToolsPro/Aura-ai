import React, { useState } from 'react';
import { BarChart2, FileText, File as FileIcon } from 'lucide-react';
import { analyzeDataFile } from '../services/geminiService';
import { FileData } from '../types';
import { ChatInput } from './ChatInput';

export const DataAnalyzer: React.FC = () => {
  const [fileData, setFileData] = useState<FileData | null>(null);
  const [analysis, setAnalysis] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileUpload = (file: File) => {
    setError(null);
    
    // Check file type
    if (!file.name.endsWith('.csv') && !file.name.endsWith('.txt')) {
      setError("Please upload a .csv or .txt file.");
      return;
    }

    const reader = new FileReader();
    reader.onload = async (e) => {
      const text = e.target?.result;
      if (typeof text === 'string') {
        const newData = { name: file.name, content: text, type: file.type };
        setFileData(newData);
        setAnalysis(null); // Reset previous analysis
      }
    };
    reader.onerror = () => {
      setError("Failed to read the file.");
    };
    reader.readAsText(file);
  };

  const handleAnalyze = async (prompt: string) => {
    if (!fileData) return;
    setIsLoading(true);
    setError(null);
    try {
      const result = await analyzeDataFile(fileData.content, prompt);
      setAnalysis(result);
    } catch (err: any) {
      setError(err.message || "Failed to analyze data");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl mx-auto">
      <div className="flex-1 overflow-y-auto p-6 no-scrollbar">
        <div className="mb-8 text-center pt-8">
          <div className="inline-flex items-center justify-center p-4 bg-surface rounded-full mb-4">
             <BarChart2 className="w-8 h-8 text-white/80" />
          </div>
          <h2 className="text-2xl font-light mb-2">Analyze Data</h2>
          <p className="text-white/50 text-sm">Upload a CSV or Text file and ask Aura to extract insights.</p>
        </div>

        {error && (
          <div className="p-4 mb-6 rounded-xl bg-red-950/30 border border-red-900/50 text-red-400 text-sm text-center">
            {error}
          </div>
        )}

        {/* File Status */}
        <div className={`p-6 rounded-3xl border transition-all duration-300 flex items-center gap-4 mb-8
          ${fileData ? 'bg-surface border-border' : 'bg-transparent border-dashed border-white/20'}
        `}>
          <div className={`p-3 rounded-full ${fileData ? 'bg-white/10 text-white' : 'bg-transparent text-white/30'}`}>
            {fileData?.name.endsWith('.csv') ? <BarChart2 className="w-6 h-6" /> : <FileText className="w-6 h-6" />}
          </div>
          <div className="flex-1">
            <h3 className="text-sm font-medium text-white">{fileData ? fileData.name : 'No file uploaded'}</h3>
            <p className="text-xs text-white/40 mt-1">
              {fileData ? `${(fileData.content.length / 1024).toFixed(1)} KB loaded` : 'Use the paperclip icon below to attach a file.'}
            </p>
          </div>
        </div>

        {/* Analysis Result */}
        {isLoading && (
          <div className="p-6 rounded-3xl bg-surface border border-border animate-pulse">
            <div className="h-4 bg-white/10 rounded w-1/3 mb-4"></div>
            <div className="space-y-2">
              <div className="h-3 bg-white/5 rounded w-full"></div>
              <div className="h-3 bg-white/5 rounded w-[90%]"></div>
              <div className="h-3 bg-white/5 rounded w-[95%]"></div>
            </div>
          </div>
        )}

        {analysis && !isLoading && (
          <div className="p-6 rounded-3xl bg-surface border border-border pb-20">
             <h3 className="text-sm uppercase tracking-widest text-white/50 mb-4 font-semibold">Insights</h3>
             <div className="prose prose-invert prose-sm max-w-none text-white/90 leading-relaxed whitespace-pre-wrap">
               {analysis}
             </div>
          </div>
        )}
      </div>
      
      <div className="shrink-0 bg-background/80 backdrop-blur-md">
         <ChatInput 
            onSendMessage={handleAnalyze} 
            onFileUpload={handleFileUpload}
            disabled={isLoading || !fileData} 
            placeholder={fileData ? "Ask a question about your data..." : "Upload a file first..."} 
         />
      </div>
    </div>
  );
};