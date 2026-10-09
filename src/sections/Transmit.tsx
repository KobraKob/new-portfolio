import { useEffect, useRef, useState } from 'react';
import { copy } from '../content/copy';
import { LiveClock } from '../components/LiveClock';
import './transmit.css';

// Move into copy.ts if you want all text in one place
const LABELS = {
  status: 'Status',
  stationTime: 'Station time',
  clipboard: 'Clipboard',
  copied: 'Copied',
  copyFailed: 'Copy failed',
  pdf: 'PDF',
  newTab: '(opens in a new tab)',
  backToIndex: 'Back to Index',
};

// Bengaluru, same anchor as the rest of the site
const ORIGIN = { lat: 12.9716, lon: 77.5946 };

const hostOf = (url?: string) => {
  try {
    return url ? new URL(url).hostname.replace(/^www\./, '') : '';
  } catch {
    return '';
  }
};

/* ------------------------------------------------------------------ */
/*  Reveal once when the sheet scrolls into view                       */
/* ------------------------------------------------------------------ */
function useSeen<T extends Element>() {
  const ref = useRef<T>(null);
  const [seen, setSeen] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, seen] as const;
}

/* Small crosshair mark used on each action cell */
function Cross() {
  return (
    <svg className="tm-action__mark" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
      <g fill="none" stroke="currentColor" strokeWidth="1.2">
        <circle cx="7" cy="7" r="3" />
        <path d="M7,0v3.5M7,10.5V14M0,7h3.5M10.5,7H14" />
      </g>
    </svg>
  );
}

