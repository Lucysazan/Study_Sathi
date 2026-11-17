export type Round = {
  scene: string;
  clue: string;
  choices: string[];
  correct: number;
  why: string;
};
export const missions: Record<string, { title: string; intro: string; rounds: Round[] }> = {
  password: {
    title: 'Message detective',
    intro: 'Protect your treehouse club. Sort three mystery messages.',
    rounds: [
      {
        scene: '\u{1F4F1} \u{1F381} \u{1F510}',
        clue: 'Unknown sender: You won a prize! Send your login code now!',
        choices: ['Share my code', 'Stop and ask a trusted adult', 'Forward to everyone'],
        correct: 1,
        why: 'Your login code is a key. Keep it private, even when someone promises a prize.',
      },
      {
        scene: '\u{1F4EC} \u26A0\uFE0F \u{1F517}',
        clue: 'A link says: Pay now or your account will close!',
        choices: ['Pay quickly', 'Open every link', 'Check the official service separately'],
        correct: 2,
        why: 'Urgency can be a trick. Open the official service yourself and check with a trusted adult.',
      },
      {
        scene: '\u{1F3E1} \u{1F4F8} \u{1F512}',
        clue: 'Your club photo shows your home address. Ready to post?',
        choices: ['Keep the address private', 'Post it everywhere', 'Add my phone number too'],
        correct: 0,
        why: 'Check what a photo reveals. Keep your home address and other personal details private.',
      },
    ],
  },
  recycle: {
    title: 'Rescue the garden',
    intro: 'Give each item a useful next stop. Three good choices grow your garden.',
    rounds: [
      {
        scene: '\u{1FAD9}',
        clue: 'A clean, usable refillable bottle. Where should it go?',
        choices: ['Use again', 'Open fire', 'Street'],
        correct: 0,
        why: 'A suitable refillable bottle can be used again instead of becoming litter.',
      },
      {
        scene: '\u{1F50B}',
        clue: 'A used battery. Choose its safe next stop.',
        choices: ['Food compost', 'Suitable battery collection', 'Open fire'],
        correct: 1,
        why: 'Ask an adult about local battery collection. Batteries do not belong in compost or a fire.',
      },
      {
        scene: '\u{1F34C}',
        clue: 'A banana peel. Your school has a managed food-compost bin.',
        choices: ['Street', 'Battery collection', 'Food-compost bin'],
        correct: 2,
        why: 'Where a suitable system exists, food scraps can become compost for plants.',
      },
    ],
  },
  reading: {
    title: 'The missing garden clue',
    intro: 'Read the little story. Collect three clues to solve the case.',
    rounds: [
      {
        scene: '\u{1F331} \u{1F50D} \u{1F4D3}',
        clue: 'Mina planted a seed. Each morning she measured it and drew its leaves in her notebook. What was she doing?',
        choices: ['Learning by observing', 'Selling notebooks', 'Making the plant grow instantly'],
        correct: 0,
        why: 'Measuring and drawing are observations: Mina is recording changes.',
      },
      {
        scene: '\u2600\uFE0F \u{1FABA} \u{1F33F}',
        clue: 'One pot stood beside a sunny window. Another stood in a dark cupboard. Mina gave both the same amount of water. What did she change?',
        choices: ['The amount of water', 'The light', 'The notebook'],
        correct: 1,
        why: 'She kept water the same and changed the light. That helps her compare what happens.',
      },
      {
        scene: '\u{1F4D6} \u{1F33B} \u{1F4A1}',
        clue: 'The school garden let Mina observe, compare and record plant growth. Choose the best title for her story.',
        choices: ['All pots cost the same', 'Never write things down', 'A garden for discovery'],
        correct: 2,
        why: 'The main idea connects all the clues: learning by exploring a garden.',
      },
    ],
  },
  'study-habits': {
    title: 'Launch your learning rocket',
    intro: 'Build a plan that can fly. Choose your cargo, fuel and flight check.',
    rounds: [
      {
        scene: '\u{1F680} \u{1F4E6}',
        clue: 'First, pack one small goal. Which cargo fits this mission?',
        choices: ['Learn everything today', 'Solve three fraction examples', 'Be perfect forever'],
        correct: 1,
        why: 'Three examples is a clear, manageable goal. You know where to start.',
      },
      {
        scene: '\u{1F680} \u2728 \u{1F9E0}',
        clue: 'Fuel the rocket. You have read an example. What comes next?',
        choices: ['Recall it without looking', 'Copy it without thinking', 'Skip every hard part'],
        correct: 0,
        why: 'Trying to recall an idea shows what you can explain and what needs more practice.',
      },
      {
        scene: '\u{1F680} \u{1FA90} \u2705',
        clue: 'Flight check! You are unsure about your answer.',
        choices: ['Hide the problem', 'Assume it is right', 'Compare, ask for help and retry'],
        correct: 2,
        why: 'Checking a reliable explanation and asking for help can reveal what to try next.',
      },
    ],
  },
};
