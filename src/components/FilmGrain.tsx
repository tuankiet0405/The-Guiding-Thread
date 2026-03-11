import { useRef, useEffect } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * FilmGrain — Subtle noise texture overlay (Optimized v2)
 *
 * Performance enhancements:
 * - Pauses rAF when tab is hidden (Page Visibility API)
 * - Throttled to ~10fps (100ms interval) for minimal CPU overhead
 * - Base64 SVG — no network request
 */
export default function FilmGrain() {
  const grainRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useEffect(() => {
    if (prefersReduced) return;

    const grain = grainRef.current;
    if (!grain) return;

    let frame: number;
    let last = 0;
    let isActive = true;

    const animate = (time: number) => {
      if (!isActive) return;
      if (time - last > 100) {
        const x = Math.random() * 200;
        const y = Math.random() * 200;
        grain.style.backgroundPosition = `${x}px ${y}px`;
        last = time;
      }
      frame = requestAnimationFrame(animate);
    };

    // Page Visibility API — pause when tab hidden
    const onVisibility = () => {
      isActive = !document.hidden;
      if (isActive) {
        frame = requestAnimationFrame(animate);
      } else {
        cancelAnimationFrame(frame);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    frame = requestAnimationFrame(animate);
    return () => {
      cancelAnimationFrame(frame);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [prefersReduced]);

  if (prefersReduced) return null;

  const noiseSvg = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.5'/%3E%3C/svg%3E")`;

  return (
    <div
      ref={grainRef}
      className="fixed inset-0 pointer-events-none"
      style={{
        zIndex: 30,
        opacity: 0.04,
        backgroundImage: noiseSvg,
        backgroundRepeat: 'repeat',
        backgroundSize: '256px 256px',
      }}
      aria-hidden="true"
    />
  );
}
