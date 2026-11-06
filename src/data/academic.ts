import type { Chapter, SourceRecord } from '@/lib/academic/types';

// Original StudySathi practice, not copied CDC text. These are topic units, not verified
// textbook chapter numbers. Teacher/edition/page mapping is explicitly still pending.
export const academicSources: SourceRecord[] = [
  {
    id: 'cdc-maths-9-2022',
    title: 'Mathematics Grade 9 (English Translation)',
    publisher: 'Curriculum Development Centre, Nepal',
    url: 'https://lib.moecdc.gov.np/catalog/opac_css/index.php?id=13786&lvl=notice_display',
    edition: '2022 edition listed in the CDC library; current-edition mapping pending',
    checked: '2026-11-06',
    mode: 'link',
    permissionNote:
      'Official catalog reference only. PDF availability and permission to embed or host have not been verified. No textbook has been copied.',
  },
];

export const academicChapters: Chapter[] = [
  {
    id: 'sets',
    title: 'Sets',
    summary: 'Describe collections and find shared or combined elements.',
    objectives: ['Recognize elements of a set.', 'Find the union and intersection of two sets.'],
    skills: [
      {
        id: 'membership',
        title: 'Elements and membership',
        explanation:
          'A set is a well-defined collection of distinct objects. The symbol ∈ means “is an element of”. Repeating an element does not make the set larger.',
        example: 'If A = {2, 4, 6}, is 4 ∈ A? How many elements are in A?',
        steps: [
          'Look for 4 in the collection: it is present.',
          'Therefore 4 ∈ A.',
          'The distinct elements are 2, 4 and 6, so n(A) = 3.',
        ],
      },
      {
        id: 'operations',
        title: 'Union and intersection',
        explanation:
          'A ∪ B contains every element in either set, written once. A ∩ B contains only the elements shared by both sets.',
        example: 'A = {1, 2, 3}, B = {3, 4}. Find A ∪ B and A ∩ B.',
        steps: [
          'Collect all distinct elements: 1, 2, 3, 4.',
          'A ∪ B = {1, 2, 3, 4}.',
          'Only 3 appears in both sets, so A ∩ B = {3}.',
        ],
      },
    ],
    questions: [
      {
        id: 'sets-c1',
        skillId: 'membership',
        prompt: 'A = {2, 4, 6}. Which number belongs to A?',
        options: ['3', '4', '5'],
        answer: 1,
        explanation: '4 is explicitly listed in A; 3 and 5 are not.',
      },
      {
        id: 'sets-c2',
        skillId: 'membership',
        prompt: 'How many distinct elements are in {1, 1, 2, 3}?',
        options: ['4', '2', '3'],
        answer: 2,
        explanation: 'Repeated 1 counts once. The distinct elements are 1, 2 and 3.',
      },
      {
        id: 'sets-c3',
        skillId: 'operations',
        prompt: 'A = {1, 2}, B = {2, 3}. What is A ∩ B?',
        options: ['{2}', '{1, 2, 3}', '{}'],
        answer: 0,
        explanation: 'Intersection means shared elements. Only 2 is in both sets.',
      },
      {
        id: 'sets-c4',
        skillId: 'operations',
        prompt: 'A = {1, 2}, B = {2, 3}. What is A ∪ B?',
        options: ['{2}', '{1, 2, 2, 3}', '{1, 2, 3}'],
        answer: 2,
        explanation: 'Union includes all distinct elements, with 2 written only once.',
      },
    ],
    followUp: [
      {
        id: 'sets-f1',
        skillId: 'membership',
        prompt: 'B = {5, 10, 15}. Which statement is true?',
        options: ['7 ∈ B', '10 ∈ B', '20 ∈ B'],
        answer: 1,
        explanation: '10 is a listed element of B.',
      },
      {
        id: 'sets-f2',
        skillId: 'membership',
        prompt: 'How many elements are in {a, b, a, c, b}?',
        options: ['5', '4', '3'],
        answer: 2,
        explanation: 'Only a, b and c are distinct.',
      },
      {
        id: 'sets-f3',
        skillId: 'operations',
        prompt: 'P = {2, 4}, Q = {4, 6}. Find P ∩ Q.',
        options: ['{4}', '{2, 4, 6}', '{2, 6}'],
        answer: 0,
        explanation: '4 is the only shared element.',
      },
      {
        id: 'sets-f4',
        skillId: 'operations',
        prompt: 'P = {2, 4}, Q = {4, 6}. Find P ∪ Q.',
        options: ['{4}', '{2, 4, 6}', '{2, 6}'],
        answer: 1,
        explanation: 'The combined distinct elements are 2, 4 and 6.',
      },
    ],
  },
  {
    id: 'real-numbers',
    title: 'Real numbers',
    summary: 'Recognize rational and irrational numbers, and compare negative values.',
    objectives: [
      'Distinguish rational and irrational numbers.',
      'Order positive and negative numbers.',
    ],
    skills: [
      {
        id: 'classification',
        title: 'Rational and irrational numbers',
        explanation:
          'A rational number can be written as p/q, where p and q are integers and q is not zero. Terminating and recurring decimals are rational. An irrational number cannot be written in that form.',
        example: 'Classify 0.75 and √2.',
        steps: [
          '0.75 = 75/100 = 3/4, so it is rational.',
          '√2 has a non-terminating, non-recurring decimal expansion.',
          '√2 is irrational. But √9 = 3 is rational: a square-root sign alone does not make a number irrational.',
        ],
      },
      {
        id: 'ordering',
        title: 'Ordering numbers',
        explanation:
          'Numbers further right on a number line are greater. Among negative numbers, the one closer to zero is greater.',
        example: 'Which is greater: −3 or −7?',
        steps: [
          'Both numbers are left of zero.',
          '−3 is to the right of −7.',
          'Therefore −3 > −7.',
        ],
      },
    ],
    questions: [
      {
        id: 'real-c1',
        skillId: 'classification',
        prompt: 'Which number is irrational?',
        options: ['√2', '3/4', '0.5'],
        answer: 0,
        explanation: '√2 cannot be written as a ratio of two integers. Both 3/4 and 0.5 can.',
      },
      {
        id: 'real-c2',
        skillId: 'classification',
        prompt: 'Which fraction equals 0.75?',
        options: ['1/4', '3/4', '7/5'],
        answer: 1,
        explanation: '0.75 = 75/100 = 3/4.',
      },
      {
        id: 'real-c3',
        skillId: 'ordering',
        prompt: 'Which number is greater?',
        options: ['−7', '−3', 'They are equal'],
        answer: 1,
        explanation: '−3 is closer to zero and lies to the right of −7.',
      },
      {
        id: 'real-c4',
        skillId: 'ordering',
        prompt: 'Choose increasing order.',
        options: ['2, 0, −1', '0, −1, 2', '−1, 0, 2'],
        answer: 2,
        explanation: 'Increasing order runs left to right on the number line: −1, 0, 2.',
      },
    ],
    followUp: [
      {
        id: 'real-f1',
        skillId: 'classification',
        prompt: 'Which number is rational?',
        options: ['√3', '√9', 'π'],
        answer: 1,
        explanation: '√9 = 3 = 3/1, a rational number.',
      },
      {
        id: 'real-f2',
        skillId: 'classification',
        prompt: '0.2 written as a simplified fraction is:',
        options: ['1/5', '2/5', '1/2'],
        answer: 0,
        explanation: '0.2 = 2/10 = 1/5.',
      },
      {
        id: 'real-f3',
        skillId: 'ordering',
        prompt: 'Which is the smallest number?',
        options: ['−2', '1', '−8'],
        answer: 2,
        explanation: '−8 lies furthest left on the number line.',
      },
      {
        id: 'real-f4',
        skillId: 'ordering',
        prompt: 'Choose increasing order.',
        options: ['−5, −2, 1', '−2, −5, 1', '1, −2, −5'],
        answer: 0,
        explanation: '−5 < −2 < 1.',
      },
    ],
  },
  {
    id: 'algebra',
    title: 'Algebra foundations',
    summary: 'Combine like terms and solve simple equations by keeping both sides equal.',
    objectives: [
      'Combine terms with the same variable and power.',
      'Solve and check a one-step or two-step equation.',
    ],
    skills: [
      {
        id: 'like-terms',
        title: 'Combining like terms',
        explanation:
          'Like terms have the same variables raised to the same powers. Add or subtract their coefficients. Terms such as x and x² are not like terms.',
        example: 'Simplify 3x + 2x − x.',
        steps: [
          'All terms have the variable x to the first power.',
          'Combine the coefficients: 3 + 2 − 1 = 4.',
          'The expression simplifies to 4x.',
        ],
      },
      {
        id: 'equations',
        title: 'Keeping an equation balanced',
        explanation:
          'An equation says two expressions are equal. Apply the same operation to both sides to keep them equal, then check the solution in the original equation.',
        example: 'Solve 2x + 3 = 11.',
        steps: [
          'Subtract 3 from both sides: 2x = 8.',
          'Divide both sides by 2: x = 4.',
          'Check: 2 × 4 + 3 = 11.',
        ],
      },
    ],
    questions: [
      {
        id: 'alg-c1',
        skillId: 'like-terms',
        prompt: 'Simplify 3x + 2x.',
        options: ['5x²', '5x', '6x'],
        answer: 1,
        explanation: 'Add the coefficients 3 + 2; the variable remains x.',
      },
      {
        id: 'alg-c2',
        skillId: 'like-terms',
        prompt: 'Which pair contains like terms?',
        options: ['2x and 3x', 'x and x²', '2x and 2y'],
        answer: 0,
        explanation: '2x and 3x have exactly the same variable and power.',
      },
      {
        id: 'alg-c3',
        skillId: 'equations',
        prompt: 'Solve x + 5 = 12.',
        options: ['17', '5', '7'],
        answer: 2,
        explanation: 'Subtract 5 from each side: x = 12 − 5 = 7.',
      },
      {
        id: 'alg-c4',
        skillId: 'equations',
        prompt: 'Solve 2x = 10.',
        options: ['5', '8', '20'],
        answer: 0,
        explanation: 'Divide both sides by 2: x = 5.',
      },
    ],
    followUp: [
      {
        id: 'alg-f1',
        skillId: 'like-terms',
        prompt: 'Simplify 7a − 2a.',
        options: ['5', '5a', '9a'],
        answer: 1,
        explanation: 'Subtract the coefficients: (7 − 2)a = 5a.',
      },
      {
        id: 'alg-f2',
        skillId: 'like-terms',
        prompt: 'Simplify 2y + y + 4.',
        options: ['7y', '3y + 4', '3y² + 4'],
        answer: 1,
        explanation: 'Combine only 2y and y. The constant 4 remains separate.',
      },
      {
        id: 'alg-f3',
        skillId: 'equations',
        prompt: 'Solve x − 4 = 9.',
        options: ['5', '13', '−13'],
        answer: 1,
        explanation: 'Add 4 to both sides: x = 13.',
      },
      {
        id: 'alg-f4',
        skillId: 'equations',
        prompt: 'Solve 3x + 2 = 14.',
        options: ['6', '12', '4'],
        answer: 2,
        explanation: 'Subtract 2 to get 3x = 12, then divide by 3 to get x = 4.',
      },
    ],
  },
];

export function findAcademicChapter(id: string) {
  return academicChapters.find((chapter) => chapter.id === id);
}
export function chapterPath(id: string) {
  return `/study/9/mathematics/${encodeURIComponent(id)}`;
}
