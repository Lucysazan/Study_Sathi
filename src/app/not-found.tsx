import Link from 'next/link';
import { Empty } from '@/components/ui/Empty';

export default function NotFound() {
  return (
    <section className="site-container section">
      <Empty
        headingLevel={1}
        title="Let's find another way"
        description="This page isn't in our learning library."
        action={
          <Link className="button" href="/resources">
            Explore Resources
          </Link>
        }
      />
    </section>
  );
}
