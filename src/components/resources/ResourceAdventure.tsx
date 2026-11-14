import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { GamePreview } from '@/components/study/GamePreview';
const missions: Record<string, { id: string; title: string; prompt: string }> = {
  'Life Skills': {
    id: 'study-habits',
    title: 'One small step today',
    prompt: 'Try the step button on the preview. What little learning habit could you try today?',
  },
  'Digital Safety': {
    id: 'digital-safety',
    title: 'Be a code protector',
    prompt: 'Tap the lock. Then try a small challenge about keeping your information safe.',
  },
  'Financial Literacy': {
    id: 'budget',
    title: 'A coin towards your goal',
    prompt: 'Try saving a pretend coin. What would you like to save for?',
  },
  Environment: {
    id: 'waste',
    title: 'Grow a little curiosity',
    prompt: 'Tap to grow a leaf. Then explore a small activity about looking after our planet.',
  },
  'Learning Games': {
    id: 'balance',
    title: 'Can you find the balance?',
    prompt: 'Try the little seesaw. What happens when both sides balance?',
  },
};
export function ResourceAdventure({ category }: { category: string }) {
  const mission = missions[category] ?? {
    id: 'fractions',
    title: 'Make a little discovery',
    prompt: 'Tap to add a slice. How many equal pieces make a whole?',
  };
  return (
    <section className="resource-adventure" aria-label="Try a StudySathi mini activity">
      <div>
        <div className="eyebrow">A LITTLE TRY BEFORE YOU EXPLORE</div>
        <h2>{mission.title}</h2>
        <p>{mission.prompt}</p>
        <Link className="button" href={`/play/${mission.id}`}>
          Try the full activity <ArrowRight size={18} aria-hidden="true" />
        </Link>
        <small>Original StudySathi preview - separate from the provider resource</small>
      </div>
      <GamePreview id={mission.id} />
    </section>
  );
}
