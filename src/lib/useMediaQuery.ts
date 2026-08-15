"use client";

import { useEffect, useState } from "react";

/**
 * SSR-safe media query hook. Static export has no `window` at render time,
 * so this returns `initial` for the first paint and syncs to the real value
 * in an effect (and live-updates on future changes, e.g. rotating a device
 * or resizing a desktop browser window).
 */
export function useMediaQuery(query: string, initial = true): boolean {
  const [matches, setMatches] = useState(initial);

  useEffect(() => {
    const mql = window.matchMedia(query);
    setMatches(mql.matches);
    const onChange = (e: MediaQueryListEvent) => setMatches(e.matches);
    mql.addEventListener("change", onChange);
    return () => mql.removeEventListener("change", onChange);
  }, [query]);

  return matches;
}
