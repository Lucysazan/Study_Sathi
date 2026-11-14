import { BookOpen, Sparkles, Star } from 'lucide-react';
import { CategoryIcon } from './CategoryIcon';

/** Original decorative learning landscape; provider artwork is not copied. */
export function ResourceScene({ category }: { category: string }) {
  return (
    <div className="resource-scene" aria-hidden="true">
      <span className="scene-sun" />
      <span className="scene-hill back" />
      <span className="scene-hill" />
      <span className="scene-star">
        <Star size={22} />
      </span>
      <span className="scene-spark">
        <Sparkles size={25} />
      </span>
      <span className="scene-book">
        <BookOpen size={48} />
      </span>
      <span className="scene-bubble">
        <CategoryIcon category={category} size={48} />
      </span>
    </div>
  );
}
