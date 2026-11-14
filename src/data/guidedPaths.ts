import type { LearningPath } from '@/types/catalog';
export type TrailLink = { href: string; label: string; provider: string; external?: boolean };

/** Authored link trails, separate from admin-managed Firestore paths. No provider media copied. */
export const guidedPaths: readonly LearningPath[] = [
  {
    id: 'english-adventure',
    title: 'My English adventure',
    category: 'Academic Education',
    age: '6-12',
    description:
      'Play with words, listen to stories and explain an idea. Featuring British Council LearnEnglish Kids.',
    goal: 'Try a few new words and tell someone what you learned. Choose a level that feels right.',
    steps: [
      {
        title: 'Play with words',
        description:
          'Choose a topic you like on LearnEnglish Kids. Try one word game. Say three new words out loud.',
      },
      {
        title: 'Listen to a story',
        description:
          'Pick a short story on LearnEnglish Kids. Watch or listen, then tell someone what happened.',
      },
      {
        title: 'Be a reading detective',
        description:
          'Come back for our short reading activity. Look for the main idea in a passage.',
      },
      {
        title: 'Make the words yours',
        description: 'Say or write one sentence with a new word. You can draw a picture too.',
        prompt: 'Which new words would you like to remember?',
      },
    ],
  },
  {
    id: 'maths-world',
    title: 'My maths adventure',
    category: 'Learning Games',
    age: '6-12',
    description:
      'Explore a maths map, try an activity and explain your thinking. Featuring e-learning for Kids.',
    goal: 'Choose one small maths activity at your level. Take your time and try again if you need to.',
    steps: [
      {
        title: 'Choose your maths world',
        description:
          'Open the e-learning for Kids Grade 1 map for early number practice. Use its grade menu if you need a different level.',
      },
      {
        title: 'Try one map activity',
        description:
          'Pick a stop on the provider map. Work through one activity, then come back. Ask an adult if you need help choosing.',
      },
      {
        title: 'Explore equal parts',
        description:
          'Ready for a different challenge? Try our fractions game here. Ask an adult if fractions are new to you.',
      },
      {
        title: 'Show your thinking',
        description:
          'Draw or explain something you worked out. A completed stop means you took part, not that you passed a test.',
        prompt: 'What did you try? What would you like to practise next?',
      },
    ],
  },
];
export const guidedPathLinks: Readonly<Record<string, Readonly<Record<number, TrailLink>>>> = {
  'english-adventure': {
    0: {
      href: 'https://learnenglishkids.britishcouncil.org/grammar-vocabulary/word-games',
      label: 'Play word games',
      provider: 'British Council / LearnEnglish Kids',
      external: true,
    },
    1: {
      href: 'https://learnenglishkids.britishcouncil.org/listen-watch/short-stories',
      label: 'Choose a short story',
      provider: 'British Council / LearnEnglish Kids',
      external: true,
    },
    2: {
      href: '/play/reading',
      label: 'Try reading detective',
      provider: 'StudySathi original activity',
    },
  },
  'maths-world': {
    0: {
      href: 'https://math-world.e-learningforkids.org/en/grade-1/map',
      label: 'Open the maths map',
      provider: 'e-learning for Kids',
      external: true,
    },
    1: {
      href: 'https://math-world.e-learningforkids.org/en/grade-1/map',
      label: 'Choose a map activity',
      provider: 'e-learning for Kids',
      external: true,
    },
    2: {
      href: '/play/fractions',
      label: 'Try the fractions game',
      provider: 'StudySathi / attributed PhET simulation',
    },
  },
};
