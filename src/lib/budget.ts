/** The NPR 500 weekly budget activity from the "Learn About Money" path. */

export const BUDGET_TOTAL = 500;
export const budgetCategories = ['Needs', 'Wants', 'Savings'] as const;
export type BudgetCategory = (typeof budgetCategories)[number];
export type Budget = Partial<Record<BudgetCategory, string>>;

/** The budget is stored as a JSON string in the step's note (same format as the prototype). */
export function parseBudget(note: string): Budget {
  try {
    const value: unknown = JSON.parse(note || '{}');
    if (!value || typeof value !== 'object' || Array.isArray(value)) return {};
    const budget: Budget = {};
    for (const k of budgetCategories) {
      const v = (value as Record<string, unknown>)[k];
      if (typeof v === 'string') budget[k] = v;
    }
    return budget;
  } catch {
    return {};
  }
}

export function budgetTotal(budget: Budget): number {
  return budgetCategories.reduce((sum, k) => sum + (Number(budget[k]) || 0), 0);
}

/** Friendly feedback: all planned, over budget, or how much is left. */
export function budgetMessage(total: number, limit = BUDGET_TOTAL): string {
  if (total === limit) return `Your NPR ${limit} is all planned!`;
  if (total > limit) return `You are NPR ${total - limit} over budget. Try adjusting your plan.`;
  return `NPR ${limit - total} left to plan.`;
}
