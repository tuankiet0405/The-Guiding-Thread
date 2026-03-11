import { useRef } from 'react';
import { useThread } from '../hooks/useThread';
import { useReducedMotion } from '../hooks/useReducedMotion';

/**
 * ThreadCanvas — Fixed SVG overlay (REDESIGNED v2)
 *
 * Moved thread path to the LEFT EDGE of the viewport so it doesn't
 * overlap content. Thread is thinner (1px), lower opacity, and sits
 * at z-[5] — just above the background but below content.
 *
 * The orb follows the left-side path as a subtle scroll indicator.
 */
export default function ThreadCanvas() {
  const pathRef = useRef<SVGPathElement>(null);
  const orbRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  // Initialize thread drawing + orb motion (disabled if reduced motion)
  useThread(pathRef, orbRef, !prefersReduced);

  // Thread path now runs along LEFT EDGE with gentle curves
  const threadPath = [
    'M 60 0',          // Start at left edge
    'L 60 600',
    'C 60 700 80 800 80 900',
    'L 80 1200',
    'C 80 1350 50 1400 60 1500',
    'L 60 1800',
    'C 60 1900 90 2000 80 2100',
    'L 80 2600',
    'C 80 2750 50 2850 60 2900',
    'C 60 3000 80 3100 80 3200',
    'L 80 3500',
    'C 80 3600 60 3700 60 3800',
    'L 60 4200',
    'C 60 4350 80 4500 80 4600',
    'L 80 4800',
  ].join(' ');

  return (
    <>
      {/* SVG Thread Overlay — LEFT EDGE, subtle, behind content */}
      <svg
        className="fixed inset-0 w-full h-full pointer-events-none"
        style={{ zIndex: 5 }}
        viewBox="0 0 800 4800"
        preserveAspectRatio="xMidYMin slice"
        fill="none"
        aria-hidden="true"
      >
        {/* Gradient definition */}
        <defs>
          <linearGradient id="thread-gradient" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#00F0FF" stopOpacity="0.4" />
            <stop offset="50%" stopColor="#00F0FF" stopOpacity="0.2" />
            <stop offset="100%" stopColor="#8A2BE2" stopOpacity="0.3" />
          </linearGradient>
        </defs>

        {/* The Thread — 1px thin stroke, lower opacity gradient, left-edge */}
        <path
          ref={pathRef}
          id="thread-path"
          d={threadPath}
          stroke="url(#thread-gradient)"
          strokeWidth="1"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="none"
          style={prefersReduced ? { strokeDasharray: 'none', strokeDashoffset: '0' } : undefined}
        />
      </svg>

      {/* The Orb — smaller, subtler glow */}
      <div
        ref={orbRef}
        className="fixed pointer-events-none"
        style={{
          zIndex: 6,
          width: '6px',
          height: '6px',
          borderRadius: '50%',
          backgroundColor: '#00F0FF',
          boxShadow: '0 0 12px 4px rgba(0,240,255,0.3)',
          opacity: prefersReduced ? 0 : 0,
          top: 0,
          left: 0,
          transform: 'translate(-50%, -50%)',
        }}
        aria-hidden="true"
      />
    </>
  );
}
