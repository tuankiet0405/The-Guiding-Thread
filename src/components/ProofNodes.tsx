import { useRef, useLayoutEffect, useState, useEffect } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';

gsap.registerPlugin(ScrollTrigger);

/* ─── Node Data ─── */
const nodes = [
  {
    id: 'nextjs-migration',
    label: 'NEXT.JS MIGRATION',
    numericValue: 62,
    displayTemplate: '-{n}%',
    metric: 'LCP Reduction',
    detail: 'Migrated monolithic React SPA to Next.js App Router with RSC, cutting Largest Contentful Paint from 4.2s to 1.6s.',
    icon: 'hexagon',
  },
  {
    id: 'cicd-pipeline',
    label: 'CI/CD PIPELINE',
    numericValue: 2,
    displayTemplate: '8→{n}min',
    metric: 'Deploy Time',
    detail: 'Rebuilt deployment pipeline with parallel testing, Docker layer caching, and incremental builds. 75% faster ship cycles.',
    icon: 'diamond',
  },
  {
    id: 'aws-optimization',
    label: 'AWS COST',
    numericValue: 41,
    displayTemplate: '-{n}%',
    metric: 'Monthly Spend',
    detail: 'Right-sized EC2 instances, migrated to Graviton, implemented S3 intelligent tiering and CloudFront edge caching.',
    icon: 'octagon',
  },
  {
    id: 'vite-migration',
    label: 'VITE MIGRATION',
    numericValue: 10,
    displayTemplate: '{n}x',
    metric: 'HMR Speed',
    detail: 'Replaced Webpack with Vite for a 120-module monorepo. Hot module replacement dropped from 8s to 0.8s.',
    icon: 'circle',
  },
  {
    id: 'design-system',
    label: 'DESIGN SYSTEM',
    numericValue: 340,
    displayTemplate: '{n}+',
    metric: 'Components',
    detail: 'Built a token-driven design system with automated Figma-to-code sync. 340+ components, 98% design-dev parity.',
    icon: 'hexagon',
  },
  {
    id: 'lighthouse',
    label: 'LIGHTHOUSE',
    numericValue: 98,
    displayTemplate: '{n}',
    metric: 'Performance Score',
    detail: 'Achieved 98/100 Lighthouse score through code splitting, image optimization, font subsetting, and critical CSS inlining.',
    icon: 'diamond',
  },
];

/* ─── Geometric shape outlines ─── */
function NodeShape({ type, className = '' }: { type: string; className?: string }) {
  const base = `w-full h-full ${className}`;

  if (type === 'hexagon') {
    return (
      <svg viewBox="0 0 100 100" fill="none" className={base} aria-hidden="true">
        <polygon
          points="50,2 93,25 93,75 50,98 7,75 7,25"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );
  }

  if (type === 'diamond') {
    return (
      <svg viewBox="0 0 100 100" fill="none" className={base} aria-hidden="true">
        <polygon
          points="50,2 98,50 50,98 2,50"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );
  }

  if (type === 'octagon') {
    return (
      <svg viewBox="0 0 100 100" fill="none" className={base} aria-hidden="true">
        <polygon
          points="30,2 70,2 98,30 98,70 70,98 30,98 2,70 2,30"
          stroke="currentColor"
          strokeWidth="1"
        />
      </svg>
    );
  }

  // circle
  return (
    <svg viewBox="0 0 100 100" fill="none" className={base} aria-hidden="true">
      <circle cx="50" cy="50" r="48" stroke="currentColor" strokeWidth="1" />
    </svg>
  );
}

