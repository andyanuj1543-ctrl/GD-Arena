import React from 'react';

interface TopicCardProps {
  topic: string;
  category: string;
  selected: boolean;
  onSelect: () => void;
}

export const TopicCard: React.FC<TopicCardProps> = ({ topic, category, selected, onSelect }) => {
  return (
    <div
      onClick={onSelect}
      className={`bg-surface border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md flex flex-col gap-2 h-full
        ${selected ? 'ring-2 ring-amber-cta border-amber-cta' : 'border-stone-200'}`}
    >
      <span className="text-warm-gray uppercase tracking-wider text-xs font-semibold">
        {category}
      </span>
      <p className="text-charcoal font-medium font-sans text-sm md:text-base leading-snug">
        {topic}
      </p>
    </div>
  );
};

export default TopicCard;
