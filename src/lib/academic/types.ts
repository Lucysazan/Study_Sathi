export type Skill = {
  id: string;
  title: string;
  explanation: string;
  example: string;
  steps: string[];
};
export type Question = {
  id: string;
  skillId: string;
  prompt: string;
  options: string[];
  answer: number;
  explanation: string;
};
export type Chapter = {
  id: string;
  title: string;
  summary: string;
  objectives: string[];
  skills: Skill[];
  questions: Question[];
  followUp: Question[];
};
export type SourceRecord = {
  id: string;
  title: string;
  publisher: string;
  url: string;
  edition: string;
  checked: string;
  mode: 'link' | 'embed';
  pdfUrl?: string;
  permissionNote: string;
};
export type PracticeResult = {
  chapterId: string;
  phase: 'check' | 'follow-up';
  correct: number;
  total: number;
  skills: { id: string; correct: number; total: number }[];
  feedback: { questionId: string; correct: boolean; answer: string; explanation: string }[];
};
