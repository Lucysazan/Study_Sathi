import { missions } from '../../data/play-missions';
import { nepaliMissions } from '../../data/play-nepali';
export type NarrationScript = { id: string; game: string; language: 'en' | 'ne'; text: string };
export function gameNarrationScripts(): NarrationScript[] {
  const scripts: NarrationScript[] = [];
  for (const [game, mission] of Object.entries(missions))
    for (const language of ['en', 'ne'] as const) {
      const rounds = language === 'ne' ? nepaliMissions[game]!.rounds : mission.rounds;
      rounds.forEach((round, i) =>
        scripts.push({
          id: `${game}-${language}-${i}`,
          game,
          language,
          text:
            round.clue + ' ' + round.choices.map((choice, n) => `${n + 1}. ${choice}`).join('. '),
        }),
      );
    }
  scripts.push({
    id: 'budget-en-intro',
    game: 'budget',
    language: 'en',
    text: 'The pocket-money shop. You have one hundred rupees. Buy a notebook and pencil. Keep at least twenty rupees for later. Tap an item to add it to your basket. Tap an item in the basket to remove it.',
  });
  scripts.push({
    id: 'budget-ne-intro',
    game: 'budget',
    language: 'ne',
    text: 'खल्ती पैसाको पसल। तपाईंसँग एक सय रुपैयाँ छ। कापी र पेन्सिल किन्नुहोस्। पछिका लागि कम्तीमा बीस रुपैयाँ बचाउनुहोस्। सामान थप्न त्यसलाई छुनुहोस्। टोकरीको सामान हटाउन त्यसलाई फेरि छुनुहोस्।',
  });
  return scripts;
}
