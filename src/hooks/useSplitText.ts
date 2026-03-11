import { useRef, useLayoutEffect, type RefObject } from 'react';

/**
 * useSplitText — Splits element text into individual char spans
 *
 * On mount, wraps each character of the target element's textContent
 * in a <span> with overflow hidden + clip. Returns refs to all spans
 * for GSAP stagger animations.
 *
 * Only splits once. Does NOT re-split on re-render.
 */
export function useSplitText(
  containerRef: RefObject<HTMLElement | null>,
): RefObject<HTMLSpanElement[]> {
  const charsRef = useRef<HTMLSpanElement[]>([]);
  const hasSplitRef = useRef(false);

  useLayoutEffect(() => {
    const el = containerRef.current;
    if (!el || hasSplitRef.current) return;

    hasSplitRef.current = true;
    const chars: HTMLSpanElement[] = [];

    // Process all child nodes (text + elements like <br>, <span>)
    const fragment = document.createDocumentFragment();

    const processNode = (node: Node) => {
      if (node.nodeType === Node.TEXT_NODE) {
        const text = node.textContent || '';
        for (const char of text) {
          if (char === ' ') {
            // Preserve spaces
            const space = document.createTextNode(' ');
            fragment.appendChild(space);
          } else {
            // Wrap char in overflow-hidden span for clip reveal
            const wrapper = document.createElement('span');
            wrapper.style.display = 'inline-block';
            wrapper.style.overflow = 'hidden';
            wrapper.style.verticalAlign = 'top';

            const inner = document.createElement('span');
            inner.textContent = char;
            inner.style.display = 'inline-block';
            inner.style.willChange = 'transform';

            wrapper.appendChild(inner);
            fragment.appendChild(wrapper);
            chars.push(inner);
          }
        }
      } else if (node.nodeType === Node.ELEMENT_NODE) {
        // Clone element nodes (like <br>, <span class="...">) as-is
        const clone = (node as HTMLElement).cloneNode(false) as HTMLElement;

        // Recursively process child nodes of this element
        const innerFragment = document.createDocumentFragment();

        node.childNodes.forEach((child) => {
          if (child.nodeType === Node.TEXT_NODE) {
            const text = child.textContent || '';
            for (const c of text) {
              if (c === ' ') {
                innerFragment.appendChild(document.createTextNode(' '));
              } else {
                const wrapper = document.createElement('span');
                wrapper.style.display = 'inline-block';
                wrapper.style.overflow = 'hidden';
                wrapper.style.verticalAlign = 'top';

                const inner = document.createElement('span');
                inner.textContent = c;
                inner.style.display = 'inline-block';
                inner.style.willChange = 'transform';

                wrapper.appendChild(inner);
                innerFragment.appendChild(wrapper);
                chars.push(inner);
              }
            }
          } else {
            innerFragment.appendChild(child.cloneNode(true));
          }
        });

        clone.appendChild(innerFragment);
        fragment.appendChild(clone);
      }
    };

    // Process all top-level children
    Array.from(el.childNodes).forEach(processNode);

    // Replace content
    el.innerHTML = '';
    el.appendChild(fragment);

    charsRef.current = chars;
  }, [containerRef]);

  return charsRef;
}
