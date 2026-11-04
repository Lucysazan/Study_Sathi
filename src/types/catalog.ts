/** A curated external resource. Same shape as the prototype's `Resource` type. */
export type Resource = {
  id: string;
  title: string;
  provider: string;
  category: string;
  topic: string;
  description: string;
  language: string;
  /** Display label, e.g. "10–14". */
  age: string;
  /** Null for adult-only guidance (no child age range). */
  minAge: number | null;
  maxAge: number | null;
  format: string;
  purpose: string;
  url: string;
  note: string;
  verification: string;
};

/** One step in a learning path: links a resource, asks for a reflection, or shows the budget activity. */
export type PathStep = {
  title: string;
  description: string;
  /** Resource ID to link to. */
  resource?: string;
  /** Reflection prompt; shows a private notes box. */
  prompt?: string;
  /** Shows the NPR 500 budget activity. */
  budget?: boolean;
};

export type LearningPath = {
  id: string;
  title: string;
  description: string;
  age: string;
  category: string;
  goal: string;
  steps: readonly PathStep[];
};
