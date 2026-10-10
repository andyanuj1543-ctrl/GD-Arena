import React from 'react';
import { Link } from 'react-router';
import GradeBadge from '../components/GradeBadge';
import SpeakingChart from '../components/SpeakingChart';
import FeedbackCard from '../components/FeedbackCard';
import MissedOpenings from '../components/MissedOpenings';
import { TranscriptEntry } from '../components/TranscriptPanel';

const mockSpeakingData = [
  { name: 'You', seconds: 120, percentage: 20, color: '#44403c' },
  { name: 'Arjun', seconds: 180, percentage: 30, color: '#dc2626' },
  { name: 'Priya', seconds: 150, percentage: 25, color: '#2563eb' },
  { name: 'Rohit', seconds: 90, percentage: 15, color: '#059669' },
  { name: 'Meera', seconds: 60, percentage: 10, color: '#9333ea' },
];

const mockFeedback = [
  {
    category: 'Idea Generation',
    score: 7,
    feedback: 'You brought up some valid points regarding the economic implications, but could have expanded more on the social impact.',
    evidence: [
      { quote: "I think the cost of implementation will be a major hurdle for small businesses.", analysis: "Good practical insight, but lacked follow-up on how to address it." }
    ]
  },
  {
    category: 'Active Listening',
    score: 9,
    feedback: 'Excellent job building upon others\' ideas. You consistently validated your peers before introducing your perspective.',
    evidence: [
      { quote: "Adding to what Priya mentioned about scalability, we also need to consider...", analysis: "Perfect example of acknowledging a peer and seamlessly transitioning to your point." }
    ]
  }
];

const mockOpenings = [
  {
    timestamp: '03:15',
    context: 'Arjun made a strong assertion that AI will replace 50% of jobs within 5 years. There was a 3-second pause.',
    suggestion: 'You could have challenged this specific figure or asked for the source of his premise: "That\'s a bold estimate, Arjun. While some roles will evolve, historically technology has also created new sectors..."'
  }
];

const mockTranscript: TranscriptEntry[] = [
  { speaker: 'Arjun', text: 'Let\'s start by defining the core issue here.', timestamp: 1000, isFinal: true },
  { speaker: 'You', text: 'I agree, definitions are crucial before we dive into solutions.', timestamp: 5000, isFinal: true }
];

export default function ReportPage() {
  const currentDate = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="bg-ivory min-h-screen text-charcoal pb-20">
      <div className="max-w-3xl mx-auto px-6 py-12 space-y-12">
        
        <header className="text-center space-y-2">
          <h1 className="font-serif text-4xl">Your Assessment</h1>
          <p className="text-warm-gray">Session completed on {currentDate}</p>
        </header>

        <section className="flex justify-center">
          <GradeBadge grade="B+" summary="Strong analytical skills, needs more assertive interventions." />
        </section>

        <section className="bg-surface rounded-xl p-6 shadow-sm border border-stone-100">
          <SpeakingChart distribution={mockSpeakingData} />
        </section>

        <section>
          <h2 className="font-serif text-2xl mb-6">Detailed Feedback</h2>
          {mockFeedback.map((fb, idx) => (
            <FeedbackCard key={idx} {...fb} />
          ))}
        </section>

        <section>
          <MissedOpenings openings={mockOpenings} />
        </section>

        <section className="bg-surface rounded-xl p-6 shadow-sm border border-stone-100">
          <details className="group">
            <summary className="font-serif text-xl cursor-pointer list-none flex justify-between items-center">
              Full Transcript
              <span className="transition group-open:rotate-180">
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"></polyline></svg>
              </span>
            </summary>
            <div className="mt-4 space-y-4 border-t border-stone-100 pt-4">
              {mockTranscript.map((entry, idx) => (
                <div key={idx} className="text-sm">
                  <span className={`font-medium ${entry.speaker === 'You' ? 'text-amber-900' : 'text-stone-700'}`}>
                    {entry.speaker}: 
                  </span>
                  <span className="text-charcoal ml-2">{entry.text}</span>
                </div>
              ))}
            </div>
          </details>
        </section>

        <div className="flex justify-center pt-8 border-t border-stone-200">
          <Link 
            to="/setup" 
            className="px-8 py-4 bg-amber-cta hover:bg-amber-cta-hover text-white rounded-lg font-medium text-lg transition-colors shadow-sm"
          >
            Start Another Round &rarr;
          </Link>
        </div>

      </div>
    </div>
  );
}
