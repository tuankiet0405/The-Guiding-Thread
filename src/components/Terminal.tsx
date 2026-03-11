import { useRef, useState, useLayoutEffect, useEffect, type FormEvent } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { useReducedMotion } from '../hooks/useReducedMotion';
import { useMagnetic } from '../hooks/useMagnetic';

gsap.registerPlugin(ScrollTrigger);

/* ─── Terminal typing lines ─── */
const introLines = [
  { prefix: '~', text: 'cd /the-guiding-thread', delay: 0 },
  { prefix: '→', text: 'Loading portfolio...', delay: 0.8 },
  { prefix: '✓', text: 'Acts I–III rendered successfully.', delay: 1.6 },
  { prefix: '→', text: "Ready to connect. Let's start a thread.", delay: 2.4 },
];

/**
 * Terminal — Act IV: The Synthesis
 *
 * Interactive terminal CTA with:
 * 1. Scroll-triggered typing animation
 * 2. Contact form (name, email, message)
 * 3. Terminal-aesthetic styling per design system
 */
export default function Terminal() {
  const sectionRef = useRef<HTMLElement>(null);
  const terminalRef = useRef<HTMLDivElement>(null);
  const linesRef = useRef<HTMLDivElement>(null);
  const formRef = useRef<HTMLFormElement>(null);
  const ctaButtonRef = useRef<HTMLButtonElement>(null);
  const prefersReduced = useReducedMotion();

  // Magnetic effect on CTA button
  useMagnetic(ctaButtonRef, { radius: 100, strength: 6 });

  const [showForm, setShowForm] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', message: '' });

  // Scroll-triggered terminal reveal + typing animation
  useLayoutEffect(() => {
    const section = sectionRef.current;
    const terminal = terminalRef.current;
    if (!section || !terminal) return;

    if (prefersReduced) {
      gsap.set(terminal, { opacity: 1, y: 0 });
      setShowForm(true);
      return;
    }

    gsap.set(terminal, { opacity: 0, y: 40 });

    const ctx = gsap.context(() => {
      // Reveal terminal on scroll
      gsap.to(terminal, {
        opacity: 1,
        y: 0,
        duration: 1,
        ease: 'expo.out',
        scrollTrigger: {
          trigger: section,
          start: 'top 70%',
          once: true,
          onEnter: () => {
            // Start typing animation after terminal fades in
            setTimeout(() => typeLines(), 500);
          },
        },
      });
    }, section);

    return () => ctx.revert();
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReduced]);

  // Typing animation for intro lines
  const typeLines = () => {
    const container = linesRef.current;
    if (!container) return;

    const lineEls = container.querySelectorAll('.terminal-line');

    lineEls.forEach((el, i) => {
      gsap.fromTo(
        el,
        { opacity: 0, x: -10 },
        {
          opacity: 1,
          x: 0,
          duration: 0.4,
          ease: 'power2.out',
          delay: introLines[i].delay,
        },
      );
    });

    // Show form after all lines typed
    const lastDelay = introLines[introLines.length - 1].delay;
    setTimeout(() => setShowForm(true), (lastDelay + 0.8) * 1000);
  };

  // Show form container with animation
  useEffect(() => {
    if (!showForm || !formRef.current || prefersReduced) return;

    gsap.fromTo(
      formRef.current,
      { opacity: 0, y: 20 },
      { opacity: 1, y: 0, duration: 0.6, ease: 'expo.out' },
    );
  }, [showForm, prefersReduced]);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    // In production, wire to Formspree / Netlify Forms / custom API
    console.log('Form submitted:', formData);
    setSubmitted(true);
  };

  return (
    <section
      id="contact"
      ref={sectionRef}
      className="relative py-32 md:py-48"
      aria-label="Contact — Start a new thread"
    >
      <div className="max-w-3xl mx-auto px-6">
        {/* Section header */}
        <div className="text-center mb-12">
          <p className="node-label mb-3">ACT IV</p>
          <h2 className="font-architect text-4xl md:text-5xl lg:text-6xl font-bold tracking-architect-tight leading-none text-signal-high mb-6">
            The Synthesis
          </h2>
          <p className="narrator-text mx-auto">
            The thread reaches its end. Let's weave a new one together.
          </p>
        </div>

        {/* Terminal window */}
        <div
          ref={terminalRef}
          className="wireframe-outline overflow-hidden"
          role="region"
          aria-label="Terminal interface"
        >
          {/* Terminal header bar */}
          <div className="flex items-center justify-between h-10 px-4 border-b border-void-line bg-void-surface/50">
            <div className="flex items-center gap-3">
              {/* macOS dots */}
              <div className="flex gap-1.5">
                <div className="w-2.5 h-2.5 rounded-full bg-[#FF5F57]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#FEBC2E]" />
                <div className="w-2.5 h-2.5 rounded-full bg-[#28C840]" />
              </div>
              <span className="node-label text-signal-low glitch-hover" data-text="TERMINAL — ZSH">TERMINAL — ZSH</span>
            </div>
            <span className="node-label text-signal-low">⌘ + T</span>
          </div>

          {/* Terminal body */}
          <div className="p-6 md:p-8 font-engineer text-sm leading-relaxed min-h-[300px]">
            {/* Typing lines */}
            <div ref={linesRef}>
              {introLines.map((line, i) => (
                <div
                  key={i}
                  className="terminal-line flex gap-2 mb-2"
                  style={{ opacity: prefersReduced ? 1 : 0 }}
                >
                  <span className={
                    line.prefix === '✓'
                      ? 'text-metric-success'
                      : line.prefix === '→'
                        ? 'text-thread-cyan'
                        : 'text-signal-mid'
                  }>
                    {line.prefix}
                  </span>
                  <span className="text-signal-mid">{line.text}</span>
                </div>
              ))}
            </div>

            {/* Contact form — appears after typing completes */}
            {showForm && !submitted && (
              <form
                ref={formRef}
                onSubmit={handleSubmit}
                className="mt-6 space-y-4"
                style={{ opacity: prefersReduced ? 1 : undefined }}
              >
                <div className="flex flex-col gap-1">
                  <label htmlFor="terminal-name" className="text-thread-cyan text-xs">
                    {'>'} name:
                  </label>
                  <input
                    id="terminal-name"
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData((d) => ({ ...d, name: e.target.value }))}
                    className="bg-transparent border-b border-void-line text-signal-high font-engineer text-sm py-1 focus:outline-none focus:border-thread-cyan transition-colors duration-300"
                    placeholder="your name"
                    autoComplete="name"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="terminal-email" className="text-thread-cyan text-xs">
                    {'>'} email:
                  </label>
                  <input
                    id="terminal-email"
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData((d) => ({ ...d, email: e.target.value }))}
                    className="bg-transparent border-b border-void-line text-signal-high font-engineer text-sm py-1 focus:outline-none focus:border-thread-cyan transition-colors duration-300"
                    placeholder="your@email.com"
                    autoComplete="email"
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label htmlFor="terminal-message" className="text-thread-cyan text-xs">
                    {'>'} message:
                  </label>
                  <textarea
                    id="terminal-message"
                    required
                    rows={3}
                    value={formData.message}
                    onChange={(e) => setFormData((d) => ({ ...d, message: e.target.value }))}
                    className="bg-transparent border-b border-void-line text-signal-high font-engineer text-sm py-1 focus:outline-none focus:border-thread-cyan transition-colors duration-300 resize-none"
                    placeholder="Tell me about your project..."
                  />
                </div>

                <button
                  ref={ctaButtonRef}
                  type="submit"
                  className="mt-4 inline-flex items-center gap-2 glass-card px-6 py-3 text-thread-cyan font-engineer text-sm uppercase tracking-engineer-label hover:border-thread-cyan/50 hover:shadow-[0_0_16px_rgba(0,240,255,0.15)] transition-all duration-300 ease-hover-in cursor-pointer"
                >
                  <span>{'>'}</span>
                  <span>Send thread</span>
                  <span className="animate-cursor-blink">_</span>
                </button>
              </form>
            )}

            {/* Success message */}
            {submitted && (
              <div className="mt-6">
                <div className="flex gap-2 mb-2">
                  <span className="text-metric-success">✓</span>
                  <span className="text-signal-mid">Thread sent successfully.</span>
                </div>
                <div className="flex gap-2">
                  <span className="text-thread-cyan">→</span>
                  <span className="text-signal-mid">I'll reply within 24 hours.</span>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="node-label text-signal-low">
            © {new Date().getFullYear()} The Guiding Thread — Built with React, GSAP &amp; precision.
          </p>
        </div>
      </div>
    </section>
  );
}
