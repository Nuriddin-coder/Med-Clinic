'use client';

import { useState, useEffect } from 'react';

export function useMatchMedia(minWidth: number): boolean | null {
  const [matches, setMatches] = useState<boolean | null>(null);

  useEffect(() => {
    const query = `(min-width: ${minWidth}px)`;
    const media = window.matchMedia(query);

    const listener = () => setMatches(media.matches);
    listener();

    media.addEventListener('change', listener);

    return () => {
      media.removeEventListener('change', listener);
    };
  }, [minWidth]);

  return matches;
}