/* ─── Animated Counter for a single node ─── */
function AnimatedValue({
  numericValue,
  displayTemplate,
  prefersReduced,
}: {
  numericValue: number;
  displayTemplate: string;
  prefersReduced: boolean;
}) {
  const [display, setDisplay] = useState(
    prefersReduced ? displayTemplate.replace('{n}', String(numericValue)) : displayTemplate.replace('{n}', '0'),
  );
  const elRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (prefersReduced) {
      setDisplay(displayTemplate.replace('{n}', String(numericValue)));
      return;
    }

    const el = elRef.current;
    if (!el) return;

    const counter = { val: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 85%',
      once: true,
      onEnter: () => {
        gsap.to(counter, {
          val: numericValue,
          duration: 1.5,
          ease: 'power2.out',
          snap: { val: 1 },
          onUpdate: () => {
            setDisplay(displayTemplate.replace('{n}', String(Math.round(counter.val))));
          },
        });
      },
    });

    return () => trigger.kill();
  }, [numericValue, displayTemplate, prefersReduced]);

  return (
    <span ref={elRef} className="node-value metric-positive">
      {display}
    </span>
  );
}

/* ─── Single Node Component ─── */
function ProofNode({
  node,
  index,
}: {
  node: (typeof nodes)[number];
  index: number;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const prefersReduced = useReducedMotion();

  useLayoutEffect(() => {
    const card = cardRef.current;
    if (!card || prefersReduced) return;

    const ctx = gsap.context(() => {
      // Initial resting state — with subtle rotation for organic feel
      gsap.set(card, {
        opacity: 0,
        scale: 0.85,
        y: 40,
        rotation: index % 2 === 0 ? 2 : -2, // Alternating slight tilt
      });

      // Staggered bloom with back.out easing for more dynamic entry
      gsap.to(card, {
        opacity: 1,
        scale: 1,
        y: 0,
        rotation: 0,
        duration: 1,
        delay: index * 0.15, // Stagger: 0.15s per card
        ease: 'back.out(1.4)',
        scrollTrigger: {
          trigger: card,
          start: 'top 90%',
          toggleActions: 'play none none reverse',
        },
      });
    }, card);

    return () => ctx.revert();
  }, [prefersReduced, index]);

  return (
    <div
      ref={cardRef}
      className="group relative"
      style={{ opacity: prefersReduced ? 1 : undefined }}
    >
      <article className="glass-card p-6 md:p-8 transition-all duration-300 ease-hover-in hover:border-thread-cyan/30 hover:shadow-[0_0_24px_rgba(0,240,255,0.06)]">
        {/* Geometric shape watermark */}
        <div className="absolute top-4 right-4 w-16 h-16 text-void-line opacity-30 group-hover:opacity-50 group-hover:text-thread-cyan/20 transition-all duration-500">
          <NodeShape type={node.icon} />
        </div>

        {/* Engineer label */}
        <p className="node-label mb-3">{node.label}</p>

        {/* BIG animated metric value */}
        <div className="mb-2">
          <AnimatedValue
            numericValue={node.numericValue}
            displayTemplate={node.displayTemplate}
            prefersReduced={prefersReduced}
          />
        </div>

        {/* Metric name */}
        <p className="font-engineer text-sm text-signal-mid mb-4 uppercase tracking-engineer-label">
          {node.metric}
        </p>

        {/* Description — Narrator font */}
        <p className="narrator-text text-sm leading-relaxed">{node.detail}</p>
      </article>
    </div>
  );
}

/* ─── Main Section ─── */
export default function ProofNodes() {
  const sectionRef = useRef<HTMLElement>(null);

  return (
    <section
      id="proof"
      ref={sectionRef}
      className="relative py-32 md:py-48"
      aria-label="Proof of results — Key metrics and achievements"
    >
      <div className="max-w-6xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-20 md:mb-28">
          <p className="node-label mb-3">ACT III</p>
          <h2 className="font-architect text-4xl md:text-5xl lg:text-6xl font-bold tracking-architect-tight leading-none text-signal-high mb-6">
            The Proof
          </h2>
          <p className="narrator-text mx-auto text-lg">
            Every claim is backed by data. Every metric is real.
          </p>
        </div>

        {/* Node grid — 2 cols on md, 3 cols on lg */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-8">
          {nodes.map((node, index) => (
            <ProofNode key={node.id} node={node} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}
