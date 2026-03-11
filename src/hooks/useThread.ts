import { useRef, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * Manages the SVG thread drawing (stroke-dashoffset) synced to scroll progress,
 * and positions the orb along the path using getPointAtLength().
 */
export function useThread(
  pathRef: React.RefObject<SVGPathElement | null>,
  orbRef: React.RefObject<HTMLDivElement | null>,
  enabled: boolean = true,
) {
  const scrollTriggerRef = useRef<ScrollTrigger | null>(null);
  const totalLengthRef = useRef(0);

  const initThread = useCallback(() => {
    const path = pathRef.current;
    const orb = orbRef.current;
    if (!path || !orb || !enabled) return;

    const totalLength = path.getTotalLength();
    totalLengthRef.current = totalLength;

    // Set initial state: fully hidden stroke
    gsap.set(path, {
      strokeDasharray: totalLength,
      strokeDashoffset: totalLength,
    });

    // Create scroll-linked animation for thread draw
    scrollTriggerRef.current = ScrollTrigger.create({
      trigger: document.documentElement,
      start: 'top top',
      end: 'bottom bottom',
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress;
        const drawLength = totalLength * (1 - progress);

        // Draw the thread as user scrolls
        gsap.set(path, { strokeDashoffset: drawLength });

        // Move the orb along the path
        try {
          const point = path.getPointAtLength(progress * totalLength);
          gsap.set(orb, {
            x: point.x,
            y: point.y,
            opacity: progress > 0.01 ? 1 : 0,
          });
        } catch {
          // SVG path might not be ready
        }
      },
    });
  }, [pathRef, orbRef, enabled]);

  // Initialize on mount
  useEffect(() => {
    // Small delay to ensure SVG is rendered
    const timer = setTimeout(initThread, 100);

    return () => {
      clearTimeout(timer);
      scrollTriggerRef.current?.kill();
    };
  }, [initThread]);

  // Recalculate on resize
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => {
        scrollTriggerRef.current?.kill();
        initThread();
      }, 300);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timeout);
    };
  }, [initThread]);

  return { totalLengthRef };
}
