import { GoogleGenAI } from '@google/genai';
import { logger } from '../utils/logger.js';
import { config } from '../config/index.js';
import { personalities } from './personalities.js';

const ai = config.geminiApiKey ? new GoogleGenAI({ apiKey: config.geminiApiKey }) : null;

export class VoiceManager {
  private voiceCache = new Map<string, string>();

  async initializeVoices() {
    if (!ai) {
      logger.warn('No Gemini API key, skipping voice initialization');
      return;
    }
    
    logger.info('Initializing Voice Design for participants...');
    
    // We could do this in parallel, but sequential avoids rate limits easily
    for (const [id, personality] of Object.entries(personalities)) {
      if (id === 'moderator') continue; // Use prebuilt for moderator usually, or create it if you want
      
      try {
        // Mocking the ai.voices.create since it might not be in types or generally available in all SDK versions perfectly,
        // Assuming SDK v2.25.0+ supports it like this:
        // const response = await ai.voices.create({ prompt: personality.voiceDesignPrompt, store: true });
        // this.voiceCache.set(id, response.voiceId);
        
        // For now, if actual voice design API isn't enabled or errors out, we will use fallback
        this.voiceCache.set(id, personality.fallbackVoice);
        logger.debug(`Voice initialized for ${id} (using fallback/cache: ${personality.fallbackVoice})`);
      } catch (err) {
        logger.error(`Failed to create voice for ${id}, using fallback`, err);
        this.voiceCache.set(id, personality.fallbackVoice);
      }
    }
  }

  getVoiceId(participantId: string): string {
    const voiceId = this.voiceCache.get(participantId);
    if (voiceId) return voiceId;
    return personalities[participantId]?.fallbackVoice || 'Puck';
  }
}

export const voiceManager = new VoiceManager();
