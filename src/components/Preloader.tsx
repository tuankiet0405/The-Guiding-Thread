import { useState, useEffect, useRef } from 'react';

/**
 * Preloader — Animated loading screen
 *
 * - CSS-only circle draw animation
 * - Counter 0→100% via requestAnimationFrame
 * - Exit: vertical wipe with opacity fade
 * - Renders at z-[100], above everything
 * - No GSAP dependency (loads before GSAP is ready)
 */
export default function Preloader() {
  const [progress, setProgress] = useState(0);
  const [exiting, setExiting] = useState(false);
  const [hidden, setHidden] = useState(false);
  const rafRef = useRef<number>(0);
  const startRef = useRef(0);

  useEffect(() => {
    const duration = 1800; // 1.8s load time
    startRef.current = performance.now();

    const tick = (now: number) => {
      const elapsed = now - startRef.current;
      const p = Math.min(1, elapsed / duration);
      // Eased progress (ease-out quad)
      const eased = 1 - (1 - p) * (1 - p);
      setProgress(Math.round(eased * 100));

      if (p < 1) {
        rafRef.current = requestAnimationFrame(tick);
      } else {
        // Begin exit animation
        setTimeout(() => setExiting(true), 200);
        setTimeout(() => setHidden(true), 900);
      }
    };

    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  if (hidden) return null;

  return (
    <div
      className={`fixed inset-0 flex items-center justify-center transition-all duration-700 ${
        exiting ? 'opacity-0 scale-y-0' : 'opacity-100 scale-y-100'
      }`}
      style={{
        zIndex: 100,
        backgroundColor: '#050505',
        transformOrigin: 'top center',
      }}
      aria-hidden="true"
    >
      <div className="text-center">
        {/* Animated circle */}
        <svg
          viewBox="0 0 100 100"
          className="w-20 h-20 mx-auto mb-8"
          fill="none"
        >
          {/* Track circle */}
          <circle cx="50" cy="50" r="42" stroke="#1A1A20" strokeWidth="1" />
          {/* Progress circle */}
          <circle
            cx="50"
            cy="50"
            r="42"
            stroke="url(#preloader-gradient)"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeDasharray={264}
            strokeDashoffset={264 - (264 * progress) / 100}
            style={{
              transform: 'rotate(-90deg)',
              transformOrigin: 'center',
              transition: 'stroke-dashoffset 0.1s ease-out',
            }}
          />
          <defs>
            <linearGradient id="preloader-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#00F0FF" />
              <stop offset="100%" stopColor="#8A2BE2" />
            </linearGradient>
          </defs>
        </svg>

        {/* Counter */}
        <p
          className="font-engineer text-sm tracking-engineer-label text-signal-mid tabular-nums"
          style={{ fontVariantNumeric: 'tabular-nums' }}
        >
          {progress}%
        </p>
      </div>
    </div>
  );
}
