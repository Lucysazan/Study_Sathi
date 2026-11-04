import { describe, expect, it } from 'vitest';
import { budgetMessage, budgetTotal, parseBudget } from './budget';

describe('budget activity', () => {
  it('parses the stored note and ignores junk', () => {
    expect(parseBudget('{"Needs":"200","Wants":"100","Other":"5"}')).toEqual({
      Needs: '200',
      Wants: '100',
    });
    expect(parseBudget('')).toEqual({});
    expect(parseBudget('not json')).toEqual({});
    expect(parseBudget('[1]')).toEqual({});
  });

  it('adds up the amounts, treating blanks and non-numbers as 0', () => {
    expect(budgetTotal({ Needs: '200', Wants: '', Savings: 'abc' })).toBe(200);
    expect(budgetTotal({ Needs: '250', Wants: '150', Savings: '100' })).toBe(500);
  });

  it('explains what is left, exact, or over budget', () => {
    expect(budgetMessage(300)).toBe('NPR 200 left to plan.');
    expect(budgetMessage(500)).toBe('Your NPR 500 is all planned!');
    expect(budgetMessage(620)).toBe('You are NPR 120 over budget. Try adjusting your plan.');
  });
});
