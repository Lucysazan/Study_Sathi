'use client';

import { useEffect } from 'react';

/**
 * Small motion engine for the paper-deck design. Renders nothing.
 *
 * - `[data-reveal]`: gets `.is-in` once it scrolls into view (CSS does the animation).
 * - `[data-eyes]`: illustrated faces whose pupils follow the pointer (`--ex` / `--ey`).
 *   On touch screens, or when the pointer rests, the eyes wander on their own.
 * - `[data-tilt]`: pointer parallax for hero layers (`--px` / `--py`, range -1..1).
 * - `html[data-scroll]`: "top" | "down" | "up", so the header can tuck away while reading.
 *
 * Everything is skipped when the visitor prefers reduced motion; content is then simply visible.
 */
export function SiteMotion() {
  useEffect(() => {
    const root = document.documentElement;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (reduce.matches) {
      delete root.dataset.motion;
      return;
    }
    root.dataset.motion = 'on';

    // ---- Reveal on scroll -------------------------------------------------
    const io = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          entry.target.classList.add('is-in');
          io.unobserve(entry.target);
        }
      },
      { threshold: 0.16, rootMargin: '0px 0px -6% 0px' },
    );
    const watch = (scope: ParentNode) =>
      scope.querySelectorAll('[data-reveal]:not(.is-in)').forEach((el) => io.observe(el));
    watch(document);
    // Client-side navigation swaps page content: pick up new reveal targets as they appear.
    const mo = new MutationObserver((records) => {
      for (const r of records)
        r.addedNodes.forEach((n) => {
          if (!(n instanceof Element)) return;
          if (n.matches('[data-reveal]:not(.is-in)')) io.observe(n);
          watch(n);
        });
    });
    mo.observe(document.body, { childList: true, subtree: true });

    // ---- Eyes + parallax --------------------------------------------------
    let px = -1;
    let py = -1;
    let frame = 0;
    let lastMove = 0;
    const MAX = 7;

    const aim = (x: number, y: number) => {
      document.querySelectorAll<HTMLElement>('[data-eyes]').forEach((el) => {
        const box = el.getBoundingClientRect();
        if (box.bottom < 0 || box.top > innerHeight) return;
        const cx = box.left + box.width / 2;
        const cy = box.top + box.height * 0.45;
        const dx = x - cx;
        const dy = y - cy;
        const len = Math.hypot(dx, dy) || 1;
        const pull = Math.min(1, len / 260);
        el.style.setProperty('--ex', `${((dx / len) * MAX * pull).toFixed(2)}px`);
        el.style.setProperty('--ey', `${((dy / len) * MAX * 0.8 * pull).toFixed(2)}px`);
      });
      document.querySelectorAll<HTMLElement>('[data-tilt]').forEach((el) => {
        el.style.setProperty('--px', ((x / innerWidth) * 2 - 1).toFixed(3));
        el.style.setProperty('--py', ((y / innerHeight) * 2 - 1).toFixed(3));
      });
    };
    const onMove = (e: PointerEvent) => {
      if (e.pointerType === 'touch') return;
      px = e.clientX;
      py = e.clientY;
      lastMove = performance.now();
      if (!frame)
        frame = requestAnimationFrame(() => {
          frame = 0;
          aim(px, py);
        });
    };
    window.addEventListener('pointermove', onMove, { passive: true });

    // Idle wander: a curious glance somewhere every few seconds.
    const wander = window.setInterval(() => {
      if (performance.now() - lastMove < 4000) return;
      aim(Math.random() * innerWidth, Math.random() * innerHeight * 0.8);
    }, 2600);

    // ---- Header tuck ------------------------------------------------------
    let lastY = scrollY;
    const onScroll = () => {
      const y = scrollY;
      root.dataset.scroll =
        y < 40 ? 'top' : y > lastY + 4 ? 'down' : y < lastY - 4 ? 'up' : root.dataset.scroll;
      lastY = y;
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      io.disconnect();
      mo.disconnect();
      cancelAnimationFrame(frame);
      window.clearInterval(wander);
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('scroll', onScroll);
    };
  }, []);

  return null;
}
