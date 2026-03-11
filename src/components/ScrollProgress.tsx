import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * ScrollProgress — Fixed gradient progress bar on the left edge
 *
 * - 2px wide, full viewport height
 * - scaleY(0→1) driven by scroll progress
 * - Background: thread gradient (cyan → violet)
 * - z-[60]
 */
export default function ScrollProgress() {
  const barRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const bar = barRef.current;
    if (!bar) return;

    const ctx = gsap.context(() => {
      gsap.to(bar, {
        scaleY: 1,
        ease: 'none',
        scrollTrigger: {
          trigger: document.documentElement,
          start: 'top top',
          end: 'bottom bottom',
          scrub: 0.3,
        },
      });
    });

    return () => ctx.revert();
  }, []);

  return (
    <div
      ref={barRef}
      className="fixed top-0 left-0 w-[2px] h-full pointer-events-none origin-top"
      style={{
        zIndex: 60,
        transform: 'scaleY(0)',
        background: 'linear-gradient(to bottom, #00F0FF, #8A2BE2)',
      }}
      aria-hidden="true"
    />
  );
}
