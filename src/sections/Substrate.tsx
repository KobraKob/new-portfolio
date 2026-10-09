import { useEffect, useRef, useState } from 'react';
import type { CSSProperties, PointerEvent } from 'react';
import { copy } from '../content/copy';
import './substrate.css';

/* ------------------------------------------------------------------ */
/*  Sheet geometry                                                     */
/* ------------------------------------------------------------------ */
const S = 560; // viewBox size
const M = 32; // neatline inset
const W = S - M * 2; // mapped area
const C = S / 2; // centre
const DIV = 8; // graticule divisions
const STEP = W / DIV;
const SPAN = 0.16; // degrees covered by the sheet

// Bengaluru, the anchor for every coordinate on the page
const ORIGIN = { lat: 12.9716, lon: 77.5946 };

// Move these into copy.ts if you want all text in one place
const SHEET_META = {
  datum: 'WGS 84',
  origin: 'Bengaluru',
  cursorLabel: 'Cursor',
};

const toLon = (x: number) => ORIGIN.lon + ((x - C) / W) * SPAN;
const toLat = (y: number) => ORIGIN.lat - ((y - C) / W) * SPAN;
const fmtLat = (y: number, d = 4) => `${toLat(y).toFixed(d)}°N`;
const fmtLon = (x: number, d = 4) => `${toLon(x).toFixed(d)}°E`;

/* ------------------------------------------------------------------ */
/*  Procedural contour lines (deterministic, no randomness)            */
/* ------------------------------------------------------------------ */
const RINGS = 12;
const SAMPLES = 90;
const INDEX_LABELS: Record<number, string> = { 3: '940', 7: '920', 11: '900' };

function ringPoints(i: number): [number, number][] {
  const pts: [number, number][] = [];
  const base = 26 + i * 22;
  for (let k = 0; k < SAMPLES; k++) {
    const t = (k / SAMPLES) * Math.PI * 2;
    const m =
      1 +
      0.09 * Math.sin(3 * t + i * 0.35 + 0.6) +
      0.055 * Math.sin(5 * t - i * 0.2 + 1.9) +
      0.03 * Math.sin(9 * t + i * 0.5);
    const x = C + Math.sin(i * 1.3) * 5 + Math.cos(t) * base * m * 1.12;
    const y = C + Math.cos(i * 0.9) * 5 + Math.sin(t) * base * m * 0.92;
    pts.push([Math.round(x * 10) / 10, Math.round(y * 10) / 10]);
  }
  return pts;
}

const CONTOURS = Array.from({ length: RINGS }, (_, i) => {
  const pts = ringPoints(i);
  const d = `M${pts.map((p) => p.join(',')).join('L')}Z`;
  const isIndex = i in INDEX_LABELS;
  const labelAt = pts[Math.round(SAMPLES * 0.9)];
  return { i, d, isIndex, label: INDEX_LABELS[i], labelAt };
});

// Edge ticks (neatline scale marks)
const TICKS = (() => {
  const parts: string[] = [];
  const n = DIV * 5;
  for (let k = 0; k <= n; k++) {
    const p = M + (W / n) * k;
    const len = k % 5 === 0 ? 9 : 4;
    parts.push(`M${p},${M}v${-len}`);
    parts.push(`M${p},${M + W}v${len}`);
    parts.push(`M${M},${p}h${-len}`);
    parts.push(`M${M + W},${p}h${len}`);
  }
  return parts.join('');
})();

const GRATICULE = Array.from({ length: DIV + 1 }, (_, k) => M + k * STEP);

const delay = (s: number): CSSProperties => ({ ['--delay' as string]: `${s}s` });

