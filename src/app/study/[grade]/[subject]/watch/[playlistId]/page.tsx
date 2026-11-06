import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { schoolLibrary } from '@/lib/academic/library';
import { PlaylistPlayer } from '@/components/academic/PlaylistPlayer';
import { LibraryBreadcrumb } from '@/components/academic/LibraryNavigation';

type Params = { grade: string; subject: string; playlistId: string };
function find(p: Params) {
  return schoolLibrary.playlists.find(
    (item) =>
      String(item.grade) === p.grade && item.subject === p.subject && item.id === p.playlistId,
  );
}
export function generateStaticParams() {
  return schoolLibrary.playlists.map((item) => ({
    grade: String(item.grade),
    subject: item.subject,
    playlistId: item.id,
  }));
}
export async function generateMetadata({ params }: { params: Promise<Params> }): Promise<Metadata> {
  return { title: find(await params)?.title || 'Playlist not found' };
}
export default async function WatchPage({ params }: { params: Promise<Params> }) {
  const playlist = find(await params);
  if (!playlist) notFound();
  return (
    <section className="site-container section school-library">
      <LibraryBreadcrumb
        grade={playlist.grade}
        subject={playlist.subject}
        current="Video lessons"
      />
      <div className="eyebrow">
        WATCH · CLASS {playlist.grade} · {playlist.language}
      </div>
      <h1>{playlist.title}</h1>
      <p>
        {playlist.provider} · Playlist checked {playlist.checked}
      </p>
      <PlaylistPlayer playlist={playlist} />
    </section>
  );
}
