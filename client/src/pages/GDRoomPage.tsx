import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router';
import { io, Socket } from 'socket.io-client';
import ParticipantCircle, { Participant } from '../components/ParticipantCircle';
import TranscriptPanel, { TranscriptEntry } from '../components/TranscriptPanel';
import Timer from '../components/Timer';
import MicControl from '../components/MicControl';
import NudgeToast, { Nudge } from '../components/NudgeToast';
import { AudioPlayer } from '../audio/AudioPlayer';

const DEFAULT_PARTICIPANTS: Participant[] = [
  { id: 'arjun', name: 'Arjun', trait: 'The Assertive One', initial: 'A', color: '#dc2626' },
  { id: 'priya', name: 'Priya', trait: 'The Analyst', initial: 'P', color: '#2563eb' },
  { id: 'rohit', name: 'Rohit', trait: 'The Mediator', initial: 'R', color: '#059669' },
  { id: 'meera', name: 'Meera', trait: 'The Challenger', initial: 'M', color: '#9333ea' },
  { id: 'vikram', name: 'Vikram', trait: 'The Free Spirit', initial: 'V', color: '#d97706' },
];

export default function GDRoomPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const { sessionId } = useParams<{ sessionId: string }>();
  const roomConfig = location.state || {
    topic: 'Should companies adopt a 4-day work week?',
    panelSize: 4,
    format: 'standard',
    duration: 10,
  };

  const activeParticipants = DEFAULT_PARTICIPANTS.slice(0, roomConfig.panelSize || 4);
  const [participants] = useState<Participant[]>(activeParticipants);
  const [transcript, setTranscript] = useState<TranscriptEntry[]>([]);
  const [phase, setPhase] = useState<'waiting' | 'opening' | 'discussion' | 'closing' | 'ended'>('waiting');
  const [timeRemaining, setTimeRemaining] = useState((roomConfig.duration || 10) * 60);
  const [totalTime] = useState((roomConfig.duration || 10) * 60);
  const [isMicOn, setIsMicOn] = useState(false);
  const [activeSpeaker, setActiveSpeaker] = useState<string | null>(null);
  const [nudges, setNudges] = useState<Nudge[]>([]);
  const [connectionStatus, setConnectionStatus] = useState<'connected' | 'reconnecting' | 'disconnected'>('disconnected');
  const [micPermissionDenied, setMicPermissionDenied] = useState(false);
  const [audioLevel, setAudioLevel] = useState(0);
  
  const socketRef = useRef<Socket | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const animationFrameRef = useRef<number | null>(null);
  const audioPlayerRef = useRef<AudioPlayer | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const player = new AudioPlayer((speakerId) => {
      setActiveSpeaker(speakerId);
    });
    audioPlayerRef.current = player;

    const requestMic = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
        mediaStreamRef.current = stream;
        
        import('../audio/SpeechRecognition').then(({ initSpeechRecognition }) => {
          recognitionRef.current = initSpeechRecognition(
            (text, isFinal) => {
              if (isFinal && socketRef.current) {
                socketRef.current.emit('student:speak', text);
              }
            },
            () => {
              if (socketRef.current) socketRef.current.emit('student:interrupt');
              if (audioPlayerRef.current) audioPlayerRef.current.interrupt();
              setActiveSpeaker('student');
            },
            () => {
              setActiveSpeaker((prev) => prev === 'student' ? null : prev);
            }
          );
          
          if (isMicOn && recognitionRef.current) {
             recognitionRef.current.start();
          }
        });
        const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
        audioContextRef.current = new AudioCtx();
        analyserRef.current = audioContextRef.current.createAnalyser();
        const source = audioContextRef.current.createMediaStreamSource(stream);
        source.connect(analyserRef.current);
        analyserRef.current.fftSize = 256;
        
        const updateAudioLevel = () => {
          if (analyserRef.current && isMicOn) {
            const dataArray = new Uint8Array(analyserRef.current.frequencyBinCount);
            analyserRef.current.getByteFrequencyData(dataArray);
            const sum = dataArray.reduce((a, b) => a + b, 0);
            const average = sum / dataArray.length;
            setAudioLevel(Math.min(1, average / 128));
          } else {
            setAudioLevel(0);
          }
          animationFrameRef.current = requestAnimationFrame(updateAudioLevel);
        };
        updateAudioLevel();
        
      } catch (err) {
        console.warn("Microphone access denied or unavailable:", err);
        setMicPermissionDenied(true);
      }
    };

    requestMic();

    const socket = io('/', {
      autoConnect: true,
      reconnection: true,
    });
    socketRef.current = socket;

    socket.on('connect', () => {
      setConnectionStatus('connected');
      socket.emit('discussion:start', {
        topic: roomConfig.topic,
        participantIds: activeParticipants.map(p => p.id),
        durationMinutes: roomConfig.duration || 10,
        format: roomConfig.format || 'standard',
      });
    });

    socket.on('disconnect', () => setConnectionStatus('disconnected'));
    socket.on('connect_error', () => setConnectionStatus('reconnecting'));
    
    socket.on('discussion:phase', (data: { phase: string; remaining: number }) => {
      setPhase(data.phase.toLowerCase() as any);
      if (typeof data.remaining === 'number') {
        setTimeRemaining(data.remaining);
      }
    });

    socket.on('timer:tick', (data: { elapsed: number; remaining: number }) => {
      if (typeof data.remaining === 'number') {
        setTimeRemaining(data.remaining);
      }
    });
    
    socket.on('ai:speaking', (data: { speaker: string; audioChunk?: string; text: string }) => {
      setActiveSpeaker(data.speaker);
      if (data.audioChunk && audioPlayerRef.current) {
        audioPlayerRef.current.init().then(() => {
          const binaryString = atob(data.audioChunk!);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          audioPlayerRef.current?.enqueue({
            speakerId: data.speaker,
            audioData: bytes.buffer,
            text: data.text,
          });
        });
      }
    });

    socket.on('ai:stopped', () => {
      setActiveSpeaker(null);
    });

    socket.on('moderator:announce', (data: { text: string; audioChunk?: string }) => {
      setActiveSpeaker('moderator');
      if (data.audioChunk && audioPlayerRef.current) {
        audioPlayerRef.current.init().then(() => {
          const binaryString = atob(data.audioChunk!);
          const bytes = new Uint8Array(binaryString.length);
          for (let i = 0; i < binaryString.length; i++) {
            bytes[i] = binaryString.charCodeAt(i);
          }
          audioPlayerRef.current?.enqueue({
            speakerId: 'moderator',
            audioData: bytes.buffer,
            text: data.text,
          });
        });
      }
    });
    
    socket.on('transcript:final', (entry: any) => {
      setTranscript(prev => [...prev, {
        id: entry.id || String(Date.now()),
        speaker: entry.speaker,
        speakerId: entry.speakerId,
        text: entry.text,
        timestamp: entry.timestamp || Date.now(),
        isFinal: true
      }]);
    });
    
    socket.on('nudge', (nudge: Omit<Nudge, 'timestamp'>) => {
      setNudges(prev => [...prev, { ...nudge, timestamp: Date.now() }]);
    });

    socket.on('discussion:end', () => {
      setPhase('ended');
    });

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      if (mediaStreamRef.current) mediaStreamRef.current.getTracks().forEach(t => t.stop());
      if (audioContextRef.current) audioContextRef.current.close();
      if (audioPlayerRef.current) audioPlayerRef.current.destroy();
      socket.disconnect();
    };
  }, []);

  useEffect(() => {
    if (phase === 'ended') {
      navigate('/report/session_123');
    }
  }, [phase, navigate]);

  const toggleMic = () => {
    if (micPermissionDenied) {
      alert("Microphone permission is denied. Please enable it in your browser settings or click the camera icon in the URL bar.");
      return;
    }
    const nextState = !isMicOn;
    setIsMicOn(nextState);
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getAudioTracks().forEach(track => {
        track.enabled = nextState;
      });
    }
    
    if (nextState) {
      try {
        recognitionRef.current?.start();
      } catch (e) {} // ignore if already started
      if (activeSpeaker && activeSpeaker !== 'student') {
        socketRef.current?.emit('student:interrupt');
        audioPlayerRef.current?.interrupt();
      }
    } else {
      try {
        recognitionRef.current?.stop();
      } catch (e) {}
    }
  };

  const statusColor = connectionStatus === 'connected' ? 'bg-emerald-500' : 
                     connectionStatus === 'reconnecting' ? 'bg-amber-500' : 'bg-rose-500';

  return (
    <div className="bg-surface-dark min-h-screen flex flex-col text-stone-200">
      {/* Top Bar */}
      <header className="flex items-center justify-between px-6 py-4 border-b border-stone-800">
        <div className="flex-1">
          <span className="px-3 py-1 bg-stone-800 rounded-full text-sm capitalize">{phase}</span>
        </div>
        <div className="flex-1 flex justify-center">
          <Timer timeRemaining={timeRemaining} totalTime={totalTime} />
        </div>
        <div className="flex-1 flex justify-end items-center space-x-2">
          <span className="text-sm text-warm-gray capitalize">{connectionStatus}</span>
          <div className={`w-2.5 h-2.5 rounded-full ${statusColor}`} />
        </div>
      </header>

      {/* Main Area */}
      <main className="flex-1 flex flex-col p-6 relative">
        <div className="flex-1 flex items-center justify-center">
          <ParticipantCircle 
            participants={participants} 
            activeSpeaker={activeSpeaker}
            studentName="You"
          />
        </div>

        {/* Bottom Panel */}
        <div className="mt-auto pt-6 flex items-end justify-between h-56 gap-6">
          <div className="w-3/5 h-full">
            <TranscriptPanel transcript={transcript} />
          </div>
          
          <div className="flex-1 flex justify-center items-center h-full">
            <div className="flex flex-col items-center">
              <MicControl 
                isMicOn={isMicOn} 
                onToggle={toggleMic} 
                audioLevel={audioLevel}
                disabled={micPermissionDenied} 
              />
              {micPermissionDenied && (
                <p className="text-rose-400 text-xs mt-2 text-center max-w-[150px]">
                  Mic access denied. Check browser settings.
                </p>
              )}
            </div>
          </div>
          
          <div className="w-1/4 h-full flex items-end justify-end pb-4">
            <NudgeToast nudges={nudges} />
          </div>
        </div>
      </main>
    </div>
  );
}
