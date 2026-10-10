import { EventEmitter } from 'events';
import { DiscussionConfig, TranscriptEntry } from '../types.js';
import { TranscriptManager } from './transcriptManager.js';
import { turnManager } from './turnManager.js';
import { contextBuilder } from './contextBuilder.js';
import { moderator } from '../participants/moderator.js';
import { logger } from '../utils/logger.js';
import { personalities } from '../participants/personalities.js';
import { config } from '../config/index.js';
import { GoogleGenAI } from '@google/genai';

const ai = config.geminiApiKey ? new GoogleGenAI({ apiKey: config.geminiApiKey }) : null;

export class DiscussionOrchestrator extends EventEmitter {
  private config: DiscussionConfig;
  private phase: 'WAITING' | 'OPENING' | 'DISCUSSION' | 'CLOSING' | 'ENDED' = 'WAITING';
  private transcriptManager = new TranscriptManager();
  private elapsedSeconds = 0;
  private timer: NodeJS.Timeout | null = null;
  private isProcessingTurn = false;
  
  constructor(config: DiscussionConfig) {
    super();
    this.config = config;
  }
  
  start() {
    this.phase = 'OPENING';
    this.elapsedSeconds = 0;
    this.timer = setInterval(() => this.tick(), 1000);
    
    const openingMsg = moderator.generateOpeningStatement(this.config.topic, this.config.participantIds, this.config.format);
    this.emit('moderator:speak', openingMsg);
    this.transcriptManager.addEntry('Moderator', 'moderator', openingMsg);
    
    this.emit('phase:change', { phase: this.phase, remaining: this.config.durationMinutes * 60 });
    
    setTimeout(() => {
      this.triggerNextTurn();
    }, 5000); // give mod time to speak
  }
  
  stop() {
    if (this.timer) clearInterval(this.timer);
    this.phase = 'ENDED';
    this.emit('phase:change', { phase: this.phase, remaining: 0 });
    this.emit('discussion:end', { transcript: this.transcriptManager.getTranscript() });
  }

  handleStudentSpeech(text: string) {
    if (this.phase === 'ENDED') return;
    
    if (text.trim()) {
      this.transcriptManager.addEntry('Student', 'student', text);
      this.emit('transcript:final', this.transcriptManager.getRecentEntries(1)[0]);
    }
    
    // AI responds to student (wait a bit to let the user finish if they are continuing)
    if (!this.isProcessingTurn && text.trim()) {
      setTimeout(() => this.triggerNextTurn(['student']), 1500);
    }
  }
  
  private tick() {
    if (this.phase === 'ENDED') return;
    
    this.elapsedSeconds++;
    const totalSeconds = this.config.durationMinutes * 60;
    const remaining = Math.max(0, totalSeconds - this.elapsedSeconds);
    
    this.emit('timer:tick', { elapsed: this.elapsedSeconds, remaining });
    
    // Basic Phase Management
    if (this.phase === 'OPENING' && this.elapsedSeconds > 60) { // arbitrary 1 min for opening
      this.phase = 'DISCUSSION';
      this.emit('phase:change', { phase: this.phase, remaining });
    } else if (this.phase === 'DISCUSSION' && remaining <= 60) { // 1 min remaining
      this.phase = 'CLOSING';
      this.emit('phase:change', { phase: this.phase, remaining });
      const closingMsg = moderator.generateClosingPrompt(this.config.participantIds);
      this.emit('moderator:speak', closingMsg);
      this.transcriptManager.addEntry('Moderator', 'moderator', closingMsg);
    } else if (remaining === 0) {
      this.stop();
    }
    
    // Silence detection -> trigger next turn
    if (!this.isProcessingTurn && this.transcriptManager.getOpenings() && Math.random() < 0.2) {
      this.triggerNextTurn();
    }
  }
  
  private async triggerNextTurn(excludeIds: string[] = []) {
    if (this.isProcessingTurn || this.phase === 'ENDED' || this.phase === 'WAITING') return;
    this.isProcessingTurn = true;
    
    try {
      const nextId = turnManager.selectNextSpeaker(
        this.transcriptManager.getTranscript(),
        this.config.participantIds,
        this.phase,
        excludeIds
      );
      
      if (nextId) {
        const delay = turnManager.getResponseDelay(nextId);
        await new Promise(r => setTimeout(r, delay));
        await this.generateAIResponse(nextId);
      }
    } finally {
      this.isProcessingTurn = false;
    }
  }
  
  private async generateAIResponse(participantId: string) {
    const personality = personalities[participantId];
    if (!personality) return;
    
    const messages = contextBuilder.buildPrompt(participantId, this.transcriptManager.getTranscript(), this.phase, this.config.topic);
    
    let text = "I agree, but we must consider other angles."; // fallback
    
    if (ai) {
      try {
        const response = await ai.models.generateContent({
          model: 'gemini-3.8-flash',
          contents: messages.map(m => ({ role: m.role, parts: [{ text: m.content }] }))
        });
        if (response.text) {
          text = response.text;
        }
      } catch (err) {
        logger.error(`Error generating response for ${participantId}:`, err);
      }
    }
    
    this.transcriptManager.addEntry(personality.name, participantId, text);
    const entry = this.transcriptManager.getRecentEntries(1)[0];
    
    this.emit('ai:speaking', { speaker: participantId, text });
    this.emit('transcript:final', entry);
  }
}
