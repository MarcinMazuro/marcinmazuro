"use client";

import { useSyncExternalStore } from "react";

const QUERY = "(prefers-reduced-motion: reduce)";

function subscribe(notify: () => void) {
  const mq = window.matchMedia(QUERY);
  mq.addEventListener("change", notify);
  return () => mq.removeEventListener("change", notify);
}

/**
 * Whether the user has reduced motion in their OS settings.
 *
 * Used instead of Motion's useReducedMotion: that one returns true right
 * during hydration, so the component rendered a different tree than the
 * server and React threw error #418, re-rendering the whole page. Here the
 * server value (false) applies during hydration and the real one follows.
 */
export function usePrefersReducedMotion(): boolean {
  return useSyncExternalStore(
    subscribe,
    () => window.matchMedia(QUERY).matches,
    () => false,
  );
}
