import { useRef, useLayoutEffect, type RefObject } from 'react';
import gsap from 'gsap';

/**
 * Wraps GSAP animations in a context scoped to a container ref.
 * Auto-reverts all animations on unmount (no memory leaks).
 */
export function useGSAP(
  callback: () => (() => void) | void,
  deps: unknown[] = [],
  scope?: RefObject<HTMLElement | null>,
) {
  const ctxRef = useRef<gsap.Context | null>(null);

  useLayoutEffect(() => {
    ctxRef.current = gsap.context(() => {
      callback();
    }, scope?.current || undefined);

    return () => {
      ctxRef.current?.revert();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, deps);

  return ctxRef;
}
