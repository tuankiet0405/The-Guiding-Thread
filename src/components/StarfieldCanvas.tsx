import { useRef, useEffect, useCallback } from 'react';
import { useReducedMotion } from '../hooks/useReducedMotion';

interface Particle {
  x: number;
  y: number;
  baseY: number;
  size: number;
  opacity: number;
  speed: number;
  parallax: number;
}

const PARTICLE_COUNT = 80; // Reduced from 100 for performance
const MAX_SIZE = 1.5;
const MIN_OPACITY = 0.02;
const MAX_OPACITY = 0.06;

/**
 * StarfieldCanvas — Canvas 2D particle background (Optimized v2)
 *
 * Performance enhancements:
 * - Pauses rAF when tab is hidden (Page Visibility API)
 * - Reduced particle count (80 vs 100)
 * - Lower opacity range for lighter rendering
 * - Disabled on mobile + reduced motion
 */
export default function StarfieldCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number>(0);
  const isActiveRef = useRef(true);
  const prefersReduced = useReducedMotion();

  const initParticles = useCallback((w: number, h: number) => {
    const particles: Particle[] = [];
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: Math.random() * w,
        y: Math.random() * h * 3,
        baseY: Math.random() * h * 3,
        size: 1 + Math.random() * MAX_SIZE,
        opacity: MIN_OPACITY + Math.random() * (MAX_OPACITY - MIN_OPACITY),
        speed: 0.1 + Math.random() * 0.25,
        parallax: 0.3 + Math.random() * 0.5,
      });
    }
    particlesRef.current = particles;
  }, []);

  useEffect(() => {
    if (prefersReduced) return;

    const mql = window.matchMedia('(min-width: 768px)');
    if (!mql.matches) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      initParticles(canvas.width, canvas.height);
    };

    resize();

    let scrollY = 0;
    const onScroll = () => { scrollY = window.scrollY; };
    window.addEventListener('scroll', onScroll, { passive: true });

    // Page Visibility API — pause when tab hidden
    const onVisibility = () => {
      isActiveRef.current = !document.hidden;
      if (isActiveRef.current) {
        animFrameRef.current = requestAnimationFrame(draw);
      }
    };
    document.addEventListener('visibilitychange', onVisibility);

    const draw = () => {
      if (!ctx || !canvas || !isActiveRef.current) return;
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (const p of particlesRef.current) {
        const y = (p.baseY - scrollY * p.parallax) % (canvas.height * 3);
        const screenY = y < 0 ? y + canvas.height * 3 : y;

        if (screenY > -10 && screenY < canvas.height + 10) {
          p.baseY -= p.speed * 0.15;
          if (p.baseY < -50) p.baseY = canvas.height * 3;

          ctx.beginPath();
          ctx.arc(p.x, screenY, p.size / 2, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
          ctx.fill();
        }
      }

      animFrameRef.current = requestAnimationFrame(draw);
    };

    animFrameRef.current = requestAnimationFrame(draw);

    const handleResize = () => resize();
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animFrameRef.current);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('visibilitychange', onVisibility);
    };
  }, [prefersReduced, initParticles]);

  if (prefersReduced) return null;

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none"
      style={{ zIndex: -5 }}
      aria-hidden="true"
    />
  );
}
