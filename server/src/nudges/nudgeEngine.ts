import { TranscriptEntry, Nudge } from '../types.js';

export const nudgeEngine = {
  lastNudgeTime: 0,
  
  checkNudges(transcript: TranscriptEntry[], elapsed: number, durationMinutes: number): Nudge[] {
    const nudges: Nudge[] = [];
    const now = Date.now();
    
    // Don't repeat within 60s
    if (now - this.lastNudgeTime < 60000) {
      return nudges;
    }
    
    const studentEntries = transcript.filter(t => t.speakerId === 'student');
    const remaining = (durationMinutes * 60) - elapsed;
    
    if (studentEntries.length === 0 && elapsed > 120) {
      nudges.push({ message: "It's been a while — jump in when you're ready", type: 'warning' });
      this.lastNudgeTime = now;
    } else if (remaining < 120 && remaining > 100) {
      nudges.push({ message: "The discussion is wrapping up — share your final thoughts", type: 'warning' });
      this.lastNudgeTime = now;
    } else if (studentEntries.length === 1 && (now - studentEntries[0].timestamp < 10000)) {
      nudges.push({ message: "Nice start — keep the momentum going", type: 'encouragement' });
      this.lastNudgeTime = now;
    }
    
    return nudges;
  }
};
