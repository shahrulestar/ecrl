"use client";

import { useEffect, useRef, useState } from "react";

function sen(amount: number) {
  return Math.round(amount * 100) / 100;
}

function easeOutQuart(t: number) {
  return 1 - (1 - t) ** 4;
}

function prefersReducedMotion() {
  return window.matchMedia("(prefers-reduced-motion: reduce)").matches;
}

export function useAnimatedNumber(target: number, durationMs = 900) {
  const [display, setDisplay] = useState(() => sen(target));
  const displayRef = useRef(display);
  const first = useRef(true);

  useEffect(() => {
    displayRef.current = display;
  }, [display]);

  useEffect(() => {
    const next = sen(target);
    if (first.current) {
      first.current = false;
      displayRef.current = next;
      setDisplay(next);
      return;
    }

    const from = displayRef.current;
    if (from === next || prefersReducedMotion()) {
      displayRef.current = next;
      setDisplay(next);
      return;
    }

    const start = performance.now();
    let frame = 0;

    function tick(now: number) {
      const t = Math.min(1, (now - start) / durationMs);
      const value = sen(from + (next - from) * easeOutQuart(t));
      displayRef.current = value;
      setDisplay(value);
      if (t < 1) frame = requestAnimationFrame(tick);
    }

    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [target, durationMs]);

  return display;
}
