import { useRef, useState, useCallback, useEffect } from 'react';

/**
 * useResizable – drag-to-resize two-panel layout.
 *
 * @param {number} defaultPct  Initial left-panel width as a percentage (0–100)
 * @param {number} minPct      Minimum allowed left-panel width percentage
 * @param {number} maxPct      Maximum allowed left-panel width percentage
 */
export function useResizable(defaultPct = 66.66, minPct = 30, maxPct = 75) {
  const containerRef = useRef(null);
  const [widthPct, setWidthPct] = useState(defaultPct);

  const startDrag = useCallback(
    (e) => {
      e.preventDefault();
      const startX = e.clientX;
      const container = containerRef.current;
      if (!container) return;

      const totalWidth = container.getBoundingClientRect().width;
      const startPct = widthPct;

      const onMove = (moveEvent) => {
        const delta = moveEvent.clientX - startX;
        const newPct = startPct + (delta / totalWidth) * 100;
        setWidthPct(Math.min(maxPct, Math.max(minPct, newPct)));
      };

      const onUp = () => {
        window.removeEventListener('pointermove', onMove);
        window.removeEventListener('pointerup', onUp);
      };

      window.addEventListener('pointermove', onMove);
      window.addEventListener('pointerup', onUp);
    },
    [widthPct, minPct, maxPct]
  );

  // Sync CSS variable so child elements can reference --left-width
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.style.setProperty('--left-width', `${widthPct}%`);
    }
  }, [widthPct]);

  return { containerRef, startDrag, initialWidth: widthPct };
}
