import { useState, useEffect, useRef, useCallback } from 'react';

const sections = [
  { id: 'genesis', label: 'Genesis', index: 0 },
  { id: 'process', label: 'Blueprint', index: 1 },
  { id: 'proof', label: 'Proof', index: 2 },
  { id: 'contact', label: 'Synthesis', index: 3 },
];

/**
 * NavigationDots — Fixed right-side section navigator
 *
 * - 4 dots, one per Act
 * - Active dot glows cyan via IntersectionObserver
 * - Click scrolls to section (uses native scrollIntoView as Lenis handles smoothing)
 * - Tooltip on hover
 * - Hidden on < 768px
 */
export default function NavigationDots() {
  const [activeIndex, setActiveIndex] = useState(0);
  const observerRef = useRef<IntersectionObserver | null>(null);

  // Track which section is in view
  useEffect(() => {
    const handleIntersect = (entries: IntersectionObserverEntry[]) => {
      for (const entry of entries) {
        if (entry.isIntersecting) {
          const idx = sections.findIndex((s) => s.id === entry.target.id);
          if (idx !== -1) setActiveIndex(idx);
        }
      }
    };

    observerRef.current = new IntersectionObserver(handleIntersect, {
      rootMargin: '-40% 0px -40% 0px', // Middle 20% of viewport triggers
      threshold: 0,
    });

    sections.forEach((s) => {
      const el = document.getElementById(s.id);
      if (el) observerRef.current?.observe(el);
    });

    return () => observerRef.current?.disconnect();
  }, []);

  const scrollTo = useCallback((id: string) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  }, []);

  return (
    <nav
      className="fixed right-6 top-1/2 -translate-y-1/2 hidden md:flex flex-col gap-5"
      style={{ zIndex: 60 }}
      aria-label="Section navigation"
    >
      {sections.map((section) => (
        <button
          key={section.id}
          onClick={() => scrollTo(section.id)}
          className="group relative flex items-center justify-end"
          aria-label={`Navigate to ${section.label}`}
          aria-current={activeIndex === section.index ? 'true' : undefined}
        >
          {/* Tooltip — slides in from right on hover */}
          <span className="absolute right-6 whitespace-nowrap opacity-0 group-hover:opacity-100 transition-all duration-300 translate-x-2 group-hover:translate-x-0 pointer-events-none">
            <span className="node-label text-signal-mid bg-void-surface/90 px-2 py-1 rounded text-xs">
              {section.label}
            </span>
          </span>

          {/* Dot */}
          <span
            className={`block w-2 h-2 rounded-full transition-all duration-300 ${
              activeIndex === section.index
                ? 'bg-thread-cyan shadow-[0_0_8px_rgba(0,240,255,0.6)] scale-125'
                : 'bg-signal-low hover:bg-signal-mid scale-100'
            }`}
          />
        </button>
      ))}
    </nav>
  );
}
