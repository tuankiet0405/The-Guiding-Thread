import { useRef, useLayoutEffect, useEffect, useCallback } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/**
 * useTilt3D — 3D perspective tilt on mouse move
 * Applies rotateX/rotateY based on cursor position over element
 */
function useTilt3D(ref: React.RefObject<HTMLElement | null>, maxDeg = 5) {
  const onMove = useCallback((e: MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    gsap.to(el, {
      rotateY: x * maxDeg * 2,
      rotateX: -y * maxDeg * 2,
      duration: 0.4,
      ease: 'power2.out',
    });
  }, [ref, maxDeg]);

  const onLeave = useCallback(() => {
    const el = ref.current;
    if (!el) return;
    gsap.to(el, {
      rotateX: 0,
      rotateY: 0,
      duration: 0.8,
      ease: 'elastic.out(1, 0.5)',
    });
  }, [ref]);

  useEffect(() => {
    const el = ref.current;
    if (!el || 'ontouchstart' in window) return;
    el.style.perspective = '800px';
    el.style.transformStyle = 'preserve-3d';
    el.addEventListener('mousemove', onMove);
    el.addEventListener('mouseleave', onLeave);
    return () => {
      el.removeEventListener('mousemove', onMove);
      el.removeEventListener('mouseleave', onLeave);
    };
  }, [ref, onMove, onLeave]);
}

/* ─── Panel Data ─── */
const panels = [
  {
    id: 'discovery',
    label: '01 — DISCOVERY',
    title: 'Research & Wireframes',
    description:
      'Deep-dive into stakeholder interviews, competitive audits, and user journey mapping. Low-fidelity wireframes validated against real data before a single pixel is rendered.',
    highlights: ['Stakeholder Interviews', 'Competitive Audit', 'Journey Mapping', 'Wireframe Prototypes'],
    visual: 'wireframe',
  },
  {
    id: 'architecture',
    label: '02 — ARCHITECTURE',
    title: 'System Design',
    description:
      'Component-driven architecture with clear dependency graphs. API contracts, database schemas, and deployment pipelines designed before implementation begins.',
    highlights: ['Component Graph', 'API Contracts', 'DB Schema', 'CI/CD Pipeline'],
    visual: 'architecture',
  },
  {
    id: 'implementation',
    label: '03 — IMPLEMENTATION',
    title: 'Code & Build',
    description:
      'Type-safe React components, hardware-accelerated animations, and pixel-perfect CSS. Every line reviewed, every bundle optimized, every interaction profiled.',
    highlights: ['TypeScript React', 'GSAP Animations', 'Performance Profiling', 'Code Review'],
    visual: 'code',
  },
  {
    id: 'deployment',
    label: '04 — DEPLOYMENT',
    title: 'Ship & Measure',
    description:
      'Automated CI/CD pipelines, Lighthouse audits on every PR, real-time performance monitoring. Ship with confidence, iterate with data.',
    highlights: ['CI/CD Automation', 'Lighthouse CI', 'Performance Monitoring', 'A/B Testing'],
    visual: 'deploy',
  },
];

/* ─── Visual SVGs for each panel ─── */
function PanelVisual({ type }: { type: string }) {
  const baseClass = 'w-full h-full text-void-line';

  if (type === 'wireframe') {
    return (
      <svg viewBox="0 0 300 200" fill="none" className={baseClass} aria-hidden="true">
        {/* Wireframe mockup */}
        <rect x="10" y="10" width="280" height="30" rx="2" stroke="currentColor" strokeWidth="1" />
        <rect x="10" y="50" width="180" height="140" rx="2" stroke="currentColor" strokeWidth="1" />
        <rect x="200" y="50" width="90" height="65" rx="2" stroke="currentColor" strokeWidth="1" />
        <rect x="200" y="125" width="90" height="65" rx="2" stroke="currentColor" strokeWidth="1" />
        <line x1="20" y1="25" x2="80" y2="25" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="270" cy="25" r="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        <circle cx="255" cy="25" r="4" stroke="currentColor" strokeWidth="1" strokeOpacity="0.4" />
        <rect x="20" y="60" width="160" height="8" rx="1" fill="currentColor" fillOpacity="0.15" />
        <rect x="20" y="75" width="120" height="8" rx="1" fill="currentColor" fillOpacity="0.1" />
        <rect x="20" y="90" width="140" height="8" rx="1" fill="currentColor" fillOpacity="0.1" />
      </svg>
    );
  }

  if (type === 'architecture') {
    return (
      <svg viewBox="0 0 300 200" fill="none" className={baseClass} aria-hidden="true">
        {/* Architecture diagram */}
        <rect x="110" y="10" width="80" height="30" rx="2" stroke="#00F0FF" strokeWidth="1" strokeOpacity="0.5" />
        <text x="150" y="30" textAnchor="middle" fill="#A1A1AA" fontSize="8" fontFamily="JetBrains Mono">CLIENT</text>
        <rect x="30" y="80" width="70" height="30" rx="2" stroke="currentColor" strokeWidth="1" />
        <text x="65" y="100" textAnchor="middle" fill="#A1A1AA" fontSize="7" fontFamily="JetBrains Mono">API GW</text>
        <rect x="115" y="80" width="70" height="30" rx="2" stroke="currentColor" strokeWidth="1" />
        <text x="150" y="100" textAnchor="middle" fill="#A1A1AA" fontSize="7" fontFamily="JetBrains Mono">AUTH</text>
        <rect x="200" y="80" width="70" height="30" rx="2" stroke="currentColor" strokeWidth="1" />
        <text x="235" y="100" textAnchor="middle" fill="#A1A1AA" fontSize="7" fontFamily="JetBrains Mono">CDN</text>
        <rect x="70" y="150" width="70" height="30" rx="2" stroke="#8A2BE2" strokeWidth="1" strokeOpacity="0.5" />
        <text x="105" y="170" textAnchor="middle" fill="#A1A1AA" fontSize="7" fontFamily="JetBrains Mono">DB</text>
        <rect x="160" y="150" width="70" height="30" rx="2" stroke="#8A2BE2" strokeWidth="1" strokeOpacity="0.5" />
        <text x="195" y="170" textAnchor="middle" fill="#A1A1AA" fontSize="7" fontFamily="JetBrains Mono">CACHE</text>
        <line x1="150" y1="40" x2="65" y2="80" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="150" y1="40" x2="150" y2="80" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="150" y1="40" x2="235" y2="80" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="65" y1="110" x2="105" y2="150" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
        <line x1="150" y1="110" x2="195" y2="150" stroke="currentColor" strokeWidth="0.5" strokeOpacity="0.3" />
      </svg>
    );
  }

  if (type === 'code') {
    return (
      <div className="w-full h-full" aria-hidden="true">
        <img
          src="/images/code-editor.png"
          alt=""
          className="w-full h-full object-cover rounded opacity-60"
          loading="lazy"
        />
      </div>
    );
  }

  // deploy
  return (
    <div className="w-full h-full" aria-hidden="true">
      <img
        src="/images/dashboard.png"
        alt=""
        className="w-full h-full object-cover rounded opacity-60"
        loading="lazy"
      />
    </div>
  );
}