/* ------------------------------------------------------------------ */
/*  Component                                                          */
/* ------------------------------------------------------------------ */
export function Substrate() {
  const sheetRef = useRef<HTMLElement>(null);
  const vRef = useRef<SVGLineElement>(null);
  const hRef = useRef<SVGLineElement>(null);
  const readoutRef = useRef<HTMLSpanElement>(null);
  const [drawn, setDrawn] = useState(false);

  // Draw the sheet once, when it scrolls into view
  useEffect(() => {
    const el = sheetRef.current;
    if (!el) return;
    if (typeof IntersectionObserver === 'undefined') {
      setDrawn(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setDrawn(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const readout = (x: number, y: number) => {
    if (readoutRef.current) {
      readoutRef.current.textContent = `${fmtLat(y)} ${fmtLon(x)}`;
    }
  };

  const onMove = (e: PointerEvent<SVGSVGElement>) => {
    const r = e.currentTarget.getBoundingClientRect();
    const x = Math.min(M + W, Math.max(M, ((e.clientX - r.left) / r.width) * S));
    const y = Math.min(M + W, Math.max(M, ((e.clientY - r.top) / r.height) * S));
    vRef.current?.setAttribute('x1', String(x));
    vRef.current?.setAttribute('x2', String(x));
    hRef.current?.setAttribute('y1', String(y));
    hRef.current?.setAttribute('y2', String(y));
    readout(x, y);
  };

  const onLeave = () => readout(C, C);

  return (
    <section id="substrate" className="section" aria-labelledby="substrate-title">
      <div className="container">
        <div className="grid-12">
          {/* ---------------------------- Text ---------------------------- */}
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <header className="mb-12">
              <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
                {copy.substrate.title}
              </span>
              <h2
                id="substrate-title"
                className="font-display fraunces-ground text-[var(--fg)]"
                style={{ fontSize: 'var(--step-5)' }}
              >
                {copy.substrate.subtitle}
              </h2>
            </header>

            <div className="prose max-w-none">
              {copy.substrate.body.map((paragraph, index) => (
                <p
                  key={index}
                  className={`text-[var(--fg)] leading-relaxed mb-6 animate-fade-in stagger-${index + 1} ${
                    index === 0 ? 'substrate-lede font-display fraunces-ground' : ''
                  }`}
                >
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="substrate-marginalia mt-12 pt-8">
              <span className="substrate-marginalia__tick" aria-hidden="true" />
              <p className="font-display fraunces-erevan text-[var(--fg-muted)] text-[var(--step-1)] italic">
                &ldquo;{copy.substrate.marginalia}&rdquo;
              </p>
            </div>
          </div>

          {/* ---------------------------- Sheet --------------------------- */}
          <div
            className="col-span-12 md:col-span-7 lg:col-span-8 md:self-start md:sticky md:top-24 mt-16 md:mt-0"
            aria-hidden="true"
          >
            <figure
              ref={sheetRef}
              className={`sheet md:ml-auto ${drawn ? 'is-drawn' : ''}`}
            >
              <svg
                viewBox={`0 0 ${S} ${S}`}
                className="sheet__svg"
                onPointerMove={onMove}
                onPointerLeave={onLeave}
              >
                <defs>
                  <clipPath id="substrate-map">
                    <rect x={M} y={M} width={W} height={W} />
                  </clipPath>
                </defs>

                {/* Neatline: double rule, as on a printed survey sheet */}
                <g fill="none" stroke="var(--fg)">
                  <rect
                    x={M}
                    y={M}
                    width={W}
                    height={W}
                    strokeWidth="1.4"
                    pathLength={1}
                    className="draw"
                    style={delay(0)}
                  />
                  <rect
                    x={M - 6}
                    y={M - 6}
                    width={W + 12}
                    height={W + 12}
                    strokeWidth="0.5"
                    opacity="0.55"
                    pathLength={1}
                    className="draw"
                    style={delay(0.15)}
                  />
                </g>

                {/* Edge ticks */}
                <path
                  d={TICKS}
                  stroke="var(--fg)"
                  strokeWidth="0.6"
                  fill="none"
                  className="fade"
                  style={delay(0.5)}
                />

                {/* Graticule */}
                <g stroke="var(--rule)" strokeWidth="0.6" fill="none">
                  {GRATICULE.slice(1, -1).map((p, k) => (
                    <g key={p}>
                      <line
                        x1={p}
                        y1={M}
                        x2={p}
                        y2={M + W}
                        pathLength={1}
                        className="draw"
                        style={delay(0.2 + k * 0.05)}
                      />
                      <line
                        x1={M}
                        y1={p}
                        x2={M + W}
                        y2={p}
                        pathLength={1}
                        className="draw"
                        style={delay(0.25 + k * 0.05)}
                      />
                    </g>
                  ))}
                </g>

                {/* Edge labels */}
                <g
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="8.5"
                  fill="var(--fg-muted)"
                  className="fade"
                  style={delay(0.9)}
                >
                  {GRATICULE.filter((_, k) => k % 2 === 0).map((p) => (
                    <g key={p}>
                      <text x={p} y={M - 14} textAnchor="middle">
                        {toLon(p).toFixed(2)}
                      </text>
                      <text x={M - 14} y={p} textAnchor="middle" transform={`rotate(-90 ${M - 14} ${p})`}>
                        {toLat(p).toFixed(2)}
                      </text>
                    </g>
                  ))}
                </g>

                {/* Contours */}
                <g clipPath="url(#substrate-map)" fill="none" stroke="var(--fg)">
                  {CONTOURS.map((c) => (
                    <path
                      key={c.i}
                      d={c.d}
                      pathLength={1}
                      className="draw"
                      strokeWidth={c.isIndex ? 1.5 : 0.7}
                      opacity={c.isIndex ? 0.85 : 0.4}
                      style={{ ...delay(0.6 + c.i * 0.13), ['--dur' as string]: '1.6s' }}
                    />
                  ))}
                </g>

                {/* Elevation labels on index contours */}
                <g
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="8.5"
                  fill="var(--fg-muted)"
                  textAnchor="middle"
                  dominantBaseline="middle"
                  className="fade sheet__elev"
                  style={delay(2.6)}
                >
                  {CONTOURS.filter((c) => c.isIndex).map((c) => (
                    <text key={c.i} x={c.labelAt[0]} y={c.labelAt[1]}>
                      {c.label}
                    </text>
                  ))}
                </g>

                {/* Survey radius, carried over from the original ring */}
                <circle
                  cx={C}
                  cy={C}
                  r={150}
                  fill="none"
                  stroke="var(--fg)"
                  strokeWidth="1.1"
                  strokeDasharray="1 0"
                  pathLength={1}
                  className="draw"
                  style={{ ...delay(1.9), ['--dur' as string]: '1.8s' }}
                />

                {/* Signal: the lens, drawn last */}
                <g transform={`translate(${C} ${C}) scale(1.15)`} fill="none" stroke="var(--signal)">
                  <path
                    d="M-60,-20 Q0,-60 60,-20 Q80,0 60,20 Q0,60 -60,20 Q-80,0 -60,-20 Z"
                    strokeWidth="2.2"
                    pathLength={1}
                    className="draw"
                    style={{ ...delay(2.4), ['--dur' as string]: '1.4s' }}
                  />
                  <circle r="11" strokeWidth="1.6" pathLength={1} className="draw" style={delay(3.2)} />
                  <circle r="2.6" fill="var(--signal)" stroke="none" className="fade" style={delay(3.6)} />
                </g>

                {/* Origin crosshair ticks */}
                <g stroke="var(--fg)" strokeWidth="0.8" className="fade" style={delay(3.4)}>
                  <path d={`M${C - 34},${C}h14M${C + 20},${C}h14M${C},${C - 34}v14M${C},${C + 20}v14`} />
                </g>

                {/* Origin label */}
                <g
                  fontFamily="JetBrains Mono, monospace"
                  fontSize="9.5"
                  fill="var(--fg-muted)"
                  className="fade sheet__elev"
                  style={delay(3.6)}
                >
                  <text x={C + 18} y={C + 86}>
                    {fmtLat(C)}
                  </text>
                  <text x={C + 18} y={C + 99}>
                    {fmtLon(C)}
                  </text>
                </g>

                {/* Live cursor lines: revealed on hover */}
                <g className="sheet__live" clipPath="url(#substrate-map)">
                  <line ref={vRef} x1={C} y1={M} x2={C} y2={M + W} stroke="var(--signal)" strokeWidth="0.7" />
                  <line ref={hRef} x1={M} y1={C} x2={M + W} y2={C} stroke="var(--signal)" strokeWidth="0.7" />
                </g>
              </svg>

              {/* Title block */}
              <figcaption className="sheet__block font-mono">
                <div>
                  <span className="sheet__k">Datum</span>
                  <span className="sheet__v">{SHEET_META.datum}</span>
                </div>
                <div>
                  <span className="sheet__k">Origin</span>
                  <span className="sheet__v">{SHEET_META.origin}</span>
                </div>
                <div>
                  <span className="sheet__k">{SHEET_META.cursorLabel}</span>
                  <span className="sheet__v" ref={readoutRef}>
                    {fmtLat(C)} {fmtLon(C)}
                  </span>
                </div>
              </figcaption>
            </figure>
          </div>
        </div>
      </div>
    </section>
  );
}
