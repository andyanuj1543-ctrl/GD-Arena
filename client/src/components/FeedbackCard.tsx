import React from 'react';

export interface Evidence {
  quote: string;
  analysis: string;
}

interface FeedbackCardProps {
  category: string;
  score: number;
  maxScore?: number;
  feedback: string;
  evidence: Evidence[];
}

export default function FeedbackCard({ category, score, maxScore = 10, feedback, evidence }: FeedbackCardProps) {
  return (
    <div className="bg-surface rounded-xl p-6 shadow-sm border border-stone-100 mb-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-serif text-charcoal">{category}</h3>
        <span className="px-3 py-1 bg-stone-100 text-stone-700 rounded-full text-sm font-medium">
          {score}/{maxScore}
        </span>
      </div>
      
      <p className="text-charcoal mb-6 leading-relaxed">
        {feedback}
      </p>

      {evidence.length > 0 && (
        <div className="space-y-4">
          <h4 className="text-sm font-medium text-warm-gray uppercase tracking-wider">Evidence</h4>
          {evidence.map((item, idx) => (
            <div key={idx} className="bg-ivory/50 rounded-lg p-4">
              <blockquote className="border-l-4 border-stone-300 pl-4 italic text-warm-gray mb-3">
                "{item.quote}"
              </blockquote>
              <p className="text-sm text-charcoal">{item.analysis}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
