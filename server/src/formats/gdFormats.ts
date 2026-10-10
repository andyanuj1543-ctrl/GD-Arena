import { FormatConfig } from '../types.js';

export const formats: Record<string, FormatConfig> = {
  standard: {
    id: 'standard',
    name: 'Standard',
    description: 'Normal free-flowing GD, opening + discussion + closing',
    getPhaseTimings: (duration) => ({
      opening: Math.max(1, Math.floor(duration * 0.15)),
      discussion: Math.max(1, Math.floor(duration * 0.7)),
      closing: Math.max(1, Math.floor(duration * 0.15)),
    }),
    specialInstructions: 'Standard open discussion.',
  },
  caseBased: {
    id: 'case-based',
    name: 'Case-Based',
    description: 'Case study presented first, then discussion of recommendations',
    getPhaseTimings: (duration) => ({
      opening: Math.max(1, Math.floor(duration * 0.2)),
      discussion: Math.max(1, Math.floor(duration * 0.6)),
      closing: Math.max(1, Math.floor(duration * 0.2)),
    }),
    specialInstructions: 'Focus on practical recommendations and analyzing the case facts.',
  },
  abstract: {
    id: 'abstract',
    name: 'Abstract',
    description: 'Abstract topic, encourage creative interpretation first',
    getPhaseTimings: (duration) => ({
      opening: Math.max(1, Math.floor(duration * 0.25)),
      discussion: Math.max(1, Math.floor(duration * 0.6)),
      closing: Math.max(1, Math.floor(duration * 0.15)),
    }),
    specialInstructions: 'Interpret the topic creatively. Bring in varied perspectives.',
  },
  fishbowl: {
    id: 'fishbowl',
    name: 'Fishbowl',
    description: 'AI-only discussion for first part, then student joins',
    getPhaseTimings: (duration) => ({
      opening: Math.max(1, Math.floor(duration * 0.1)),
      discussion: Math.max(1, Math.floor(duration * 0.8)),
      closing: Math.max(1, Math.floor(duration * 0.1)),
    }),
    specialInstructions: 'AI starts the discussion, student observes then jumps in.',
  },
};
