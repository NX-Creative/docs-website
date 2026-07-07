'use client';

/**
 * "NX Docs" ASCII panel for the site footer.
 *
 * three.js is heavy, so the ASCIIText component is dynamically imported and
 * only mounted once the panel actually approaches the viewport. Under
 * `prefers-reduced-motion` (or before the canvas is ready) a static display
 * wordmark renders instead, so the footer never depends on WebGL.
 */

import dynamic from 'next/dynamic';
import { useEffect, useRef, useState } from 'react';

const ASCIIText = dynamic(() => import('@/components/reactbits/ascii-text'), {
  ssr: false,
});

export function FooterAscii() {
  const panelRef = useRef<HTMLDivElement>(null);
  const [mountCanvas, setMountCanvas] = useState(false);

  useEffect(() => {
    const panel = panelRef.current;
    if (!panel) return;

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    // The wide text plane crops badly in narrow viewports, and phones don't
    // need a three.js scene for a footer; the static wordmark stays instead.
    if (window.innerWidth < 768) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setMountCanvas(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px' },
    );
    observer.observe(panel);
    return () => observer.disconnect();
  }, []);

  return (
    <div
      ref={panelRef}
      className="relative h-40 select-none overflow-hidden md:h-72"
    >
      <span
        className={`font-display-tight absolute inset-0 flex items-center justify-center text-6xl font-semibold text-fd-foreground/10 transition-opacity duration-700 md:text-8xl ${
          mountCanvas ? 'opacity-0' : 'opacity-100'
        }`}
      >
        NX Docs
      </span>
      {mountCanvas ? (
        <ASCIIText
          text="NX Docs"
          asciiFontSize={7}
          planeBaseHeight={11}
          enableWaves
        />
      ) : null}
    </div>
  );
}
