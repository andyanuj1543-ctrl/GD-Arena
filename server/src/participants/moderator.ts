import { personalities } from './personalities.js';

export const moderator = {
  generateOpeningStatement(topic: string, participantIds: string[], format: string): string {
    const names = participantIds.map(id => personalities[id]?.name || id).join(', ');
    return `Welcome everyone to today's group discussion. Our topic is "${topic}". We have ${names}, and the student with us today. Let's keep the discussion respectful and concise. We will follow a ${format} format. You may begin now.`;
  },
  
  generateTimeWarning(minutesRemaining: number): string {
    return `Just a quick time check, everyone. We have about ${minutesRemaining} minutes remaining in the discussion phase.`;
  },
  
  generateClosingPrompt(participantIds: string[]): string {
    return `Alright, time is up for the open discussion. Let's move to the closing round. Please provide your brief concluding thoughts.`;
  },
  
  generateParticipantNudge(participantName: string): string {
    return `We haven't heard much from ${participantName} recently. Would you like to share your perspective?`;
  }
};
