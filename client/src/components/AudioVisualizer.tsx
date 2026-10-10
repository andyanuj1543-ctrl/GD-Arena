import React from 'react';

interface AudioVisualizerProps {
  audioLevel: number;
  isActive: boolean;
}

export default function AudioVisualizer({ audioLevel, isActive }: AudioVisualizerProps) {
  const bars = [0.8, 1.2, 1, 1.1, 0.9];
  
  return (
    <div className="flex items-center space-x-1 h-8">
      {bars.map((mult, i) => {
        const height = isActive ? Math.max(4, audioLevel * 24 * mult) : 4;
        return (
          <div
            key={i}
            className={`w-1 rounded-full transition-all duration-75 ${isActive ? 'bg-amber-cta' : 'bg-stone-600'}`}
            style={{ height: `${height}px` }}
          />
        );
      })}
    </div>
  );
}
