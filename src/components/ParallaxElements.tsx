import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * ParallaxElements — Rich background layer (REDESIGNED v2)
 *
 * Creates a deep, layered background with:
 * - Large, blurred gradient orbs (ambient lighting)
 * - Subtle grid patterns (inline SVG, no external files)
 * - Scroll-reactive parallax on desktop
 *
 * Disabled on mobile (< 768px) and reduced motion.
 */
export default function ParallaxElements() {
  const containerRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useLayoutEffect(() => {
    if (prefersReduced) return;

    const container = containerRef.current;
    if (!container) return;

    const elements = container.querySelectorAll<HTMLElement>('.parallax-item');
    if (elements.length === 0) return;

    const ctx = gsap.context(() => {
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        const quickTos = Array.from(elements).map((el) => ({
          y: gsap.quickTo(el, 'y', { duration: 1.2, ease: 'power3.out' }),
          skewY: gsap.quickTo(el, 'skewY', { duration: 1.5, ease: 'power3.out' }),
        }));

        let lastScroll = 0;
        const onScroll = () => {
          const velocity = (window.scrollY - lastScroll) * 0.08;
          lastScroll = window.scrollY;

          quickTos.forEach((qt, i) => {
            const speed = [0.03, -0.02, 0.025, -0.035, 0.015, -0.02][i % 6];
            qt.y(window.scrollY * speed);
            qt.skewY(Math.max(-2, Math.min(2, velocity)));
          });
        };

        window.addEventListener('scroll', onScroll, { passive: true });
        return () => window.removeEventListener('scroll', onScroll);
      });
    }, container);

    return () => ctx.revert();
  }, [prefersReduced]);

  if (prefersReduced) return null;

  return (
    <div
      ref={containerRef}
      className="fixed inset-0 pointer-events-none overflow-hidden"
      style={{ zIndex: -10 }}
      aria-hidden="true"
    >
      {/* ═══ Ambient Gradient Orbs — creates depth and warmth ═══ */}

      {/* Large cyan orb — top right */}
      <div
        className="parallax-item absolute -top-[200px] -right-[200px] w-[700px] h-[700px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.06) 0%, rgba(0,240,255,0.02) 40%, transparent 70%)',
          filter: 'blur(80px)',
        }}
      />

      {/* Violet orb — mid left */}
      <div
        className="parallax-item absolute top-[35%] -left-[150px] w-[600px] h-[600px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(138,43,226,0.07) 0%, rgba(138,43,226,0.02) 40%, transparent 70%)',
          filter: 'blur(100px)',
        }}
      />

      {/* Cyan orb — bottom right */}
      <div
        className="parallax-item absolute top-[70%] -right-[100px] w-[500px] h-[500px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(0,240,255,0.05) 0%, rgba(0,240,255,0.015) 40%, transparent 70%)',
          filter: 'blur(90px)',
        }}
      />

      {/* Deep violet orb — near footer */}
      <div
        className="parallax-item absolute top-[90%] left-[20%] w-[400px] h-[400px] rounded-full"
        style={{
          background: 'radial-gradient(circle, rgba(138,43,226,0.05) 0%, transparent 60%)',
          filter: 'blur(80px)',
        }}
      />

      {/* ═══ Grid Patterns — inline SVG ═══ */}

      {/* Dot grid — top left area */}
      <div className="parallax-item absolute -top-10 -left-10 w-[400px] h-[400px] opacity-[0.04]">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-grid" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.8" fill="#A1A1AA" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid)" />
        </svg>
      </div>

      {/* Dot grid — bottom right (rotated) */}
      <div className="parallax-item absolute top-[80%] -right-10 w-[350px] h-[350px] opacity-[0.03] rotate-45">
        <svg width="100%" height="100%" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <pattern id="dot-grid-2" x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r="0.6" fill="#A1A1AA" />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#dot-grid-2)" />
        </svg>
      </div>

      {/* ═══ Geometric Accents ═══ */}

      {/* Diagonal line cluster — mid-right */}
      <svg
        className="parallax-item absolute top-[50%] right-[5%] w-[200px] h-[200px] opacity-[0.03]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <line x1="0" y1="200" x2="200" y2="0" stroke="#A1A1AA" strokeWidth="0.5" />
        <line x1="20" y1="200" x2="200" y2="20" stroke="#A1A1AA" strokeWidth="0.5" />
        <line x1="40" y1="200" x2="200" y2="40" stroke="#A1A1AA" strokeWidth="0.5" />
        <line x1="60" y1="200" x2="200" y2="60" stroke="#A1A1AA" strokeWidth="0.5" />
      </svg>

      {/* Concentric rings — top right area */}
      <svg
        className="parallax-item absolute top-[18%] right-[15%] w-[180px] h-[180px] opacity-[0.03]"
        viewBox="0 0 200 200"
        fill="none"
      >
        <circle cx="100" cy="100" r="30" stroke="#A1A1AA" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="55" stroke="#A1A1AA" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="80" stroke="#A1A1AA" strokeWidth="0.5" />
        <circle cx="100" cy="100" r="98" stroke="#A1A1AA" strokeWidth="0.3" />
      </svg>
    </div>
  );
}
