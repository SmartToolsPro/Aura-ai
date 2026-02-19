export enum AppMode {
  HOME = 'HOME',
  CHAT = 'CHAT',
  IMAGE_GEN = 'IMAGE_GEN',
  NEWS = 'NEWS',
  DATA_ANALYSIS = 'DATA_ANALYSIS'
}

export interface Message {
  id: string;
  role: 'user' | 'model';
  text: string;
  timestamp: number;
  isError?: boolean;
}

export interface GeneratedImage {
  url: string;
  prompt: string;
  id: string;
}

export interface NewsItem {
  title: string;
  uri: string;
  snippet?: string;
}

export interface FileData {
  name: string;
  content: string;
  type: string;
}