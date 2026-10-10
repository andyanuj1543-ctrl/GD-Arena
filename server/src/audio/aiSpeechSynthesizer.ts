import { GoogleGenAI } from '@google/genai';
import { config } from '../config/index.js';
import { logger } from '../utils/logger.js';

const ai = config.geminiApiKey ? new GoogleGenAI({ apiKey: config.geminiApiKey }) : null;

export const aiSpeechSynthesizer = {
  async synthesize(text: string, voiceId: string, style?: string): Promise<string | null> {
    if (!ai) {
      logger.warn('No Gemini API key, skipping synthesis');
      return null;
    }
    
    try {
      // Assuming generation using flash-tts or equivalent interactions API setup
      // Note: exact API structure for SDK v2.25.0+ may vary slightly.
      const response = await ai.models.generateContent({
        model: 'gemini-3.8-flash-tts',
        contents: text,
        config: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: {
                voiceName: voiceId
              }
            }
          }
        }
      });
      
      // Look for audio part
      const audioPart = response.candidates?.[0]?.content?.parts?.find((p: any) => p.inlineData && p.inlineData.mimeType.startsWith('audio/'));
      if (audioPart && audioPart.inlineData && audioPart.inlineData.data) {
        return audioPart.inlineData.data; // Base64 audio string
      }
      return null;
    } catch (err) {
      logger.error('Error in speech synthesis:', err);
      return null;
    }
  }
};
