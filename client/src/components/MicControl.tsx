import React from 'react';

interface MicControlProps {
  isMicOn: boolean;
  onToggle: () => void;
  audioLevel?: number;
  disabled?: boolean;
}

export default function MicControl({ isMicOn, onToggle, audioLevel = 0, disabled = false }: MicControlProps) {
  const ringScale = 1 + (audioLevel * 0.5);
  
  return (
    <div className="relative flex items-center justify-center w-24 h-24">
      {isMicOn && !disabled && (
        <>
          <div 
            className="absolute inset-0 bg-amber-cta/20 rounded-full transition-transform duration-75"
            style={{ transform: `scale(${ringScale + 0.2})` }}
          />
          <div 
            className="absolute inset-2 bg-amber-cta/30 rounded-full transition-transform duration-75"
            style={{ transform: `scale(${ringScale})` }}
          />
        </>
      )}
      
      <button
        onClick={onToggle}
        disabled={disabled}
        title={disabled ? "Microphone not available" : isMicOn ? "Mute" : "Unmute"}
        className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center transition-colors shadow-lg
          ${disabled 
            ? 'bg-stone-800 text-stone-500 cursor-not-allowed' 
            : isMicOn 
              ? 'bg-amber-cta text-white hover:bg-amber-cta-hover' 
              : 'bg-stone-600 text-stone-300 hover:bg-stone-500'
          }`}
      >
        {isMicOn ? (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/>
            <path d="M19 10v2a7 7 0 0 1-14 0v-2"/>
            <line x1="12" x2="12" y1="19" y2="22"/>
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <line x1="2" x2="22" y1="2" y2="22"/>
            <path d="M18.89 13.23A7.12 7.12 0 0 0 19 12v-2"/>
            <path d="M5 10v2a7 7 0 0 0 12 5"/>
            <path d="M15 9.34V5a3 3 0 0 0-5.68-1.33"/>
            <path d="M9 9v3a3 3 0 0 0 5.12 2.12"/>
            <line x1="12" x2="12" y1="19" y2="22"/>
          </svg>
        )}
      </button>
    </div>
  );
}
