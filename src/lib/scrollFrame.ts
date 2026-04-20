/**
 * One window scroll/resize listener + one rAF per frame for all subscribers.
 * Cuts duplicate layout reads and listener churn from multiple sections.
 */
const listeners = new Set<() => void>();
let refCount = 0;
let rafId = 0;

function runAll() {
  rafId = 0;
  listeners.forEach((fn) => {
    try {
      fn();
    } catch {
      /* ignore subscriber errors */
    }
  });
}

function onScrollOrResize() {
  if (rafId) return;
  rafId = requestAnimationFrame(runAll);
}

export function subscribeScrollFrame(onFrame: () => void): () => void {
  listeners.add(onFrame);
  refCount++;
  if (refCount === 1) {
    window.addEventListener("scroll", onScrollOrResize, { passive: true });
    window.addEventListener("resize", onScrollOrResize, { passive: true });
  }
  onFrame();
  return () => {
    listeners.delete(onFrame);
    refCount--;
    if (refCount <= 0) {
      refCount = 0;
      window.removeEventListener("scroll", onScrollOrResize);
      window.removeEventListener("resize", onScrollOrResize);
      if (rafId) {
        cancelAnimationFrame(rafId);
        rafId = 0;
      }
    }
  };
}
