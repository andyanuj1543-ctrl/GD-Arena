import React from 'react';

interface TimerProps {
  timeRemaining: number;
  totalTime: number;
}

export default function Timer({ timeRemaining, totalTime }: TimerProps) {
  const minutes = Math.floor(timeRemaining / 60);
  const seconds = timeRemaining % 60;
  
  const formatted = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  
  const progress = ((totalTime - timeRemaining) / totalTime) * 100;
  
  let colorClass = 'text-stone-300';
  let animationClass = '';
  
  if (timeRemaining <= 30) {
    colorClass = 'text-rose-400';
    animationClass = 'animate-pulse';
  } else if (timeRemaining <= 120) {
    colorClass = 'text-rose-400';
  }

  return (
    <div className="flex flex-col items-center">
      <div className={`font-mono text-2xl font-medium ${colorClass} ${animationClass}`}>
        {formatted}
      </div>
      <div className="w-32 h-1 bg-stone-800 mt-2 rounded-full overflow-hidden">
        <div 
          className="h-full bg-amber-cta transition-all duration-1000 ease-linear"
          style={{ width: `${progress}%` }}
        />
      </div>
    </div>
  );
}
