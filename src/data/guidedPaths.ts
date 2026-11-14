import type { LearningPath } from '@/types/catalog';
/** Original playable trails, separate from admin-managed Firestore paths. No provider media copied. */
export const guidedPaths: readonly LearningPath[] = [
  {
    id: 'english-adventure',
    title: 'My English adventure',
    category: 'Academic Education',
    age: '6-12',
    description:
      'Spell picture words and turn the pages of an original story. Play every activity right here.',
    goal: 'Try a few new words and tell someone what you learned. Choose a level that feels right.',
    steps: [
      {
        title: 'Play with words',
        description: 'Meet our animal friends. Tap the letter tiles to grow a word.',
      },
      {
        title: 'Mina and the little seed',
        description:
          'Turn the picture-book pages. Read together, or try your device reading voice.',
      },
      {
        title: 'Be a reading detective',
        description: 'Think about Mina and her plant. Tell the story in your own words.',
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
      'Pick apples, hop across a number river and share a pizza. All games play right here.',
    goal: 'Choose one small maths activity at your level. Take your time and try again if you need to.',
    steps: [
      {
        title: 'An apple picnic',
        description: 'Pick the right number of apples for your picnic basket.',
      },
      {
        title: 'Hop across the river',
        description: 'Help a little frog reach its goal with hops of one or two.',
      },
      {
        title: 'Explore equal parts',
        description: 'Try sharing a pizza in equal parts. Add slices to make a whole.',
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
