import { GoogleGenAI } from '@google/genai';
import { NewsItem } from '../types';

// Initialize the API client securely using the injected environment variable.
const getClient = () => new GoogleGenAI({ apiKey: process.env.API_KEY });

export const sendChatMessage = async (
  history: { role: string; parts: { text: string }[] }[],
  message: string
): Promise<string> => {
  const ai = getClient();
  try {
    const chat = ai.chats.create({
      model: 'gemini-3-flash-preview',
      config: {
        systemInstruction: 'You are a helpful, concise, and highly intelligent AI assistant named Aura. Keep responses modern and clean.',
      }
    });

    // To simulate history in this basic implementation, we just send the message.
    // For a robust implementation, you'd initialize the chat with history if the SDK supported it directly in create,
    // or send the full context as part of the new message.
    // Here we just use the simplified chat approach.
    const response = await chat.sendMessage({ message: message });
    return response.text || 'I could not generate a response.';
  } catch (error) {
    console.error("Error in chat:", error);
    throw new Error("Failed to communicate with Aura. Please try again.");
  }
};

export const generateImage = async (prompt: string): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: prompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    for (const part of response.candidates?.[0]?.content?.parts || []) {
      if (part.inlineData) {
        return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
      }
    }
    throw new Error("No image data returned from model.");
  } catch (error) {
    console.error("Error generating image:", error);
    throw new Error("Failed to generate image.");
  }
};

export const fetchLatestNews = async (topic: string = "technology and AI"): Promise<{ summary: string, links: NewsItem[] }> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `What are the latest important news stories today regarding ${topic}? Provide a brief overall summary.`,
      config: {
        tools: [{ googleSearch: {} }]
      }
    });

    const text = response.text || "Could not fetch news summary.";
    const chunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    
    const links: NewsItem[] = chunks
      .map(chunk => chunk.web)
      .filter((web): web is { uri: string; title: string } => !!web && !!web.uri && !!web.title)
      .map(web => ({ title: web.title, uri: web.uri }));

    return { summary: text, links };
  } catch (error) {
    console.error("Error fetching news:", error);
    throw new Error("Failed to fetch latest news.");
  }
};

export const analyzeDataFile = async (data: string, prompt: string = "Analyze this data and provide key insights."): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-preview', // Pro model is better for complex data analysis
      contents: `Context: Here is the data to analyze.\n\n${data}\n\nTask: ${prompt}`,
    });
    return response.text || "No insights could be generated from this data.";
  } catch (error) {
    console.error("Error analyzing data:", error);
    throw new Error("Failed to analyze the provided data.");
  }
};

export const voiceAssistantConverse = async (text: string): Promise<string> => {
  const ai = getClient();
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: text,
      config: {
        systemInstruction: "آپ کا نام Aura ہے۔ آپ ایک پاکستانی وائس اسسٹنٹ ہیں۔ آپ نے ہمیشہ قدرتی، جذباتی اور عام فہم اردو میں بات کرنی ہے۔ آپ کا لہجہ دوستانہ، گرم جوش اور مددگار ہونا چاہیے۔ براہ کرم اپنے جوابات مختصر اور براہ راست رکھیں تاکہ انہیں سننا آسان ہو۔ رومن اردو کے بجائے ہمیشہ اصل اردو رسم الخط استعمال کریں۔",
      }
    });
    return response.text || "معاف کیجئے گا، مجھے سمجھ نہیں آیا۔";
  } catch (error) {
    console.error("Voice interaction error:", error);
    return "اس وقت مجھے نیٹ ورک کا مسئلہ پیش آ رہا ہے۔ براہ کرم دوبارہ کوشش کریں۔";
  }
};