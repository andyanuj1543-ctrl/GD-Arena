import { personalities } from '../participants/personalities.js';
import { TranscriptEntry } from '../types.js';

export const contextBuilder = {
  buildPrompt(participantId: string, transcript: TranscriptEntry[], phase: string, topic: string) {
    const personality = personalities[participantId];
    if (!personality) throw new Error(`Unknown personality: ${participantId}`);
    
    const recentTranscript = transcript.slice(-10).map(t => `${t.speaker}: ${t.text}`).join('\n');
    
    let phaseInstructions = '';
    if (phase === 'OPENING') {
      phaseInstructions = 'This is the opening of the discussion. State your initial stance on the topic.';
    } else if (phase === 'CLOSING') {
      phaseInstructions = 'This is the closing round. Summarize your final thoughts concisely.';
    } else {
      phaseInstructions = 'Engage with the ongoing discussion. Respond to previous speakers.';
    }

    const systemPrompt = `${personality.systemPrompt}
    
Current Topic: ${topic}
Current Phase: ${phase}

Instructions:
1. ${phaseInstructions}
2. Keep your response to 2-3 sentences MAXIMUM.
3. Reference what other speakers said by name if applicable.
4. Speak in character using your assigned traits and verbal tics.`;

    const messages = [
      { role: 'user', content: `System Instructions:\n${systemPrompt}` },
      { role: 'user', content: `Here is the recent discussion transcript:\n\n${recentTranscript || '(No previous messages, you are starting)'}\n\nWhat do you say next?` }
    ];

    return messages;
  }
};
