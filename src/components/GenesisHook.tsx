import { useRef, useLayoutEffect } from 'react';
import gsap from 'gsap';
import { useReducedMotion } from '../hooks/useReducedMotion';

/** Helper: split a string into char spans for stagger animation */
function SplitChars({
  text,
  className = '',
  charsRef,
}: {
  text: string;
  className?: string;
  charsRef: React.MutableRefObject<HTMLSpanElement[]>;
}) {
  return (
    <>
      {text.split('').map((char, i) =>
        char === ' ' ? (
          <span key={i}>&nbsp;</span>
        ) : (
          <span
            key={i}
            style={{ display: 'inline-block', overflow: 'hidden', verticalAlign: 'top' }}
          >
            <span
              ref={(el) => {
                if (el) charsRef.current.push(el);
              }}
              className={className}
              style={{ display: 'inline-block', willChange: 'transform' }}
            >
              {char}
            </span>
          </span>
        ),
      )}
    </>
  );
}

/**
 * GenesisHook — Act I: The 3-Second Hook (Enhanced v2.0)
 *
 * 1. Pitch black screen
 * 2. SVG logo draws via stroke animation (1.5s, power3.inOut)
 * 3. Logo begins subtle floating animation
 * 4. Hero text reveals with per-character stagger (clipPath mask)
 * 5. Subtitle fades in
 * 6. Fast-scroll guard
 */
export default function GenesisHook() {
  const sectionRef = useRef<HTMLElement>(null);
  const logoRef = useRef<SVGPathElement>(null);
  const logoContainerRef = useRef<HTMLDivElement>(null);
  const subtitleRef = useRef<HTMLParagraphElement>(null);
  const timelineRef = useRef<gsap.core.Timeline | null>(null);
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const prefersReduced = useReducedMotion();

  useLayoutEffect(() => {
    const logo = logoRef.current;
    const subtitle = subtitleRef.current;
    const logoContainer = logoContainerRef.current;
    const chars = charsRef.current;
    if (!logo || !subtitle || !logoContainer) return;

    // If reduced motion, show everything immediately
    if (prefersReduced) {
      gsap.set(logo, { strokeDasharray: 'none', strokeDashoffset: 0, opacity: 1 });
      gsap.set(subtitle, { opacity: 1, y: 0 });
      chars.forEach((c) => gsap.set(c, { y: 0 }));
      return;
    }

    const logoLength = logo.getTotalLength();

    // Initial state
    gsap.set(logo, {
      strokeDasharray: logoLength,
      strokeDashoffset: logoLength,
      opacity: 1,
    });
    gsap.set(subtitle, { opacity: 0, y: 20 });

    // Hide all chars initially (translate down inside overflow-hidden wrapper)
    chars.forEach((c) => {
      gsap.set(c, { y: '120%' });
    });

    // Build the genesis timeline
    const tl = gsap.timeline({ delay: 0.3 });
    timelineRef.current = tl;

    // 1. Draw the logo (1.5s)
    tl.to(logo, {
      strokeDashoffset: 0,
      duration: 1.5,
      ease: 'power3.inOut',
    });

    // 2. Split text reveal — characters stagger up from behind clip mask
    if (chars.length > 0) {
      tl.to(
        chars,
        {
          y: '0%',
          duration: 0.8,
          ease: 'expo.out',
          stagger: 0.03,
        },
        '-=0.3',
      );
    }

    // 3. Fade in subtitle
    tl.to(subtitle, {
      opacity: 1,
      y: 0,
      duration: 0.6,
      ease: 'expo.out',
    }, '-=0.4');

    // 4. Floating logo animation (continuous, subtle)
    tl.to(logoContainer, {
      y: -8,
      duration: 3,
      ease: 'sine.inOut',
      yoyo: true,
      repeat: -1,
    }, '-=0.5');

    // Fast-scroll guard
    const onScroll = () => {
      if (window.scrollY > 50 && tl.progress() < 1) {
        tl.progress(1);
        window.removeEventListener('scroll', onScroll);
      }
    };
    window.addEventListener('scroll', onScroll, { passive: true });

    return () => {
      tl.kill();
      window.removeEventListener('scroll', onScroll);
    };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  // Reset charsRef on each render so refs accumulate correctly
  charsRef.current = [];

  return (
    <section
      id="genesis"
      ref={sectionRef}
      className="relative min-h-screen flex items-center justify-center"
      aria-label="Introduction — The Guiding Thread"
    >
      <div className="text-center">
        {/* SVG Logo */}
        <div ref={logoContainerRef} className="mb-16 flex justify-center">
          <svg
            viewBox="0 0 120 120"
            fill="none"
            className="w-28 h-28 md:w-36 md:h-36 text-thread-cyan"
            aria-hidden="true"
          >
            <path
              ref={logoRef}
              d="M60 8 L72 32 L60 28 L48 32 Z
                 M60 28 L60 52
                 M60 52 C60 58 54 64 48 64 C42 64 38 58 38 52 C38 46 42 40 48 40 C54 40 58 46 60 52
                 M60 52 L60 76
                 M60 76 C60 82 66 88 72 88 C78 88 82 82 82 76 C82 70 78 64 72 64 C66 64 60 70 60 76
                 M60 76 L60 112"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              style={{ opacity: 0 }}
            />
          </svg>
        </div>

        {/* Hero text — inline char splitting preserves gradient class */}
        <h1 className="font-architect text-5xl md:text-7xl lg:text-8xl font-bold tracking-architect-tight leading-none text-signal-high mb-8">
          <SplitChars text="The Guiding" charsRef={charsRef} />
          <br />
          <SplitChars text="Thread" className="thread-gradient-text" charsRef={charsRef} />
        </h1>

        <p
          ref={subtitleRef}
          className="narrator-text mx-auto text-lg md:text-xl"
        >
          Engineering meets design. A clear path from chaos to resolution.
        </p>
      </div>
    </section>
  );
}
