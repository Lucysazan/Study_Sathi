export type StudyQuestion = {
  id: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type StudyActivity = {
  id: string;
  title: string;
  subject: string;
  ages: string;
  summary: string;
  notes: string[];
  task: string;
  questions: StudyQuestion[];
  simulation?: string;
  widget?: string;
  version: number;
};
export const studyActivities: StudyActivity[] = [
  {
    id: 'fractions',
    title: 'Build and compare fractions',
    subject: 'Mathematics',
    ages: 'Classes 4-7',
    summary: 'See how equal parts make a whole.',
    notes: [
      'The denominator tells us how many equal parts form one whole. The numerator tells us how many parts we have.',
      'Two quarters cover the same amount as one half. The pieces must come from equal-sized wholes.',
    ],
    task: 'Build one half, then build two quarters. Compare their sizes.',
    questions: [
      {
        id: 'f1',
        prompt: 'What does the denominator in 3/4 tell us?',
        options: ['Four equal parts make the whole', 'Three wholes', 'Four selected parts'],
        answer: 0,
        explanation: 'The denominator describes the number of equal parts in one whole.',
      },
      {
        id: 'f2',
        prompt: 'Which equals 1/2?',
        options: ['1/4', '2/4', '3/4'],
        answer: 1,
        explanation: 'Two of four equal parts cover half the whole.',
      },
      {
        id: 'f3',
        prompt: 'Which is larger for the same whole?',
        options: ['1/4', 'They are equal', '3/4'],
        answer: 2,
        explanation: 'Three quarters contain more equal parts than one quarter.',
      },
    ],
    simulation: 'fractions-intro',
    version: 1,
  },
  {
    id: 'balance',
    title: 'Balance a lever',
    subject: 'Science',
    ages: 'Classes 6-9',
    summary: 'Explore how mass and distance affect balance.',
    notes: [
      'A mass farther from the pivot has a greater turning effect.',
      'A lever can balance when the turning effects on its two sides are equal. Compare mass multiplied by distance on each side.',
    ],
    task: 'Place a mass two units from the pivot. Try balancing it with twice that mass at one unit.',
    questions: [
      {
        id: 'b1',
        prompt: 'How can a small mass balance a larger mass?',
        options: [
          'Place it farther from the pivot',
          'Always put it at the pivot',
          'Remove the pivot',
        ],
        answer: 0,
        explanation: 'A greater distance can compensate for a smaller mass.',
      },
      {
        id: 'b2',
        prompt: 'A 2 kg mass is 3 units from the pivot. Which balances it?',
        options: ['1 kg at 1 unit', '3 kg at 2 units', '2 kg at 1 unit'],
        answer: 1,
        explanation: 'Both sides have mass times distance equal to six.',
      },
      {
        id: 'b3',
        prompt: 'What happens to turning effect when distance increases, with mass unchanged?',
        options: ['It disappears', 'It stays the same', 'It increases'],
        answer: 2,
        explanation: 'Turning effect increases with perpendicular distance from the pivot.',
      },
    ],
    simulation: 'balancing-act',
    version: 1,
  },
  {
    id: 'circuits',
    title: 'Make a complete circuit',
    subject: 'Science',
    ages: 'Classes 6-10',
    summary: 'Find out why a bulb needs a closed path.',
    notes: [
      'An electric circuit needs a complete conducting path for a steady current.',
      'A battery supplies energy. An open switch breaks the path. Use the simulation only; do not experiment with mains electricity.',
    ],
    task: 'Connect a battery, wires and a bulb. Open one connection and observe what changes.',
    questions: [
      {
        id: 'c1',
        prompt: 'Which circuit can light a working bulb?',
        options: [
          'A complete conducting loop with a suitable battery',
          'A wire with a gap',
          'A bulb with no energy source',
        ],
        answer: 0,
        explanation: 'A complete circuit and suitable energy source are needed.',
      },
      {
        id: 'c2',
        prompt: 'What does an open switch do?',
        options: ['Adds a battery', 'Breaks the conducting path', 'Creates light'],
        answer: 1,
        explanation: 'Opening the switch interrupts the current path.',
      },
      {
        id: 'c3',
        prompt: 'Where should you try this activity?',
        options: ['At a wall socket', 'On exposed mains wires', 'Inside the simulation'],
        answer: 2,
        explanation: 'Use the virtual simulation, not mains electricity.',
      },
    ],
    simulation: 'circuit-construction-kit-dc',
    version: 1,
  },
  {
    id: 'budget',
    title: 'Plan a small budget',
    subject: 'Financial Literacy',
    ages: 'Ages 10-16',
    summary: 'Choose spending that leaves money for your goal.',
    notes: [
      'A budget is a plan for money coming in and going out.',
      'Subtract expenses from your available money. Saving means keeping some money for later. Needs and wants can depend on your situation.',
    ],
    task: 'You have Rs 100. Adjust spending and try to keep at least Rs 20.',
    questions: [
      {
        id: 'm1',
        prompt: 'You have Rs 100 and spend Rs 65. What remains?',
        options: ['Rs 35', 'Rs 65', 'Rs 165'],
        answer: 0,
        explanation: '100 minus 65 is 35.',
      },
      {
        id: 'm2',
        prompt: 'What is a budget?',
        options: [
          'A promise that prices never change',
          'A plan for income and spending',
          'A way to create unlimited money',
        ],
        answer: 1,
        explanation: 'A budget helps you plan how to use available money.',
      },
      {
        id: 'm3',
        prompt: 'Which plan leaves Rs 20 from Rs 100?',
        options: ['Spend Rs 110', 'Spend Rs 100', 'Spend Rs 80'],
        answer: 2,
        explanation: '100 minus 80 leaves 20.',
      },
    ],
    widget: 'budget',
    version: 1,
  },
  {
    id: 'digital-safety',
    title: 'Spot an unsafe message',
    subject: 'Digital Safety',
    ages: 'Ages 10-16',
    summary: 'Practise safer choices before sharing information.',
    notes: [
      'Keep passwords and one-time verification codes private.',
      'Urgency and unexpected prizes can be warning signs. Verify through a trusted official channel instead of an unexpected link. Ask a trusted adult when unsure.',
    ],
    task: 'Explore the message choices, then explain which action protects your account.',
    questions: [
      {
        id: 'd1',
        prompt: 'A stranger asks for your one-time login code. What should you do?',
        options: [
          'Keep it private and stop the conversation',
          'Share it quickly',
          'Post it publicly',
        ],
        answer: 0,
        explanation: 'A verification code can give someone access to your account.',
      },
      {
        id: 'd2',
        prompt: 'An unexpected prize link demands an urgent payment. What is safer?',
        options: [
          'Pay before the offer expires',
          'Check through a trusted official channel',
          'Send your password',
        ],
        answer: 1,
        explanation:
          'Independently verify unexpected claims rather than following the message link.',
      },
      {
        id: 'd3',
        prompt: 'Who can help if a message worries you?',
        options: ['Only the unknown sender', 'Nobody', 'A trusted adult'],
        answer: 2,
        explanation: 'A trusted adult can help assess the situation and report concerns.',
      },
    ],
    widget: 'password',
    version: 1,
  },
  {
    id: 'waste',
    title: 'Choose a useful waste action',
    subject: 'Environment',
    ages: 'Ages 10-16',
    summary: 'Practise reducing waste and handling items safely.',
    notes: [
      'Using an item again can avoid unnecessary waste. Separate materials according to local collection rules.',
      'Batteries and electronic waste need suitable collection. Do not burn them or put them into food compost.',
    ],
    task: 'Choose an action for each item and read why it helps.',
    questions: [
      {
        id: 'w1',
        prompt: 'What can you do with a usable refillable bottle?',
        options: ['Reuse it', 'Burn it', 'Discard it after every use'],
        answer: 0,
        explanation: 'Reusing a suitable bottle avoids repeated single-use waste.',
      },
      {
        id: 'w2',
        prompt: 'What is appropriate for a used battery?',
        options: ['Food compost', 'A suitable battery collection point', 'An open fire'],
        answer: 1,
        explanation:
          'Batteries need appropriate collection; they should not be burned or composted.',
      },
      {
        id: 'w3',
        prompt: 'Why check local recycling guidance?',
        options: [
          'All places accept every material',
          'It makes waste disappear',
          'Accepted materials differ between places',
        ],
        answer: 2,
        explanation: 'Local collection systems accept different materials.',
      },
    ],
    widget: 'recycle',
    version: 1,
  },
  {
    id: 'reading',
    title: 'Read and explain an idea',
    subject: 'Reading',
    ages: 'Ages 10-16',
    summary: 'Practise finding the main point and supporting details.',
    notes: [
      'A main idea explains what a passage is mainly about. Details support that idea.',
      'After reading a paragraph, explain it in your own words. Check the paragraph again for anything you missed.',
    ],
    task: 'Read this: A school garden gives students a place to grow plants. Students observe changes and record their findings. Then identify its main idea.',
    questions: [
      {
        id: 'r1',
        prompt: 'What is the passage mainly about?',
        options: [
          'How a school garden supports learning',
          'How to sell all plants',
          'Why observations are unnecessary',
        ],
        answer: 0,
        explanation: 'The details explain students learning through a school garden.',
      },
      {
        id: 'r2',
        prompt: 'Which detail supports the main idea?',
        options: [
          'All gardens are the same size',
          'Students observe changes and record findings',
          'Every plant grows instantly',
        ],
        answer: 1,
        explanation: 'Observation and recording are examples of learning activities.',
      },
      {
        id: 'r3',
        prompt: 'How can you check your understanding?',
        options: [
          'Skip unfamiliar ideas',
          'Copy without reading',
          'Explain the idea in your own words and compare',
        ],
        answer: 2,
        explanation: 'Explaining and checking can reveal a misunderstanding.',
      },
    ],
    version: 1,
  },
  {
    id: 'study-habits',
    title: 'Make a practical study plan',
    subject: 'Life Skills',
    ages: 'Ages 10-16',
    summary: 'Choose a small goal and check what you understood.',
    notes: [
      'Choose a specific task you can finish, such as solving three examples.',
      'Try recalling an idea without looking, then check your answer. Revisit difficult parts and ask for help when needed.',
    ],
    task: 'Choose one topic, write a small goal, and explain how you will check your understanding.',
    questions: [
      {
        id: 's1',
        prompt: 'Which is the most specific study goal?',
        options: [
          'Solve three fraction examples',
          'Become perfect at everything',
          'Study something eventually',
        ],
        answer: 0,
        explanation: 'A specific task makes it easier to begin and check progress.',
      },
      {
        id: 's2',
        prompt: 'What should you do after recalling an idea?',
        options: [
          'Assume it must be correct',
          'Compare it with a reliable explanation',
          'Never revisit it',
        ],
        answer: 1,
        explanation: 'Checking helps you notice and correct errors.',
      },
      {
        id: 's3',
        prompt: 'If you remain confused, what is useful?',
        options: [
          'Hide the problem',
          'Guess and stop',
          'Ask for an explanation and try another example',
        ],
        answer: 2,
        explanation: 'Help and another example can clarify a difficult idea.',
      },
    ],
    version: 1,
  },
];
export function findStudyActivity(id: string) {
  return studyActivities.find((a) => a.id === id);
}
export function activitiesForCategory(category: string) {
  const ids: Record<string, string[]> = {
    'Academic Education': ['fractions', 'circuits', 'reading'],
    'Learning Games': ['fractions', 'balance', 'circuits'],
    'Financial Literacy': ['budget'],
    'Digital Safety': ['digital-safety'],
    Environment: ['waste'],
    'Life Skills': ['study-habits'],
  };
  return studyActivities.filter((a) => (ids[category] || ['reading']).includes(a.id));
}
export function simulationUrl(id: string) {
  return ['fractions-intro', 'balancing-act', 'circuit-construction-kit-dc'].includes(id)
    ? 'https://phet.colorado.edu/sims/html/' + id + '/latest/' + id + '_en.html'
    : null;
}
