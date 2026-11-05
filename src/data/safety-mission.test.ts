import { expect, it } from 'vitest';
import { missionCopy, safetyScenarios } from './safety-mission';

it('keeps scenario answer references unique and valid', () => {
  expect(new Set(safetyScenarios.map((scenario) => scenario.id)).size).toBe(safetyScenarios.length);
  for (const scenario of safetyScenarios) {
    expect(scenario.options.filter((option) => option.id === scenario.safeChoice)).toHaveLength(1);
    expect(new Set(scenario.options.map((option) => option.id)).size).toBe(scenario.options.length);
  }
});
it('provides English and Nepali for every learner-facing scenario field', () => {
  for (const scenario of safetyScenarios) {
    for (const field of [
      scenario.title,
      scenario.message,
      scenario.explanation,
      scenario.clue,
      ...scenario.options.map((option) => option.text),
    ]) {
      expect(field.en.trim().length).toBeGreaterThan(0);
      expect(field.ne).toMatch(/[\u0900-\u097f]/);
    }
  }
  expect(Object.keys(missionCopy.en).sort()).toEqual(Object.keys(missionCopy.ne).sort());
});
