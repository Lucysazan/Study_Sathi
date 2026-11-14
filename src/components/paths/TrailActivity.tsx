import { WordGarden } from './WordGarden';
import { NumberGarden, RiverHops } from './NumberGarden';
import { PictureStory } from './PictureStory';
import { GamePreview } from '@/components/study/GamePreview';
export function TrailActivity({ pathId, step }: { pathId: string; step: number }) {
  if (pathId === 'english-adventure') {
    if (step === 0) return <WordGarden />;
    if (step === 1) return <PictureStory />;
    if (step === 2)
      return (
        <div className="trail-game">
          <h3>Tell the story your way</h3>
          <p>
            Look back at Mina&apos;s picture book. What did she do to help the seed grow? Tell
            someone, or draw the beginning and the ending.
          </p>
          <GamePreview id="reading" />
        </div>
      );
  }
  if (pathId === 'maths-world') {
    if (step === 0) return <NumberGarden />;
    if (step === 1) return <RiverHops />;
    if (step === 2)
      return (
        <div className="trail-game">
          <h3>Share a pizza</h3>
          <p>
            Tap to add equal slices. Two of the four slices make half a pizza. Can you make a whole?
          </p>
          <GamePreview id="fractions" />
        </div>
      );
  }
  return null;
}
