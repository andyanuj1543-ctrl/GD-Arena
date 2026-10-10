export interface DiscussionConfig {
  topic: string;
  participantIds: string[];
  durationMinutes: number;
  format: 'standard' | 'case-based' | 'abstract' | 'fishbowl';
}

export interface TranscriptEntry {
  id: string;
  speaker: string;
  speakerId: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
  duration?: number;
}

export interface Personality {
  id: string;
  name: string;
  trait: string;
  initial: string;
  color: string;
  systemPrompt: string;
  voiceDesignPrompt: string;
  voiceGender: 'male' | 'female';
  speakDelay: { min: number; max: number };
  interruptTendency: number;
  fallbackVoice: string;
}

export interface Nudge {
  message: string;
  type: 'warning' | 'encouragement' | 'tip';
}

export interface PhaseTimings {
  opening: number; // minutes
  discussion: number; // minutes
  closing: number; // minutes
}

export interface FormatConfig {
  id: string;
  name: string;
  description: string;
  getPhaseTimings: (durationMinutes: number) => PhaseTimings;
  specialInstructions: string;
}
