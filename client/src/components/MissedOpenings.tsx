import React from 'react';

export interface MissedOpening {
  timestamp: string;
  context: string;
  suggestion: string;
}

interface MissedOpeningsProps {
  openings: MissedOpening[];
}

export default function MissedOpenings({ openings }: MissedOpeningsProps) {
  if (openings.length === 0) return null;

  return (
    <div className="bg-surface rounded-xl p-6 shadow-sm border border-stone-100">
      <h3 className="text-xl font-serif text-charcoal mb-6">Moments You Could Have Jumped In</h3>
      
      <div className="relative border-l-2 border-amber-cta/30 ml-3 space-y-8">
        {openings.map((opening, idx) => (
          <div key={idx} className="relative pl-6">
            <div className="absolute w-3 h-3 bg-amber-cta rounded-full -left-[7px] top-1.5 ring-4 ring-white" />
            
            <div className="flex flex-col space-y-2">
              <span className="text-sm font-mono text-warm-gray">{opening.timestamp}</span>
              <div className="bg-stone-50 rounded-lg p-4">
                <p className="text-sm text-warm-gray mb-2">
                  <span className="font-medium text-charcoal">Context:</span> {opening.context}
                </p>
                <p className="text-sm text-amber-900 bg-amber-50 p-3 rounded border border-amber-100">
                  <span className="font-medium">Suggestion:</span> {opening.suggestion}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
