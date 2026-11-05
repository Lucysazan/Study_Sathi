import type { Metadata } from 'next';
import { SafetyMission } from '@/components/missions/SafetyMission';

export const metadata: Metadata = {
  title: 'Spot the Scam — Nepal Edition',
  description:
    'Practise safer choices with three fictional Nepal-context messages. English and Nepali explanations. No account needed.',
};

export default function SafetyMissionPage() {
  return (
    <section className="site-container section">
      <SafetyMission />
    </section>
  );
}
