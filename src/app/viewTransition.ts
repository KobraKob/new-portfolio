export function startViewTransition(
  callback: () => void | Promise<void>,
  options?: { fallback?: () => void }
): Promise<void> {
  if (!document.startViewTransition) {
    callback();
    return Promise.resolve();
  }

  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  
  if (prefersReducedMotion) {
    callback();
    return Promise.resolve();
  }

  const transition = document.startViewTransition(async () => {
    await callback();
  });

  return transition.finished.catch(() => {
    // Transition was skipped or failed
  });
}

export function createCircularReveal(
  element: HTMLElement,
  centerX: number,
  centerY: number,
  maxRadius: number
): { clipPath: string; animate: () => Promise<void> } {
  const startRadius = 0;
  const endRadius = maxRadius;
  
  const clipPath = `circle(${endRadius}px at ${centerX}px ${centerY}px)`;
  
  return {
    clipPath,
    animate: () => {
      return new Promise((resolve) => {
        element.style.clipPath = `circle(${startRadius}px at ${centerX}px ${centerY}px)`;
        element.style.transition = 'clip-path 800ms cubic-bezier(0.7, 0, 0.2, 1)';
        
        requestAnimationFrame(() => {
          element.style.clipPath = clipPath;
        });
        
        setTimeout(resolve, 800);
      });
    }
  };
}

export function applyInstantSwap(
  callback: () => void
): Promise<void> {
  return new Promise((resolve) => {
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const duration = prefersReducedMotion ? 0 : 200;
    
    document.body.style.opacity = '0';
    document.body.style.transition = `opacity ${duration}ms ease`;
    
    setTimeout(() => {
      callback();
      document.body.style.opacity = '1';
      setTimeout(resolve, duration);
    }, duration);
  });
}