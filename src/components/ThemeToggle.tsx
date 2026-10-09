import { useRef, useCallback, useEffect } from 'react';
import { useTheme } from '../app/ThemeProvider';
import { copy } from '../content/copy';
import { startViewTransition, createCircularReveal, applyInstantSwap } from '../app/viewTransition';

export function ThemeToggle() {
  const { theme, toggleTheme } = useTheme();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const isAnimating = useRef(false);

  const handleToggle = useCallback(async () => {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const button = buttonRef.current;
    if (!button) {
      toggleTheme();
      isAnimating.current = false;
      return;
    }

    const rect = button.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    const maxRadius = Math.hypot(
      Math.max(centerX, window.innerWidth - centerX),
      Math.max(centerY, window.innerHeight - centerY)
    );

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (prefersReducedMotion || !document.startViewTransition) {
      await applyInstantSwap(() => toggleTheme());
      isAnimating.current = false;
      return;
    }

    await startViewTransition(async () => {
      toggleTheme();
      
      const overlay = document.createElement('div');
      overlay.style.cssText = `
        position: fixed;
        inset: 0;
        z-index: 9998;
        background: var(--bg);
        clip-path: circle(0px at ${centerX}px ${centerY}px);
        pointer-events: none;
      `;
      document.body.appendChild(overlay);

      await new Promise(resolve => {
        requestAnimationFrame(() => {
          overlay.style.transition = 'clip-path 800ms cubic-bezier(0.7, 0, 0.2, 1)';
          overlay.style.clipPath = `circle(${maxRadius}px at ${centerX}px ${centerY}px)`;
        });
        setTimeout(() => {
          overlay.remove();
          resolve(void 0);
        }, 800);
      });
    });

    isAnimating.current = false;
  }, [theme, toggleTheme]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, []);

  return (
    <button
      ref={buttonRef}
      onClick={handleToggle}
      className="fixed bottom-6 right-6 z-50 w-14 h-14 rounded-full border-2 border-[var(--rule)] bg-[var(--bg)] flex items-center justify-center font-mono uppercase-tracked text-[var(--fg-muted)] hover:text-[var(--fg)] hover:border-[var(--fg-muted)] transition-all duration-240 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] shadow-[4px_4px_0_0_var(--rule)]"
      aria-label={copy.nav.toggleLabel}
      aria-pressed={theme === 'erevan'}
      title={copy.nav.toggleLabel}
    >
      <span className="relative z-10" aria-hidden="true">
        {theme === 'ground' ? '◐' : '◑'}
      </span>
      <span className="sr-only">
        {theme === 'ground' ? 'Switch to Erevan mode' : 'Switch to Ground mode'}
      </span>
    </button>
  );
}