import { EventEmitter } from 'events';

interface QueueItem {
  speakerId: string;
  audioData: string;
  text: string;
}

export class PlaybackQueue extends EventEmitter {
  private queue: QueueItem[] = [];
  private isPlaying = false;
  private currentSpeaker: string | null = null;
  
  enqueue(speakerId: string, audioData: string, text: string) {
    this.queue.push({ speakerId, audioData, text });
    this.processQueue();
  }
  
  clear() {
    this.queue = [];
    this.isPlaying = false;
    this.currentSpeaker = null;
    this.emit('clear');
  }
  
  getCurrentSpeaker() {
    return this.currentSpeaker;
  }
  
  private processQueue() {
    if (this.isPlaying || this.queue.length === 0) return;
    
    this.isPlaying = true;
    const item = this.queue.shift()!;
    this.currentSpeaker = item.speakerId;
    
    this.emit('play', item.speakerId, item.audioData, item.text);
    
    // Simulate playing time based on text length (~150 words per minute)
    const words = item.text.split(' ').length;
    const ms = (words / 150) * 60 * 1000;
    
    setTimeout(() => {
      this.isPlaying = false;
      this.currentSpeaker = null;
      this.emit('finish', item.speakerId);
      this.processQueue();
    }, ms);
  }
}
