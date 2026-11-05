import Link from 'next/link';
import { ArrowRight, ShieldCheck } from 'lucide-react';

export function SafetyMissionPromo() {
  return (
    <section className="site-container mission-promo" aria-labelledby="safety-mission-title">
      <div className="mission-promo-icon">
        <ShieldCheck size={38} aria-hidden="true" />
      </div>
      <div>
        <div className="eyebrow">TRY A REAL-LIFE SAFETY MISSION</div>
        <h2 id="safety-mission-title">Would you spot the scam?</h2>
        <p>A wallet OTP, a surprise prize, a classroom reminder. Practise what to do next.</p>
        <p>
          3 situations · English / <span lang="ne">नेपाली</span> · No account needed
        </p>
      </div>
      <Link href="/safety-mission" className="button primary">
        Try the safety mission <ArrowRight size={18} aria-hidden="true" />
      </Link>
    </section>
  );
}
