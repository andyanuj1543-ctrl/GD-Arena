import React from 'react';

export interface Participant {
  id: string;
  name: string;
  trait: string;
  initial: string;
  color: string;
}

interface ParticipantCircleProps {
  participants: Participant[];
  activeSpeaker: string | null;
  studentName?: string;
}

export default function ParticipantCircle({ participants, activeSpeaker, studentName = 'You' }: ParticipantCircleProps) {
  return (
    <div className="relative w-full max-w-2xl aspect-square mx-auto flex items-center justify-center">
      {/* Center Topic */}
      <div className="absolute text-center z-0">
        <p className="text-warm-gray text-sm">Discussion Topic</p>
        <p className="text-stone-300 font-serif mt-1">Impact of AI on Society</p>
      </div>

      {/* Participants */}
      <div className="relative w-full h-full">
        {participants.map((p, i) => {
          const angle = Math.PI + (i / (participants.length - 1)) * Math.PI;
          const radius = 40; // percentage
          const left = 50 + radius * Math.cos(angle);
          const top = 50 + radius * Math.sin(angle);
          
          const isActive = activeSpeaker === p.id;
          
          return (
            <div 
              key={p.id}
              className={`absolute flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${isActive ? 'scale-110' : 'scale-100'}`}
              style={{ left: `${left}%`, top: `${top}%` }}
            >
              <div 
                className={`w-14 h-14 rounded-full flex items-center justify-center text-white text-xl font-medium shadow-lg transition-all ${isActive ? 'animate-speaker-pulse ring-4 ring-white/20' : ''}`}
                style={{ backgroundColor: p.color }}
              >
                {p.initial}
              </div>
              <div className="mt-2 text-center">
                <p className="text-stone-200 font-medium text-sm">{p.name}</p>
                <p className="text-warm-gray text-xs">{p.trait}</p>
              </div>
            </div>
          );
        })}
        
        {/* Student (You) - Bottom Center */}
        <div 
          className={`absolute bottom-0 left-1/2 flex flex-col items-center justify-center -translate-x-1/2 -translate-y-1/2 transition-all duration-300 ${activeSpeaker === 'student' ? 'scale-110' : 'scale-100'}`}
        >
          <div 
            className={`w-14 h-14 rounded-full bg-stone-700 flex items-center justify-center text-white text-xl font-medium shadow-lg ring-2 ring-white transition-all ${activeSpeaker === 'student' ? 'animate-speaker-pulse' : ''}`}
          >
            {studentName.charAt(0)}
          </div>
          <div className="mt-2 text-center">
            <p className="text-stone-200 font-medium text-sm">{studentName}</p>
            <p className="text-warm-gray text-xs">The Candidate</p>
          </div>
        </div>
      </div>
    </div>
  );
}
