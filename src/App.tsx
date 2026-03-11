import { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useLenis } from './hooks/useLenis';
import { useReducedMotion } from './hooks/useReducedMotion';
import GenesisHook from './components/GenesisHook';
import ThreadCanvas from './components/ThreadCanvas';
import HorizontalProcess from './components/HorizontalProcess';
import ProofNodes from './components/ProofNodes';
import TerminalCTA from './components/Terminal';
import ParallaxElements from './components/ParallaxElements';
import Preloader from './components/Preloader';
import StarfieldCanvas from './components/StarfieldCanvas';
import ScrollProgress from './components/ScrollProgress';
import NavigationDots from './components/NavigationDots';
import FilmGrain from './components/FilmGrain';

gsap.registerPlugin(ScrollTrigger);

// Global GSAP performance config
gsap.defaults({
  force3D: true,           // Always use GPU compositing
  overwrite: 'auto',       // Auto-kill conflicting tweens
});
gsap.config({ nullTargetWarn: false });  // Suppress production warnings

// Clean up will-change after ScrollTrigger animations complete
ScrollTrigger.config({
  limitCallbacks: true,    // Only fire callbacks when ScrollTrigger is in viewport
});

export default function App() {
  const mainRef = useRef<HTMLElement>(null);
  const prefersReduced = useReducedMotion();
  const lenisRef = useLenis();

  // Disable Lenis if reduced motion
  useEffect(() => {
    if (prefersReduced && lenisRef.current) {
      lenisRef.current.destroy();
    }
  }, [prefersReduced, lenisRef]);

  // Debounced resize → ScrollTrigger.refresh()
  useEffect(() => {
    let timeout: ReturnType<typeof setTimeout>;
    const onResize = () => {
      clearTimeout(timeout);
      timeout = setTimeout(() => ScrollTrigger.refresh(), 300);
    };
    window.addEventListener('resize', onResize);
    return () => {
      window.removeEventListener('resize', onResize);
      clearTimeout(timeout);
    };
  }, []);

  return (
    <main ref={mainRef} className="relative">
      {/* Skip-to-content for keyboard users */}
      <a href="#genesis" className="skip-link">
        Skip to content
      </a>

      {/* ═══ Global Effect Layers ═══ */}
      <Preloader />
      <StarfieldCanvas />
      <ScrollProgress />
      <NavigationDots />
      <FilmGrain />

      {/* Parallax background decorations (z-[-10]) */}
      <ParallaxElements />

      {/* Thread overlay — fixed SVG + orb (z-40, z-50) */}
      <ThreadCanvas />

      {/* ══════ Act I: The Genesis ══════ */}
      <GenesisHook />

      {/* Void Travel */}
      <div className="h-[25vh]" aria-hidden="true" />

      {/* ══════ Act II: The Blueprint ══════ */}
      <HorizontalProcess />

      <div className="h-[25vh]" aria-hidden="true" />

      {/* ══════ Act III: The Proof ══════ */}
      <ProofNodes />

      <div className="h-[25vh]" aria-hidden="true" />

      {/* ══════ Act IV: The Synthesis ══════ */}
      <TerminalCTA />

      <div className="h-[10vh]" aria-hidden="true" />
    </main>
  );
}
