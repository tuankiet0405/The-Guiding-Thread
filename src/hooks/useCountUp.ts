import { useRef, useEffect, useState } from 'react';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

/**
 * useCountUp — Animated number counter triggered on scroll enter
 *
 * @param target - Target number to count up to
 * @param options.duration - Animation duration in seconds (default: 1.5)
 * @param options.suffix - String appended after number (%, x, +, etc.)
 * @param options.prefix - String prepended before number (-, etc.)
 * @param options.once - Only animate once (default: true)
 *
 * Returns [displayValue, triggerRef] — the current display string and a ref to attach to the scroll trigger element.
 */
export function useCountUp(
  target: number,
  options: {
    duration?: number;
    suffix?: string;
    prefix?: string;
    once?: boolean;
  } = {},
): [string, React.RefObject<HTMLElement | null>] {
  const { duration = 1.5, suffix = '', prefix = '', once = true } = options;
  const [display, setDisplay] = useState(`${prefix}0${suffix}`);
  const triggerRef = useRef<HTMLElement>(null);
  const hasTriggeredRef = useRef(false);

  useEffect(() => {
    const el = triggerRef.current;
    if (!el) return;

    const counter = { val: 0 };

    const trigger = ScrollTrigger.create({
      trigger: el,
      start: 'top 80%',
      onEnter: () => {
        if (once && hasTriggeredRef.current) return;
        hasTriggeredRef.current = true;

        gsap.to(counter, {
          val: target,
          duration,
          ease: 'power2.out',
          snap: { val: 1 },
          onUpdate: () => {
            setDisplay(`${prefix}${Math.round(counter.val)}${suffix}`);
          },
        });
      },
    });

    return () => trigger.kill();
  }, [target, duration, suffix, prefix, once]);

  return [display, triggerRef];
}
