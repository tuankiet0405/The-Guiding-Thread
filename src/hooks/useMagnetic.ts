import { useEffect, type RefObject } from 'react';
import gsap from 'gsap';

/**
 * useMagnetic — Magnetic cursor effect for interactive elements
 *
 * Element subtly pulls toward cursor within a configurable radius.
 * Uses gsap.quickTo() for performant, non-React-state animation.
 * Disabled on touch devices (no hover capability).
 *
 * @param ref - Element to make magnetic
 * @param options.radius - Detection radius in px (default: 120)
 * @param options.strength - Max displacement in px (default: 8)
 */
export function useMagnetic(
  ref: RefObject<HTMLElement | null>,
  options: { radius?: number; strength?: number } = {},
) {
  const { radius = 120, strength = 8 } = options;

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    // Skip on touch devices
    if ('ontouchstart' in window) return;

    const quickX = gsap.quickTo(el, 'x', {
      duration: 0.5,
      ease: 'power3.out',
    });
    const quickY = gsap.quickTo(el, 'y', {
      duration: 0.5,
      ease: 'power3.out',
    });

    const onMouseMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = e.clientX - cx;
      const dy = e.clientY - cy;
      const dist = Math.sqrt(dx * dx + dy * dy);

      if (dist < radius) {
        const factor = (1 - dist / radius) * strength;
        quickX(dx * factor / radius * 2);
        quickY(dy * factor / radius * 2);
      } else {
        quickX(0);
        quickY(0);
      }
    };

    const onMouseLeave = () => {
      gsap.to(el, {
        x: 0,
        y: 0,
        duration: 0.6,
        ease: 'elastic.out(1, 0.3)',
      });
    };

    // Listen on document for wider radius detection
    document.addEventListener('mousemove', onMouseMove, { passive: true });
    el.addEventListener('mouseleave', onMouseLeave);

    return () => {
      document.removeEventListener('mousemove', onMouseMove);
      el.removeEventListener('mouseleave', onMouseLeave);
      gsap.set(el, { x: 0, y: 0 });
    };
  }, [ref, radius, strength]);
}
