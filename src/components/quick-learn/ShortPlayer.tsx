'use client';
import type { RefObject } from 'react';
import { useEffect, useRef, useState } from 'react';
import { loadYouTube, type YouTubePlayer } from '@/lib/quick-learn/youtube';
export function ShortPlayer({
  videoId,
  soundRef,
  title,
  onStarted,
  onFinished,
}: {
  videoId: string;
  soundRef: RefObject<{ muted: boolean }>;
  title: string;
  onStarted: () => void;
  onFinished: () => void;
}) {
  const [needsSound, setNeedsSound] = useState(false);
  const livePlayer = useRef<YouTubePlayer | null>(null);
  const mount = useRef<HTMLDivElement>(null),
    callbacks = useRef({ onStarted, onFinished });
  useEffect(() => {
    callbacks.current = { onStarted, onFinished };
  }, [onStarted, onFinished]);
  const [status, setStatus] = useState<'loading' | 'buffering' | 'ready' | 'failed'>('loading'),
    [attempt, setAttempt] = useState(0);
  useEffect(() => {
    let disposed = false,
      player: YouTubePlayer | undefined;
    let running = false,
      ready = false,
      failed = false,
      autoplayMuted = false;
    const host = mount.current;
    const rememberSound = () => {
      if (!ready || failed || !player) return;
      try {
        const muted = player.isMuted();
        if (autoplayMuted && muted) return;
        autoplayMuted = false;
        soundRef.current.muted = muted;
      } catch {}
    };
    const soundTimer = setInterval(rememberSound, 250);
    let readyTimer: ReturnType<typeof setTimeout>, bufferTimer: ReturnType<typeof setTimeout>;
    const isVisible = () => {
      const rect = host?.getBoundingClientRect();
      if (!rect?.width || !rect.height) return false;
      const feed = host?.closest('.quick-feed')?.getBoundingClientRect();
      const width = Math.max(
        0,
        Math.min(rect.right, innerWidth, feed?.right ?? innerWidth) -
          Math.max(rect.left, 0, feed?.left ?? 0),
      );
      const height = Math.max(
        0,
        Math.min(rect.bottom, innerHeight, feed?.bottom ?? innerHeight) -
          Math.max(rect.top, 0, feed?.top ?? 0),
      );
      return (width * height) / (rect.width * rect.height) >= 0.5;
    };
    const pause = () => {
      if (!ready || !running) return;
      running = false;
      clearTimeout(bufferTimer);
      try {
        player?.pauseVideo();
      } catch {}
    };
    const fail = () => {
      if (disposed) return;
      failed = true;
      clearTimeout(bufferTimer);
      pause();
      try {
        player?.destroy();
      } catch {}
      host?.replaceChildren();
      setStatus('failed');
    };
    const visibility = () => {
      if (document.hidden) pause();
    };
    const observer = new IntersectionObserver(
      () => {
        if (!isVisible()) pause();
      },
      { threshold: [0, 0.5] },
    );
    if (host) observer.observe(host);
    const hide = () => pause();
    document.addEventListener('visibilitychange', visibility);
    window.addEventListener('pagehide', hide);
    loadYouTube()
      .then((api) => {
        if (disposed || !host) return;
        const target = document.createElement('div');
        host.replaceChildren(target);
        player = new api.Player(target, {
          host: 'https://www.youtube-nocookie.com',
          videoId,
          width: '100%',
          height: '100%',
          playerVars: {
            origin: window.location.origin,
            playsinline: 1,
            controls: 1,
            rel: 0,
            hl: 'en',
            autoplay: 1,
            mute: soundRef.current.muted ? 1 : 0,
          },
          events: {
            onReady: ({ target }) => {
              if (disposed || failed) return;
              ready = true;
              livePlayer.current = target;
              clearTimeout(readyTimer);
              target.getIframe().title = title + ' - YouTube player';
              target.getIframe().referrerPolicy = 'strict-origin-when-cross-origin';
              target.getIframe().allow =
                'autoplay; encrypted-media; picture-in-picture; fullscreen';
              if (!document.hidden && isVisible()) {
                if (soundRef.current.muted) target.mute();
                else target.unMute();
                target.playVideo();
              }
              setStatus('ready');
            },
            onAutoplayBlocked: () => {
              if (disposed || failed || !player || document.hidden || !isVisible()) return;
              autoplayMuted = true;
              player.mute();
              player.playVideo();
              setNeedsSound(true);
            },
            onError: fail,
            onStateChange: ({ data }) => {
              if (disposed || failed) return;
              clearTimeout(bufferTimer);
              running = data === 1 || data === 3;
              if (data === 3) {
                setStatus('buffering');
                bufferTimer = setTimeout(() => {
                  fail();
                }, 20000);
              }
              if (data === 1) {
                setStatus('ready');
                if (document.hidden || !isVisible()) pause();
                else callbacks.current.onStarted();
              }
              if (data === 2 || data === 0) setStatus('ready');
              if (data === 0) callbacks.current.onFinished();
            },
          },
        });
        readyTimer = setTimeout(() => {
          if (!ready) fail();
        }, 18000);
      })
      .catch(() => {
        fail();
      });
    return () => {
      rememberSound();
      clearInterval(soundTimer);
      livePlayer.current = null;
      disposed = true;
      clearTimeout(readyTimer);
      clearTimeout(bufferTimer);
      observer.disconnect();
      document.removeEventListener('visibilitychange', visibility);
      window.removeEventListener('pagehide', hide);
      pause();
      try {
        player?.destroy();
      } catch {}
      host?.replaceChildren();
    };
  }, [videoId, title, attempt, soundRef]);
  return (
    <div className="quick-player">
      <div className="quick-player-mount" ref={mount} />
      {needsSound && (
        <button
          className="quick-sound-button"
          onClick={() => {
            livePlayer.current?.unMute();
            livePlayer.current?.playVideo();
            soundRef.current.muted = false;
            setNeedsSound(false);
          }}
        >
          Turn on sound
        </button>
      )}
      {(status === 'loading' || status === 'buffering') && (
        <p className="quick-player-status" role="status">
          {status === 'buffering' ? 'Buffering YouTube...' : 'Loading YouTube...'}
        </p>
      )}
      {status === 'failed' && (
        <div className="quick-player-fallback" role="status">
          <strong>This video could not load.</strong>
          <p>It may be unavailable or the connection may be slow.</p>
          <button
            className="button secondary"
            onClick={() => {
              setStatus('loading');
              setAttempt(attempt + 1);
            }}
          >
            Retry video
          </button>
          <p>Use Watch on YouTube or choose Next.</p>
        </div>
      )}
    </div>
  );
}
