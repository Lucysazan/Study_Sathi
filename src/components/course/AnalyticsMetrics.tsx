import type { CourseMetrics } from '@/lib/analytics/metrics';

export function AnalyticsMetrics({ metrics }: { metrics: CourseMetrics }) {
  const cards = [
    { label: 'Recorded course views', value: metrics.views },
    { label: 'Recorded enrollments', value: metrics.enrollments },
    { label: 'Recorded course completions', value: metrics.completions },
    {
      label: 'New-enrollment completion rate',
      value: metrics.completionRate === null ? 'Not available' : `${metrics.completionRate}%`,
    },
  ];
  return (
    <>
      <dl className="analytics-metrics">
        {cards.map((card) => (
          <div key={card.label} className="learning-card">
            <dt>{card.label}</dt>
            <dd>{card.value}</dd>
          </div>
        ))}
      </dl>
      <p className="analytics-note">
        Counts include recorded activity and may omit earlier activity. Views count once per
        signed-in session per course. The completion rate covers {metrics.analyticsCompletions}{' '}
        completions from {metrics.analyticsEnrollments} new enrollments tracked since this update.
      </p>
    </>
  );
}
