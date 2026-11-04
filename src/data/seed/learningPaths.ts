import type { LearningPath } from '@/types/catalog';

/** The three fixed learning paths from the prototype (seed source for Firestore in Phase 2). */
export const learningPaths: readonly LearningPath[] = [
  {
    id: 'stay-safe-online',
    title: 'Stay Safe Online',
    description: 'Build good habits for a safer, kinder digital world.',
    age: '10–14',
    category: 'Digital Safety',
    goal: 'Recognize online risks, protect personal information, and practice kindness.',
    steps: [
      {
        title: 'Get to know internet safety',
        description: 'Explore the five foundations of digital safety with Be Internet Awesome.',
        resource: '5',
      },
      {
        title: 'Put your skills into play',
        description: 'Practice spotting online risks and making thoughtful choices in Interland.',
        resource: '6',
      },
      {
        title: 'Learn together',
        description:
          'With an adult, choose a Common Sense lesson on privacy or cyberbullying. An educator account may be needed.',
        resource: '9',
      },
      {
        title: 'Pause and reflect',
        description: 'What would you do if someone online asked for your password?',
        prompt: 'Write your response in your own words.',
      },
    ],
  },
  {
    id: 'learn-about-money',
    title: 'Learn About Money',
    description: 'Small steps toward saving, spending, and planning wisely.',
    age: '10–16',
    category: 'Financial Literacy',
    goal: 'Identify needs and wants, set a saving goal, and make a simple budget.',
    steps: [
      {
        title: 'Meet your money',
        description:
          'Explore money conversations and activities. Some examples use US dollars; discuss how they relate to Nepal.',
        resource: '7',
      },
      {
        title: 'Start a saving habit',
        description: 'Try a saving activity with a parent or teacher.',
        resource: '8',
      },
      {
        title: 'Needs or wants?',
        description:
          'Name three things you need and three things you want. Which would you buy first?',
        prompt: 'Write your needs and wants.',
      },
      {
        title: 'Plan your NPR 500',
        description:
          'Imagine you have NPR 500 for a week. Plan how much to spend on needs, wants, and savings.',
        budget: true,
      },
    ],
  },
  {
    id: 'explore-mathematics',
    title: 'Explore Mathematics',
    description: 'See familiar ideas in a new way, one activity at a time.',
    age: '10–14',
    category: 'Academic Education',
    goal: 'Explore a math concept, experiment with it, and describe what you learned.',
    steps: [
      {
        title: 'Choose a math lesson',
        description: 'Open E-Paath and select a mathematics lesson suitable for your grade.',
        resource: '1',
      },
      {
        title: 'Experiment and discover',
        description:
          'Choose an age-appropriate mathematics simulation in PhET. Try changing one thing at a time.',
        resource: '11',
      },
      {
        title: 'Make practice playful',
        description: 'Explore a math game with OLE Nepal.',
        resource: '10',
      },
      {
        title: 'What did you discover?',
        description: 'Explain one new idea and one question you still have.',
        prompt: 'Write your reflection.',
      },
    ],
  },
];
