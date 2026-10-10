import { Server as SocketServer } from 'socket.io';
import { Server as HttpServer } from 'http';
import { logger } from '../utils/logger.js';
import { DiscussionOrchestrator } from '../engine/discussionOrchestrator.js';
import { PlaybackQueue } from '../audio/playbackQueue.js';
import { StudentAudioHandler } from '../audio/studentAudioHandler.js';
import { aiSpeechSynthesizer } from '../audio/aiSpeechSynthesizer.js';
import { voiceManager } from '../participants/voiceManager.js';

export function setupSocketServer(httpServer: HttpServer, corsOrigin: string) {
  const io = new SocketServer(httpServer, {
    cors: { origin: corsOrigin, methods: ['GET', 'POST'] }
  });

  io.on('connection', (socket) => {
    logger.info(`Client connected: ${socket.id}`);
    
    let orchestrator: DiscussionOrchestrator | null = null;
    const playbackQueue = new PlaybackQueue();
    const audioHandler = new StudentAudioHandler();
    
    socket.on('discussion:start', (config) => {
      logger.info(`Starting discussion with config:`, config);
      orchestrator = new DiscussionOrchestrator(config);
      
      // Wire up events
      orchestrator.on('phase:change', (data) => socket.emit('discussion:phase', data));
      orchestrator.on('timer:tick', (data) => socket.emit('timer:tick', data));
      orchestrator.on('transcript:final', (data) => socket.emit('transcript:final', data));
      
      orchestrator.on('moderator:speak', async (text) => {
        socket.emit('moderator:announce', { text });
        const audio = await aiSpeechSynthesizer.synthesize(text, voiceManager.getVoiceId('moderator'));
        if (audio) socket.emit('moderator:announce', { text, audioChunk: audio });
      });
      
      orchestrator.on('ai:speaking', async ({ speaker, text }) => {
        const audio = await aiSpeechSynthesizer.synthesize(text, voiceManager.getVoiceId(speaker));
        if (audio) {
          playbackQueue.enqueue(speaker, audio, text);
        }
      });
      
      orchestrator.on('discussion:end', (data) => socket.emit('discussion:end', data));
      
      orchestrator.start();
    });
    
    socket.on('audio:chunk', (chunk) => {
      audioHandler.handleAudioChunk(chunk);
    });
    
    // Simulate student finishing speaking
    socket.on('student:finish_speech', async () => {
      const text = await audioHandler.flushAndTranscribe();
      if (text && orchestrator) {
        orchestrator.handleStudentSpeech(text);
      }
    });

    socket.on('student:speak', (text: string) => {
      if (orchestrator && text.trim()) {
        orchestrator.handleStudentSpeech(text);
      }
    });

    socket.on('student:interrupt', () => {
      playbackQueue.clear();
      if (orchestrator) orchestrator.handleStudentSpeech(""); // signal interrupt to orchestrator
      socket.emit('ai:stopped', { speaker: playbackQueue.getCurrentSpeaker() });
    });
    
    playbackQueue.on('play', (speaker, chunk, text) => {
      socket.emit('ai:speaking', { speaker, audioChunk: chunk, text });
    });
    
    playbackQueue.on('finish', (speaker) => {
      socket.emit('ai:stopped', { speaker });
    });

    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
      if (orchestrator) orchestrator.stop();
    });
  });

  return io;
}
