/**
 * AudioPlayer — Plays back PCM audio chunks from AI participants
 * using Web Audio API. Handles queuing, speaker tracking, and interruption.
 */

export interface AudioQueueItem {
  speakerId: string;
  audioData: ArrayBuffer; // PCM16 raw audio data
  text: string;
}

export type SpeakerChangeCallback = (speakerId: string | null) => void;

export class AudioPlayer {
  private audioContext: AudioContext | null = null;
  private queue: AudioQueueItem[] = [];
  private isPlaying = false;
  private currentSpeaker: string | null = null;
  private onSpeakerChange: SpeakerChangeCallback | null = null;
  private _isMuted = false;
  private gainNode: GainNode | null = null;

  constructor(onSpeakerChange?: SpeakerChangeCallback) {
    this.onSpeakerChange = onSpeakerChange || null;
  }

  /** Initialize the audio context (must be called after user gesture). */
  async init(): Promise<void> {
    if (!this.audioContext) {
      this.audioContext = new AudioContext({ sampleRate: 24000 }); // Gemini TTS outputs 24kHz
      this.gainNode = this.audioContext.createGain();
      this.gainNode.connect(this.audioContext.destination);
    }
    if (this.audioContext.state === 'suspended') {
      await this.audioContext.resume();
    }
  }

  /** Add audio to the playback queue. */
  enqueue(item: AudioQueueItem): void {
    this.queue.push(item);
    if (!this.isPlaying) {
      this.playNext();
    }
  }

  /** Clear the queue and stop current playback (for interruptions). */
  interrupt(): void {
    this.queue = [];
    this.isPlaying = false;
    if (this.currentSpeaker) {
      this.currentSpeaker = null;
      this.onSpeakerChange?.(null);
    }
    // The currently playing buffer will finish its current chunk,
    // but no new chunks will be scheduled.
  }

  /** Mute/unmute playback. */
  setMuted(muted: boolean): void {
    this._isMuted = muted;
    if (this.gainNode) {
      this.gainNode.gain.value = muted ? 0 : 1;
    }
  }

  get isMuted(): boolean {
    return this._isMuted;
  }

  get activeSpeaker(): string | null {
    return this.currentSpeaker;
  }

  private async playNext(): Promise<void> {
    if (this.queue.length === 0) {
      this.isPlaying = false;
      this.currentSpeaker = null;
      this.onSpeakerChange?.(null);
      return;
    }

    this.isPlaying = true;
    const item = this.queue.shift()!;

    // Notify speaker change
    if (this.currentSpeaker !== item.speakerId) {
      this.currentSpeaker = item.speakerId;
      this.onSpeakerChange?.(item.speakerId);
    }

    try {
      await this.playBuffer(item.audioData);
    } catch (err) {
      console.warn('Audio playback error:', err);
    }

    // Play next in queue
    this.playNext();
  }

  private playBuffer(audioData: ArrayBuffer): Promise<void> {
    return new Promise((resolve) => {
      if (!this.audioContext || !this.gainNode) {
        resolve();
        return;
      }

      // Convert PCM16 raw data to Float32 for Web Audio
      const int16Array = new Int16Array(audioData);
      const float32Array = new Float32Array(int16Array.length);
      for (let i = 0; i < int16Array.length; i++) {
        float32Array[i] =
          int16Array[i] / (int16Array[i] < 0 ? 0x8000 : 0x7fff);
      }

      const audioBuffer = this.audioContext.createBuffer(
        1,
        float32Array.length,
        24000,
      );
      audioBuffer.copyToChannel(float32Array, 0);

      const sourceNode = this.audioContext.createBufferSource();
      sourceNode.buffer = audioBuffer;
      sourceNode.connect(this.gainNode);

      sourceNode.onended = () => {
        resolve();
      };

      sourceNode.start();
    });
  }

  /** Clean up audio context. */
  destroy(): void {
    this.interrupt();
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    this.gainNode = null;
  }
}
