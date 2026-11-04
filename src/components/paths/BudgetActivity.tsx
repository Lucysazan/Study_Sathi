'use client';

import {
  BUDGET_TOTAL,
  budgetCategories,
  budgetMessage,
  budgetTotal,
  parseBudget,
} from '@/lib/budget';

/** Plan NPR 500 across needs, wants and savings. The value is the step's note (JSON string). */
export function BudgetActivity({
  value,
  onChange,
}: {
  value: string;
  onChange: (next: string) => void;
}) {
  const budget = parseBudget(value);
  return (
    <div className="budget">
      <div className="budget-fields">
        {budgetCategories.map((k) => (
          <label key={k}>
            {k} (NPR)
            <input
              type="number"
              inputMode="numeric"
              min="0"
              max={BUDGET_TOTAL}
              value={budget[k] ?? ''}
              placeholder="0"
              onChange={(e) => onChange(JSON.stringify({ ...budget, [k]: e.target.value }))}
            />
          </label>
        ))}
      </div>
      <p aria-live="polite">{budgetMessage(budgetTotal(budget))}</p>
    </div>
  );
}
