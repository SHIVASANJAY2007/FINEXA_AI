import { useEffect } from 'react';

/**
 * useScrollLock – prevent background page scrolling while an overlay is open.
 *
 * Only applies while `active` is truthy. Saves and restores the previous
 * `document.body.style.overflow` value so stacked overlays restore correctly
 * and pre-existing inline styles are never clobbered.
 *
 * @param {boolean} active Whether the scroll lock should be engaged.
 */
export function useScrollLock(active) {
  useEffect(() => {
    if (!active) return;

    const { body } = document;
    const previousOverflow = body.style.overflow;
    body.style.overflow = 'hidden';

    return () => {
      body.style.overflow = previousOverflow;
    };
  }, [active]);
}