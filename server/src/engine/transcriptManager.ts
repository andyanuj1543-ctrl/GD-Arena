import { TranscriptEntry } from '../types.js';

export class TranscriptManager {
  private transcript: TranscriptEntry[] = [];
  
  addEntry(speaker: string, speakerId: string, text: string, isFinal: boolean = true) {
    const entry: TranscriptEntry = {
      id: Date.now().toString() + Math.random().toString(36).substring(7),
      speaker,
      speakerId,
      text,
      timestamp: Date.now(),
      isFinal
    };
    
    if (isFinal) {
      this.transcript.push(entry);
    }
    return entry;
  }
  
  getTranscript(): TranscriptEntry[] {
    return this.transcript;
  }
  
  getRecentEntries(n: number): TranscriptEntry[] {
    return this.transcript.slice(-n);
  }
  
  getSpeakingStats() {
    const stats: Record<string, { count: number, words: number }> = {};
    for (const entry of this.transcript) {
      if (!stats[entry.speakerId]) {
        stats[entry.speakerId] = { count: 0, words: 0 };
      }
      stats[entry.speakerId].count++;
      stats[entry.speakerId].words += entry.text.split(/\s+/).length;
    }
    return stats;
  }
  
  findSilentParticipants(participantIds: string[], thresholdMs: number): string[] {
    const now = Date.now();
    const lastSpoken = new Map<string, number>();
    
    for (const entry of this.transcript) {
      lastSpoken.set(entry.speakerId, entry.timestamp);
    }
    
    return participantIds.filter(id => {
      const last = lastSpoken.get(id) || 0;
      return (now - last) > thresholdMs;
    });
  }
  
  getOpenings(): boolean {
    if (this.transcript.length === 0) return true;
    const last = this.transcript[this.transcript.length - 1];
    return (Date.now() - last.timestamp) > 2000;
  }
}
