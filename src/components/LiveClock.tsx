import { useEffect, useState } from 'react';
import { formatTime } from '../lib/utils';
import { copy } from '../content/copy';

export function LiveClock() {
  const [time, setTime] = useState(() => formatTime(new Date()));

  useEffect(() => {
    const updateTime = () => setTime(formatTime(new Date()));
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2 font-mono uppercase-tracked text-[var(--fg-muted)]" aria-live="polite">
      <span 
        className="w-2 h-2 rounded-full bg-[var(--counter)] animate-pulse" 
        aria-hidden="true"
      />
      <span className="tabular-nums">{time}</span>
      <span className="text-[var(--fg-muted)]">{copy.clock.timezone}</span>
    </div>
  );
}