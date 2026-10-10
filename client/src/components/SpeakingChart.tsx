import React from 'react';

export interface SpeakingData {
  name: string;
  seconds: number;
  percentage: number;
  color: string;
}

interface SpeakingChartProps {
  distribution: SpeakingData[];
}

export default function SpeakingChart({ distribution }: SpeakingChartProps) {
  return (
    <div className="w-full">
      <h3 className="text-lg font-serif text-charcoal mb-4">Speaking Time Distribution</h3>
      
      {/* Bar */}
      <div className="w-full h-8 flex rounded-lg overflow-hidden shadow-sm mb-4">
        {distribution.map((d, i) => (
          <div 
            key={i}
            className="h-full flex items-center justify-center text-xs text-white font-medium transition-all"
            style={{ width: `${Math.max(2, d.percentage)}%`, backgroundColor: d.color }}
            title={`${d.name}: ${d.percentage}%`}
          >
            {d.percentage > 10 ? `${d.percentage}%` : ''}
          </div>
        ))}
      </div>

      {/* Legend */}
      <div className="flex flex-wrap gap-4">
        {distribution.map((d, i) => (
          <div key={i} className="flex items-center space-x-2">
            <div className="w-3 h-3 rounded-full" style={{ backgroundColor: d.color }} />
            <span className="text-sm text-charcoal font-medium">{d.name}</span>
            <span className="text-sm text-warm-gray">{d.percentage}%</span>
          </div>
        ))}
      </div>
    </div>
  );
}
