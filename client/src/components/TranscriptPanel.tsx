import React, { useEffect, useRef } from 'react';

export interface TranscriptEntry {
  id?: string;
  speaker: string;
  text: string;
  timestamp: number;
  isFinal: boolean;
}

interface TranscriptPanelProps {
  transcript: TranscriptEntry[];
  className?: string;
}

export default function TranscriptPanel({ transcript, className = '' }: TranscriptPanelProps) {
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [transcript]);

  return (
    <div className={`flex flex-col h-full bg-surface-dark/50 rounded-xl p-4 overflow-hidden border border-stone-800 ${className}`}>
      <div className="flex-1 overflow-y-auto custom-scrollbar pr-2 space-y-4">
        {transcript.length === 0 ? (
          <p className="text-warm-gray italic text-center mt-4">The discussion will appear here…</p>
        ) : (
          transcript.map((entry, idx) => {
            const isStudent = entry.speaker === 'You' || entry.speaker === 'student';
            return (
              <div key={entry.id || idx} className={`flex flex-col ${isStudent ? 'items-end' : 'items-start'}`}>
                <span className="text-xs text-warm-gray mb-1">{isStudent ? 'You' : entry.speaker}</span>
                <div 
                  className={`max-w-[90%] px-3 py-2 rounded-lg text-sm ${
                    isStudent 
                      ? 'bg-amber-cta/20 text-amber-50 font-medium' 
                      : 'bg-stone-800 text-stone-200'
                  } ${!entry.isFinal ? 'italic opacity-70' : ''}`}
                >
                  {entry.text}
                </div>
              </div>
            );
          })
        )}
        <div ref={endRef} />
      </div>
    </div>
  );
}
