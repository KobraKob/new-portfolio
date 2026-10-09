import { useEffect, useRef, useState } from 'react';

type Pointer = { x: number; y: number; lat: number; lng: number };

export function MapInstrumentation() {
  const [progress, setProgress] = useState(0);
  const [pointer, setPointer] = useState<Pointer | null>(null);
  const pointerFrame = useRef<number | null>(null);
  const nextPointer = useRef<Pointer | null>(null);
  const scrollFrame = useRef<number | null>(null);

  useEffect(() => {
    const updateProgress = () => {
      const height = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(height > 0 ? Math.round((window.scrollY / height) * 100) : 0);
    };
    const scheduleProgress = () => {
      if (scrollFrame.current !== null) return;
      scrollFrame.current = requestAnimationFrame(() => {
        scrollFrame.current = null;
        updateProgress();
      });
    };
    const updatePointer = (event: PointerEvent) => {
      nextPointer.current = {
        x: event.clientX,
        y: event.clientY,
        lat: 12.9716 + (event.clientY / window.innerHeight - 0.5) * 0.01,
        lng: 77.5946 + (event.clientX / window.innerWidth - 0.5) * 0.01,
      };
      if (pointerFrame.current !== null) return;
      pointerFrame.current = requestAnimationFrame(() => {
        pointerFrame.current = null;
        setPointer(nextPointer.current);
      });
    };

    updateProgress();
    window.addEventListener('scroll', scheduleProgress, { passive: true });
    window.addEventListener('resize', scheduleProgress);
    window.addEventListener('pointermove', updatePointer, { passive: true });
    return () => {
      window.removeEventListener('scroll', scheduleProgress);
      window.removeEventListener('resize', scheduleProgress);
      window.removeEventListener('pointermove', updatePointer);
      if (pointerFrame.current !== null) cancelAnimationFrame(pointerFrame.current);
      if (scrollFrame.current !== null) cancelAnimationFrame(scrollFrame.current);
    };
  }, []);

  return (
    <>
      <aside className="pointer-events-none fixed bottom-8 left-20 z-30 hidden items-end gap-3 lg:flex" aria-hidden="true">
        <span className="font-mono text-[10px] tracking-[0.12em] text-[var(--fg-muted)]">SCALE 1:∞ — {progress}%</span>
        <span className="relative block h-1 w-28 border border-[var(--rule)]">
          <span className="absolute inset-y-0 left-0 block bg-[var(--signal)]" style={{ width: `${progress}%` }} />
        </span>
      </aside>
      <div className="pointer-events-none fixed inset-y-0 left-[78px] z-30 hidden w-px bg-[var(--rule)] lg:block" aria-hidden="true">
        <span className="absolute left-1/2 top-0 h-[var(--route-progress)] w-[3px] -translate-x-1/2 bg-[var(--signal)]" style={{ ['--route-progress' as string]: `${progress}%` }} />
      </div>
      {pointer && (
        <div
          className="pointer-events-none fixed z-[80] hidden h-8 w-8 -translate-x-1/2 -translate-y-1/2 border border-[var(--signal)] mix-blend-multiply md:block"
          style={{ left: pointer.x, top: pointer.y }}
          aria-hidden="true"
        >
          <span className="absolute left-1/2 top-[-5px] h-[3px] w-px -translate-x-1/2 bg-[var(--signal)]" />
          <span className="absolute bottom-[-5px] left-1/2 h-[3px] w-px -translate-x-1/2 bg-[var(--signal)]" />
          <span className="absolute left-[-5px] top-1/2 h-px w-[3px] -translate-y-1/2 bg-[var(--signal)]" />
          <span className="absolute right-[-5px] top-1/2 h-px w-[3px] -translate-y-1/2 bg-[var(--signal)]" />
          <span className="absolute left-5 top-9 whitespace-nowrap font-mono text-[9px] tracking-[0.06em] text-[var(--signal-text)]">
            {pointer.lat.toFixed(4)}° N / {pointer.lng.toFixed(4)}° E
          </span>
        </div>
      )}
    </>
  );
}