/* ─── Terminal-style window header ─── */
function WindowHeader({ label }: { label: string }) {
  return (
    <div className="flex items-center h-8 px-4 border-b border-void-line">
      {/* macOS dots — monochrome per design system */}
      <div className="flex gap-1.5 mr-4">
        <div className="w-1.5 h-1.5 rounded-full bg-signal-low" />
        <div className="w-1.5 h-1.5 rounded-full bg-signal-low" />
        <div className="w-1.5 h-1.5 rounded-full bg-signal-low" />
      </div>
      <span className="node-label">{label}</span>
    </div>
  );
}

/* ─── Main Component ─── */
export default function HorizontalProcess() {
  const sectionRef = useRef<HTMLElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const card0 = useRef<HTMLDivElement>(null);
  const card1 = useRef<HTMLDivElement>(null);
  const card2 = useRef<HTMLDivElement>(null);
  const card3 = useRef<HTMLDivElement>(null);
  const cardRefs = [card0, card1, card2, card3];
  const prefersReduced = useReducedMotion();

  // Apply 3D tilt to each terminal card
  useTilt3D(card0);
  useTilt3D(card1);
  useTilt3D(card2);
  useTilt3D(card3);

  useLayoutEffect(() => {
    if (prefersReduced) return; // No pinning for reduced motion

    const section = sectionRef.current;
    const track = trackRef.current;
    if (!section || !track) return;

    const ctx = gsap.context(() => {
      // Horizontal scroll: pin section, translate track
      const mm = gsap.matchMedia();

      mm.add('(min-width: 768px)', () => {
        gsap.to(track, {
          xPercent: -75, // 4 panels → move 3 panels worth
          ease: 'none',
          scrollTrigger: {
            trigger: section,
            pin: true,
            scrub: 1,
            start: 'top top',
            end: '+=300%', // 3x viewport height of scroll distance
            invalidateOnRefresh: true,
          },
        });
      });
    }, section);

    return () => ctx.revert();
  }, [prefersReduced]);

  return (
    <section
      id="process"
      ref={sectionRef}
      className="relative overflow-hidden"
      aria-label="Development Process"
    >
      {/* Section intro */}
      <div className="text-center py-16 md:py-0 md:absolute md:top-8 md:left-0 md:right-0 md:z-10">
        <p className="node-label mb-3">ACT II</p>
        <h2 className="font-architect text-3xl md:text-4xl font-bold tracking-architect-base text-signal-high">
          The Blueprint
        </h2>
      </div>

      {/* Horizontal track — 4 panels side by side on desktop */}
      <div
        ref={trackRef}
        className="
          flex flex-col md:flex-row
          md:w-[400vw] md:h-screen
        "
      >
        {panels.map((panel) => (
          <article
            key={panel.id}
            className="
              w-full md:w-screen md:h-screen
              flex items-center justify-center
              px-6 py-16 md:px-16 md:py-0
            "
          >
            <div className="max-w-5xl w-full grid md:grid-cols-2 gap-8 md:gap-16 items-center">
              {/* Text side */}
              <div>
                <p className="node-label mb-3">{panel.label}</p>
                <h3 className="font-architect text-3xl md:text-4xl lg:text-5xl font-bold tracking-architect-tight leading-none text-signal-high mb-6">
                  {panel.title}
                </h3>
                <p className="narrator-text mb-8">{panel.description}</p>

                {/* Highlight tags */}
                <div className="flex flex-wrap gap-2">
                  {panel.highlights.map((tag) => (
                    <span
                      key={tag}
                      className="wireframe-outline px-3 py-1 text-xs font-engineer uppercase tracking-engineer-label text-signal-low"
                    >
                      {tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Visual side — terminal window with 3D tilt */}
              <div ref={cardRefs[panels.indexOf(panel)]} className="wireframe-outline overflow-hidden transition-shadow duration-300 hover:shadow-[0_0_20px_rgba(0,240,255,0.08)]">
                <WindowHeader label={panel.label} />
                <div className="p-4 h-48 md:h-64">
                  <PanelVisual type={panel.visual} />
                </div>
              </div>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}
