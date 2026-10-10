import React from 'react';

interface GradeBadgeProps {
  grade: string;
  summary: string;
}

export default function GradeBadge({ grade, summary }: GradeBadgeProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="w-32 h-32 rounded-full border-4 border-stone-200 flex items-center justify-center bg-white shadow-sm mb-4">
        <span className="text-6xl font-serif text-amber-cta font-bold">{grade}</span>
      </div>
      <p className="text-lg text-charcoal font-medium text-center">{summary}</p>
    </div>
  );
}
