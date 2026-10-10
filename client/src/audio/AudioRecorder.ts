/**
 * AudioRecorder — Captures microphone audio as PCM 16kHz mono chunks
 * using Web Audio API with AudioWorklet.
 */

export type AudioChunkCallback = (chunk: Float32Array) => void;

export class AudioRecorder {
  private stream: MediaStream | null = null;
  private audioContext: AudioContext | null = null;
  private sourceNode: MediaStreamAudioSourceNode | null = null;
  private processorNode: ScriptProcessorNode | null = null;
  private onChunk: AudioChunkCallback | null = null;
  private _isRecording = false;
  private _audioLevel = 0;

  get isRecording(): boolean {
    return this._isRecording;
  }

  get audioLevel(): number {
    return this._audioLevel;
  }

  /**
   * Request microphone permission and start recording.
   * Returns true if successful, false if mic was denied.
   */
  async start(onChunk: AudioChunkCallback): Promise<boolean> {
    this.onChunk = onChunk;

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({
        audio: {
          sampleRate: 16000,
          channelCount: 1,
          echoCancellation: true,
          noiseSuppression: true,
          autoGainControl: true,
        },
      });
    } catch (err) {
      console.warn('Microphone access denied:', err);
      return false;
    }

    this.audioContext = new AudioContext({ sampleRate: 16000 });
    this.sourceNode = this.audioContext.createMediaStreamSource(this.stream);

    // Use ScriptProcessorNode (widely supported) for audio chunk processing
    // Buffer size of 4096 gives ~256ms chunks at 16kHz
    this.processorNode = this.audioContext.createScriptProcessor(4096, 1, 1);

    this.processorNode.onaudioprocess = (event) => {
      if (!this._isRecording) return;

      const inputData = event.inputBuffer.getChannelData(0);
      const chunk = new Float32Array(inputData);

      // Calculate audio level (RMS)
      let sum = 0;
      for (let i = 0; i < chunk.length; i++) {
        sum += chunk[i] * chunk[i];
      }
      this._audioLevel = Math.sqrt(sum / chunk.length);

      if (this.onChunk) {
        this.onChunk(chunk);
      }
    };

    this.sourceNode.connect(this.processorNode);
    this.processorNode.connect(this.audioContext.destination);

    this._isRecording = true;
    return true;
  }

  /** Pause recording (keeps stream alive). */
  pause(): void {
    this._isRecording = false;
    this._audioLevel = 0;
  }

  /** Resume recording. */
  resume(): void {
    this._isRecording = true;
  }

  /** Stop recording and release all resources. */
  stop(): void {
    this._isRecording = false;
    this._audioLevel = 0;

    if (this.processorNode) {
      this.processorNode.disconnect();
      this.processorNode = null;
    }
    if (this.sourceNode) {
      this.sourceNode.disconnect();
      this.sourceNode = null;
    }
    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }
    if (this.stream) {
      this.stream.getTracks().forEach((track) => track.stop());
      this.stream = null;
    }
    this.onChunk = null;
  }

  /**
   * Convert Float32Array audio samples to PCM16 Int16Array
   * (little-endian, suitable for sending to Gemini Live API).
   */
  static float32ToPCM16(float32: Float32Array): Int16Array {
    const int16 = new Int16Array(float32.length);
    for (let i = 0; i < float32.length; i++) {
      const s = Math.max(-1, Math.min(1, float32[i]));
      int16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
    }
    return int16;
  }

  /**
   * Convert PCM16 Int16Array back to Float32Array for playback.
   */
  static pcm16ToFloat32(int16: Int16Array): Float32Array {
    const float32 = new Float32Array(int16.length);
    for (let i = 0; i < int16.length; i++) {
      float32[i] = int16[i] / (int16[i] < 0 ? 0x8000 : 0x7fff);
    }
    return float32;
  }
}