const RINGS = Array.from({ length: 9 }, (_, i) => ({ i, r: 36 + i * 48, index: i % 4 === 3 }));

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export function Transmit() {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const [pingKey, setPingKey] = useState(0);
  const [ref, seen] = useSeen<HTMLDivElement>();
  const timer = useRef<number | undefined>(undefined);

  useEffect(() => () => window.clearTimeout(timer.current), []);

  const handleCopyEmail = async () => {
    window.clearTimeout(timer.current);
    try {
      await navigator.clipboard.writeText(copy.meta.email);
      setState('copied');
      setPingKey((k) => k + 1);
    } catch {
      setState('failed');
    }
    timer.current = window.setTimeout(() => setState('idle'), 2000);
  };

  const caption =
    state === 'copied' ? LABELS.copied : state === 'failed' ? LABELS.copyFailed : LABELS.clipboard;

  return (
    <section
      id="transmit"
      className="section relative min-h-[100svh] flex items-center"
      aria-labelledby="transmit-title"
    >
      <div className="container w-full">
        <header className="mb-16">
          <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
            {copy.transmit.title}
          </span>
          <h2
            id="transmit-title"
            className="font-display fraunces-ground text-[var(--fg)]"
            style={{ fontSize: 'var(--step-5)' }}
          >
            {copy.transmit.subtitle}
          </h2>
        </header>

        <div ref={ref} className={`tm-sheet ${seen ? 'is-seen' : ''}`}>
          <div className="tm-sheet__inner">
            {/* Scale strip */}
            <svg className="tm-strip" height="12" aria-hidden="true">
              <line x1="0" y1="6" x2="100%" y2="6" stroke="var(--fg)" strokeOpacity="0.55" strokeWidth="6" strokeDasharray="1 9" />
              <line x1="0" y1="6" x2="100%" y2="6" stroke="var(--fg)" strokeWidth="12" strokeDasharray="1 49" />
            </svg>

            {/* Title block: availability and local time */}
            <div className="tm-block font-mono">
              <div className="tm-cell tm-cell--wide">
                <span className="tm-k">{LABELS.status}</span>
                <span className="tm-v tm-status uppercase-tracked">
                  <span className="tm-dot" aria-hidden="true" />
                  {copy.transmit.availability}
                </span>
              </div>
              <div className="tm-cell">
                <span className="tm-k">{LABELS.stationTime}</span>
                <span className="tm-v">
                  <LiveClock />
                </span>
              </div>
            </div>

            {/* Zone: email on radiating rings */}
            <div className="tm-zone">
              <svg
                className="tm-rings"
                viewBox="0 0 800 360"
                preserveAspectRatio="xMidYMid slice"
                aria-hidden="true"
              >
                <g fill="none">
                  {RINGS.map((ring) => (
                    <ellipse
                      key={ring.i}
                      className="tm-ring"
                      cx="400"
                      cy="180"
                      rx={ring.r * 1.12}
                      ry={ring.r * 0.92}
                      stroke={ring.index ? 'var(--fg-muted)' : 'var(--rule)'}
                      strokeWidth={ring.index ? 1.1 : 0.8}
                      style={{ ['--ring-delay' as string]: `${0.5 + ring.i * 0.1}s` }}
                      data-index={ring.index ? 'true' : 'false'}
                    />
                  ))}
                  {pingKey > 0 && (
                    <ellipse
                      key={pingKey}
                      className="tm-ping"
                      cx="400"
                      cy="180"
                      rx="40"
                      ry="33"
                      stroke="var(--signal)"
                      strokeWidth="1.6"
                    />
                  )}
                </g>
              </svg>

              <span className="tm-corner tm-corner--tl font-mono" aria-hidden="true">
                {ORIGIN.lat.toFixed(4)}°N
              </span>
              <span className="tm-corner tm-corner--br font-mono" aria-hidden="true">
                {ORIGIN.lon.toFixed(4)}°E
              </span>

              {copy.meta.email && (
                <a
                  href={`mailto:${copy.meta.email}`}
                  className="tm-email font-display fraunces-ground text-[var(--fg)]"
                >
                  {copy.meta.email}
                </a>
              )}
            </div>

            {/* Actions */}
            <div className="tm-actions">
              <a
                href={copy.meta.github}
                target="_blank"
                rel="noopener noreferrer"
                className="tm-action"
              >
                <Cross />
                <span className="tm-action__label font-display fraunces-ground text-[var(--fg)]">
                  {copy.transmit.links.github}
                </span>
                <span className="tm-action__cap font-mono">{hostOf(copy.meta.github)}</span>
                <span className="sr-only">{LABELS.newTab}</span>
              </a>

              <a
                href={copy.meta.linkedin}
                target="_blank"
                rel="noopener noreferrer"
                className="tm-action"
              >
                <Cross />
                <span className="tm-action__label font-display fraunces-ground text-[var(--fg)]">
                  {copy.transmit.links.linkedin}
                </span>
                <span className="tm-action__cap font-mono">{hostOf(copy.meta.linkedin)}</span>
                <span className="sr-only">{LABELS.newTab}</span>
              </a>

              <a
                href="/Balavanth_Resume.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="tm-action"
              >
                <Cross />
                <span className="tm-action__label font-display fraunces-ground text-[var(--fg)]">
                  {copy.transmit.links.resume}
                </span>
                <span className="tm-action__cap font-mono">{LABELS.pdf}</span>
                <span className="sr-only">{LABELS.newTab}</span>
              </a>

              {copy.meta.email && (
                <button type="button" onClick={handleCopyEmail} className="tm-action">
                  <Cross />
                  <span className="tm-action__label font-display fraunces-ground text-[var(--fg)]">
                    {copy.transmit.links.copyEmail}
                  </span>
                  <span
                    className={`tm-action__cap font-mono ${state !== 'idle' ? 'is-state' : ''}`}
                    aria-live="polite"
                  >
                    {caption}
                  </span>
                </button>
              )}
            </div>

            {/* Footer row: copyright, compass, build stamp */}
            <div className="tm-foot font-mono uppercase-tracked">
              <p className="tm-foot__l">{copy.transmit.footer.copyright}</p>
              <a href="#index" className="tm-compass" aria-label={LABELS.backToIndex}>
                <svg viewBox="0 0 24 24" width="26" height="26" fill="none" aria-hidden="true">
                  <g className="tm-compass__ticks" stroke="currentColor" strokeWidth="1.1" strokeLinecap="round">
                    <path d="M12 0.5v3M12 20.5v3M0.5 12h3M20.5 12h3" />
                  </g>
                  <circle cx="12" cy="12" r="7.6" stroke="currentColor" strokeWidth="1.3" />
                  <g className="tm-compass__needle">
                    <path d="M12 6.2l2 5.8h-4z" fill="var(--signal)" />
                    <path d="M12 17.8l-2-5.8h4z" fill="currentColor" />
                  </g>
                </svg>
              </a>
              <p className="tm-foot__r">{copy.transmit.footer.buildStamp}</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}