import { personalities } from '../participants/personalities.js';
import { TranscriptEntry } from '../types.js';
import { logger } from '../utils/logger.js';

export const turnManager = {
  selectNextSpeaker(transcript: TranscriptEntry[], participantIds: string[], currentPhase: string, excludeIds: string[] = []): string | null {
    const candidates = participantIds.filter(id => !excludeIds.includes(id) && id !== 'student');
    
    if (candidates.length === 0) return null;

    // Get last few speakers
    const lastFew = transcript.slice(-3).map(t => t.speakerId);
    
    let bestScore = -1;
    let selectedId = candidates[0];

    for (const id of candidates) {
      let score = Math.random() * 50; // Base random score
      const personality = personalities[id];
      
      // Penalize if they spoke recently
      if (lastFew.includes(id)) {
        score -= 50;
      }
      
      // Bonus based on interrupt tendency (more likely to jump in)
      if (personality) {
        score += personality.interruptTendency * 20;
      }
      
      if (score > bestScore) {
        bestScore = score;
        selectedId = id;
      }
    }
    
    return selectedId;
  },
  
  getResponseDelay(participantId: string): number {
    const personality = personalities[participantId];
    if (!personality) return 1000;
    const { min, max } = personality.speakDelay;
    return Math.floor(Math.random() * (max - min + 1)) + min;
  },
  
  shouldInterrupt(participantId: string, currentSpeakerId: string): boolean {
    const personality = personalities[participantId];
    if (!personality || currentSpeakerId === participantId) return false;
    // Simple probability based on interruptTendency
    return Math.random() < (personality.interruptTendency * 0.3); // Scale down to make it realistic
  }
};
