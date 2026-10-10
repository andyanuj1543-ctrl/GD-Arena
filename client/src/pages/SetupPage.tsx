import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { TopicCard } from '../components/TopicCard';
import { ParticipantPreview } from '../components/ParticipantPreview';

interface Topic {
  id: string;
  category: string;
  text: string;
}

const PRESET_TOPICS: Topic[] = [
  { id: 'b1', category: 'Business', text: 'Should companies adopt a 4-day work week?' },
  { id: 'b2', category: 'Business', text: 'Is an MBA still worth it?' },
  { id: 't1', category: 'Technology', text: 'AI will create more jobs than it destroys' },
  { id: 't2', category: 'Technology', text: 'Should coding be mandatory in schools?' },
  { id: 'a1', category: 'Abstract', text: 'Is silence more powerful than words?' },
  { id: 'a2', category: 'Abstract', text: 'Red vs Blue' },
  { id: 'c1', category: 'Controversial', text: 'Social media does more harm than good' },
  { id: 'c2', category: 'Controversial', text: 'Reservation system helps or hurts India?' },
  { id: 'cs1', category: 'Case Study', text: 'A startup is losing users — recommend a turnaround strategy' },
];

const MOCK_PARTICIPANTS = [
  { name: 'Alex', trait: 'Analytical', initial: 'A', color: '#0369a1' },
  { name: 'Sam', trait: 'Aggressive', initial: 'S', color: '#be123c' },
  { name: 'Jordan', trait: 'Diplomatic', initial: 'J', color: '#15803d' },
  { name: 'Taylor', trait: 'Creative', initial: 'T', color: '#7e22ce' },
  { name: 'Casey', trait: 'Quiet', initial: 'C', color: '#b45309' },
];

const SetupPage: React.FC = () => {
  const navigate = useNavigate();
  const [selectedTopicId, setSelectedTopicId] = useState<string | null>(null);
  const [customTopic, setCustomTopic] = useState('');
  const [panelSize, setPanelSize] = useState<number>(4);
  const [gdFormat, setGdFormat] = useState<string>('standard');
  const [duration, setDuration] = useState<number>(10);

  const handleCustomTopicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCustomTopic(e.target.value);
    if (e.target.value) {
      setSelectedTopicId('custom');
    } else if (selectedTopicId === 'custom') {
      setSelectedTopicId(null);
    }
  };

  const handleStart = () => {
    if (selectedTopicId) {
      const selectedTopicObj = PRESET_TOPICS.find((t) => t.id === selectedTopicId);
      const topicText = selectedTopicId === 'custom' ? customTopic : selectedTopicObj?.text || '';
      navigate('/room/session_' + Date.now(), {
        state: {
          topic: topicText,
          panelSize,
          format: gdFormat,
          duration,
        },
      });
    }
  };

  const isStartDisabled = !selectedTopicId;

  return (
    <div className="min-h-screen bg-ivory py-8 px-4 md:px-8 font-sans">
      <div className="max-w-4xl mx-auto flex flex-col gap-12 pb-24">
        {/* Header */}
        <div>
          <Link to="/" className="text-warm-gray hover:text-charcoal transition-colors mb-6 inline-block font-medium">
            &larr; Back
          </Link>
          <h1 className="font-serif text-3xl md:text-4xl text-charcoal">Set up your room</h1>
        </div>

        {/* Topic Selection */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-charcoal">1. Choose a Topic</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
            {PRESET_TOPICS.map((topic) => (
              <TopicCard
                key={topic.id}
                category={topic.category}
                topic={topic.text}
                selected={selectedTopicId === topic.id}
                onSelect={() => {
                  setSelectedTopicId(topic.id);
                  setCustomTopic('');
                }}
              />
            ))}
          </div>
          <div className="mt-2">
            <input
              type="text"
              placeholder="Or type your own topic..."
              value={customTopic}
              onChange={handleCustomTopicChange}
              className={`w-full p-4 rounded-lg border bg-surface transition-all focus:outline-none focus:ring-2 focus:ring-amber-cta/50 
                ${selectedTopicId === 'custom' ? 'ring-2 ring-amber-cta border-amber-cta' : 'border-stone-200'}`}
            />
          </div>
        </section>

        {/* Panel Size */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-charcoal">2. Panel Size</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {[3, 4, 5].map((size) => (
              <div
                key={size}
                onClick={() => setPanelSize(size)}
                className={`bg-surface border rounded-lg p-6 cursor-pointer transition-all hover:shadow-md flex flex-col items-center gap-6
                  ${panelSize === size ? 'ring-2 ring-amber-cta border-amber-cta' : 'border-stone-200'}`}
              >
                <div className="text-charcoal font-medium">{size} Participants</div>
                <div className="flex flex-wrap justify-center gap-2 md:gap-3">
                  {MOCK_PARTICIPANTS.slice(0, size).map((p, idx) => (
                    <ParticipantPreview
                      key={idx}
                      name={p.name}
                      trait={p.trait}
                      initial={p.initial}
                      color={p.color}
                    />
                  ))}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* GD Format */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-charcoal">3. Format</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { id: 'standard', label: 'Standard', desc: 'Normal discussion rules' },
              { id: 'case', label: 'Case-Based', desc: 'Focus on problem solving' },
              { id: 'abstract', label: 'Abstract', desc: 'Creative interpretation' },
              { id: 'fishbowl', label: 'Fishbowl', desc: 'Rotational speaking' },
            ].map((format) => (
              <div
                key={format.id}
                onClick={() => setGdFormat(format.id)}
                className={`bg-surface border rounded-lg p-4 cursor-pointer transition-all hover:shadow-md flex flex-col gap-1
                  ${gdFormat === format.id ? 'ring-2 ring-amber-cta border-amber-cta' : 'border-stone-200'}`}
              >
                <div className="text-charcoal font-medium">{format.label}</div>
                <div className="text-warm-gray text-xs">{format.desc}</div>
              </div>
            ))}
          </div>
        </section>

        {/* Duration */}
        <section className="flex flex-col gap-4">
          <h2 className="text-xl font-medium text-charcoal">4. Duration</h2>
          <div className="flex flex-wrap gap-4">
            {[8, 10, 15].map((mins) => (
              <button
                key={mins}
                onClick={() => setDuration(mins)}
                className={`px-6 py-3 rounded-full border font-medium transition-all
                  ${duration === mins 
                    ? 'bg-stone-800 text-white border-stone-800' 
                    : 'bg-surface text-charcoal border-stone-200 hover:border-stone-400'}`}
              >
                {mins} min
              </button>
            ))}
          </div>
        </section>

        {/* Start Button */}
        <div className="pt-8 border-t border-stone-200">
          <button
            onClick={handleStart}
            disabled={isStartDisabled}
            className={`w-full py-5 rounded-lg text-xl font-semibold transition-all duration-200 shadow-md
              ${isStartDisabled 
                ? 'bg-stone-200 text-stone-400 cursor-not-allowed' 
                : 'bg-amber-cta hover:bg-amber-cta-hover text-white'}`}
          >
            Start Discussion &rarr;
          </button>
        </div>
      </div>
    </div>
  );
};

export default SetupPage;
