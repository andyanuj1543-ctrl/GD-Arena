import React from 'react';

interface ParticipantPreviewProps {
  name: string;
  trait: string;
  initial: string;
  color: string;
}

export const ParticipantPreview: React.FC<ParticipantPreviewProps> = ({
  name,
  trait,
  initial,
  color,
}) => {
  return (
    <div className="flex flex-col items-center gap-2 w-16">
      <div 
        className={`w-12 h-12 rounded-full flex items-center justify-center text-white font-serif text-xl shadow-sm`}
        style={{ backgroundColor: color }}
      >
        {initial}
      </div>
      <div className="flex flex-col items-center text-center">
        <span className="text-charcoal text-xs font-medium truncate w-full">{name}</span>
        <span className="text-warm-gray text-[10px] truncate w-full">{trait}</span>
      </div>
    </div>
  );
};

export default ParticipantPreview;
