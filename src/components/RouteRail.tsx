import { useEffect, type MutableRefObject } from 'react';

/*
 * The scroll-drawn route rail, shared by sections that hang content off it.
 * One line runs down the left and draws as you scroll; it alternates between
 * two x positions joined by a short jog. Everything is fully drawn by default,
 * so reduced motion (or no script) shows the finished route.
 *
 * Each row (<li>) must have `group/stop` + `data-reached="true"`, and render
 * <Rail index={i} /> in its first grid column.
 */

export const RAIL_X = [8, 28];
export const JOG = 24;
const clamp = (n: number) => Math.min(1, Math.max(0, n));

export function useRouteDraw(rows: MutableRefObject<(HTMLLIElement | null)[]>) {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let frame = 0;
    const update = () => {
      frame = 0;
      const trigger = window.innerHeight * 0.7;
      rows.current.forEach((row) => {
        if (!row) return;
        const rail = row.querySelector<HTMLElement>('[data-rail]');
        const line = row.querySelector<HTMLElement>('[data-line]');
        const jog = row.querySelector<SVGPathElement>('[data-jog]');
        if (!rail || !line) return;
        const rect = rail.getBoundingClientRect();
        const jogHeight = jog ? JOG : 0;
        const jogProgress = jog ? clamp((trigger - rect.top) / JOG) : 1;
        const lineProgress = clamp((trigger - rect.top - jogHeight) / Math.max(rect.height - jogHeight, 1));
        line.style.transform = `scaleY(${lineProgress})`;
        if (jog) jog.style.strokeDashoffset = String(1 - jogProgress);
        row.dataset.reached = trigger > rect.top ? 'true' : 'false';
      });
    };
    const onScroll = () => {
      if (!frame) frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (frame) cancelAnimationFrame(frame);
    };
  }, [rows]);
}

export function Rail({ index }: { index: number }) {
  const x = RAIL_X[index % 2];
  const previousX = RAIL_X[(index + 1) % 2];
  const hasJog = index > 0;
  const top = hasJog ? JOG : 0;

  return (
    <div data-rail className="relative" aria-hidden="true">
      {hasJog && (
        <svg className="absolute top-0 left-0" width="40" height={JOG} viewBox={`0 0 40 ${JOG}`} fill="none">
          <path
            data-jog
            d={`M${previousX} 0 C${previousX} ${JOG / 2} ${x} ${JOG / 2} ${x} ${JOG}`}
            stroke="var(--signal)"
            strokeWidth="2"
            pathLength={1}
            strokeDasharray="1"
            strokeDashoffset="0"
          />
        </svg>
      )}
      <span
        data-line
        className="absolute block w-[2px] bg-[var(--signal)] origin-top"
        style={{ left: x - 1, top, bottom: 0, transform: 'scaleY(1)' }}
      />
      <span
        className="absolute block h-[14px] w-[14px] rounded-full border-2 border-[var(--signal)] bg-[var(--bg)] group-data-[reached=true]/stop:bg-[var(--signal)] transition-colors duration-[240ms]"
        style={{ left: x - 7, top: top + 6 }}
      />
    </div>
  );
}
