import { useEffect, useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { Link } from 'react-router-dom';
import { copy } from '../content/copy';
import { projects, type Project } from '../content/projects';
import { useTheme } from '../app/ThemeProvider';

/*
 * Off-Route: the page is the route.
 * One line runs down the left rail and draws as you scroll. Each stop hangs a
 * different drawing off it. Ground draws roads and contours; Erevan draws a
 * coastline and a quest map from the same data.
 */

const RAIL_X = [8, 28]; // rail alternates between two x positions, joined by a short jog
const JOG = 24; // height in px of the jog between two stops
const clamp = (n: number) => Math.min(1, Math.max(0, n));

export function OffRoute() {
  const { theme } = useTheme();
  const isErevan = theme === 'erevan';
  const items = copy.offroute.items;
  const rows = useRef<(HTMLLIElement | null)[]>([]);

  // Draw the route with scroll. Everything is fully drawn by default, so with
  // reduced motion (or no script) the page simply shows the finished route.
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
  }, []);

  return (
    <section id="offroute" className="section" aria-labelledby="offroute-title">
      <div className="container">
        <header className="mb-16 md:mb-24 max-w-[36ch]">
          <span className="font-mono uppercase-tracked text-[var(--signal-text)] block mb-4">
            {copy.offroute.title}
          </span>
          <h2
            id="offroute-title"
            className={`${isErevan ? 'fraunces-erevan' : 'fraunces-ground'} text-[var(--fg)] leading-[0.95]`}
            style={{ fontSize: 'var(--step-5)' }}
          >
            {copy.offroute.subtitle}
          </h2>
        </header>

        <ol className="relative">
          {items.map((item, index) => (
            <li
              key={item.label}
              ref={(el) => {
                rows.current[index] = el;
              }}
              data-reached="true"
              className="group/stop relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 md:gap-x-8"
            >
              <Rail index={index} />
              <div className="pb-16 md:pb-24 grid gap-8 md:grid-cols-12 md:items-start">
                <div className="md:col-span-5">
                  <span className="font-mono uppercase-tracked text-[var(--fg-muted)] block mb-3">
                    Stop {String(index + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}
                  </span>
                  <h3
                    className={`${isErevan ? 'fraunces-erevan' : 'fraunces-ground'} text-[var(--fg)] mb-3`}
                    style={{ fontSize: 'var(--step-3)', lineHeight: 1.05 }}
                  >
                    {item.label}
                  </h3>
                  <p className="text-[var(--fg-muted)] leading-relaxed max-w-[44ch]" style={{ fontSize: 'var(--step-0)' }}>
                    {item.description}
                  </p>
                </div>
                <div className="md:col-span-7 min-w-0">
                  <StopDrawing kind={item.icon} erevan={isErevan} sheet={`06.${index + 1}`} />
                </div>
              </div>
            </li>
          ))}

          <li className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 md:gap-x-8" aria-label="End of route">
            <div className="relative h-8" aria-hidden="true">
              <span
                className={`absolute block h-3 w-3 bg-[var(--signal)] ${isErevan ? 'rotate-45' : ''}`}
                style={{ left: RAIL_X[items.length % 2] - 6, top: -6 }}
              />
            </div>
            <div className="justify-self-start">
              <span className="font-mono uppercase-tracked text-[var(--fg-muted)] block mb-4">End of route · 06 → 07</span>
              <Link
                to="/transmit"
                className="hard-shadow inline-block border-2 border-[var(--signal)] bg-[var(--bg)] px-6 py-3 font-body font-medium text-[var(--signal-text)] transition-colors hover:bg-[var(--signal)] hover:text-[var(--bg)] focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-4"
                style={{ fontSize: 'var(--step-0)' }}
              >
                Continue to {copy.transmit.title}
              </Link>
            </div>
          </li>
        </ol>
      </div>
    </section>
  );
}

/* ---------------------------------------------------------------- rail */

function Rail({ index }: { index: number }) {
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

/* ------------------------------------------------------------ drawings */

function StopDrawing({ kind, erevan, sheet }: { kind: string; erevan: boolean; sheet: string }) {
  if (kind === 'gamepad') return <BranchTree erevan={erevan} sheet={sheet} />;
  if (kind === 'github') return <Ledger erevan={erevan} sheet={sheet} />;
  return <RouteProfile erevan={erevan} sheet={sheet} />;
}

/* Every drawing hangs on a survey sheet: crop marks, hard offset shadow and a
   title block, the same furniture as the project sheets in Waypoints. */
const CORNERS = [
  '-top-2 -left-2 border-t border-l',
  '-top-2 -right-2 border-t border-r',
  '-bottom-2 -left-2 border-b border-l',
  '-bottom-2 -right-2 border-b border-r',
];

function SheetFrame({
  sheet,
  type,
  erevan,
  readout,
  children,
}: {
  sheet: string;
  type: string;
  erevan: boolean;
  readout?: { label: string; value: string };
  children: ReactNode;
}) {
  return (
    <figure className="relative m-0 border border-[var(--rule)] bg-[var(--bg)] shadow-[4px_4px_0_0_var(--rule)]">
      {CORNERS.map((c) => (
        <span key={c} aria-hidden="true" className={`absolute h-3 w-3 border-[var(--fg-muted)] ${c}`} />
      ))}
      <div className="p-4 md:p-6">{children}</div>
      <figcaption className="grid grid-cols-3 gap-3 border-t border-[var(--rule)] px-4 py-3 md:px-6 font-mono uppercase-tracked">
        <Cell label="Sheet" value={sheet} />
        <Cell label="Type" value={type} />
        <Cell label={readout?.label ?? 'Projection'} value={readout?.value ?? (erevan ? 'Erevan' : 'Ground')} />
      </figcaption>
    </figure>
  );
}

function Cell({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <span className="text-[var(--fg-muted)] block mb-1">{label}</span>
      <span className="text-[var(--fg)]">{value}</span>
    </div>
  );
}

/* Draw-on-reveal, like the rail. Defaults to fully drawn, so reduced motion
   and no-IntersectionObserver browsers just see the finished drawing. */
function useReveal<T extends Element>() {
  const ref = useRef<T>(null);
  const [shown, setShown] = useState(
    () =>
      typeof window === 'undefined' ||
      !('IntersectionObserver' in window) ||
      window.matchMedia('(prefers-reduced-motion: reduce)').matches,
  );
  useEffect(() => {
    const el = ref.current;
    if (shown || !el) return;
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.35 },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [shown]);
  return [ref, shown] as const;
}

const MONO_LABEL = { fontFamily: 'var(--font-mono)', fontSize: 7, letterSpacing: '0.08em' } as const;

// Catmull-Rom spline through the points, as a cubic Bezier path.
function smooth(points: number[][]) {
  let d = `M${points[0][0]},${points[0][1]}`;
  for (let i = 0; i < points.length - 1; i++) {
    const p0 = points[i - 1] ?? points[i];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[i + 2] ?? p2;
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x},${c1y} ${c2x},${c2y} ${p2[0]},${p2[1]}`;
  }
  return d;
}

const PROFILE: number[][] = [
  [0, 92], [28, 84], [52, 88], [84, 64], [112, 70], [142, 44], [170, 52],
  [200, 30], [228, 46], [258, 38], [288, 58], [318, 50], [360, 62],
];

/* Solo bike trips. Ground: an elevation profile with distance ticks (no
   numbers). Erevan: the same line read as a coastline with depth contours and
   a dashed sea route. */
function RouteProfile({ erevan, sheet }: { erevan: boolean; sheet: string }) {
  const line = smooth(PROFILE);
  const peak = PROFILE[7];
  const [ref, shown] = useReveal<SVGSVGElement>();
  const drawn = {
    pathLength: 1,
    strokeDasharray: 1,
    strokeDashoffset: shown ? 0 : 1,
    style: { transition: 'stroke-dashoffset 1100ms var(--ease-settle)' },
  };
  const fade = (delay: number) => ({
    opacity: shown ? 1 : 0,
    transition: `opacity 480ms var(--ease-settle) ${delay}ms`,
  });

  return (
    <SheetFrame sheet={sheet} type={erevan ? 'Coastal chart' : 'Elevation profile'} erevan={erevan}>
      <svg ref={ref} viewBox="-6 -24 372 160" className="w-full h-auto" role="img" aria-label={erevan ? 'Coastline with depth contours and a dashed sea route' : 'Elevation profile of a long route'}>
        <defs>
          <pattern id="offroute-hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
            <line x1="0" y1="0" x2="0" y2="5" stroke="var(--fg-muted)" strokeWidth="0.6" opacity="0.5" />
          </pattern>
        </defs>

        {/* measured grid behind the drawing */}
        <g aria-hidden="true" stroke="var(--rule)" strokeWidth="0.5">
          {[0, 30, 60, 90].map((y) => (
            <line key={y} x1="0" y1={y + 18} x2="360" y2={y + 18} strokeDasharray="2 4" />
          ))}
        </g>

        {!erevan ? (
          <>
            <path d={`${line} L360,108 L0,108 Z`} fill="url(#offroute-hatch)" style={fade(500)} />
            <path d={line} fill="none" stroke="var(--fg)" strokeWidth="1.5" strokeLinejoin="round" {...drawn} />
            <line x1="0" y1="108" x2="360" y2="108" stroke="var(--fg-muted)" strokeWidth="1" />
            {Array.from({ length: 13 }, (_, i) => (
              <line key={i} x1={i * 30} y1="108" x2={i * 30} y2={i % 3 === 0 ? 116 : 112} stroke="var(--fg-muted)" strokeWidth="1" />
            ))}
            <g style={fade(900)}>
              <text x="0" y="130" fill="var(--fg-muted)" style={MONO_LABEL}>START</text>
              <text x="360" y="130" textAnchor="end" fill="var(--fg-muted)" style={MONO_LABEL}>FINISH</text>
              <line x1={peak[0]} y1={peak[1] - 6} x2={peak[0]} y2="-8" stroke="var(--signal)" strokeWidth="1" />
              <text x={peak[0] + 5} y="-5" fill="var(--signal-text)" style={MONO_LABEL}>HIGH POINT</text>
              <circle cx={peak[0]} cy={peak[1]} r="5" fill="var(--signal)" stroke="var(--bg)" strokeWidth="2" />
            </g>
          </>
        ) : (
          <>
            {[22, 14, 7].map((offset, i) => (
              <path
                key={offset}
                d={smooth(PROFILE.map(([x, y]) => [x, y - offset]))}
                fill="none"
                stroke="var(--fg-muted)"
                strokeWidth="1"
                opacity={0.55 - i * 0.12}
              />
            ))}
            <path d={`${line} L360,118 L0,118 Z`} fill="url(#offroute-hatch)" style={fade(500)} />
            <path d={line} fill="none" stroke="var(--fg)" strokeWidth="1.5" strokeLinejoin="round" {...drawn} />
            <path
              d={smooth(PROFILE.map(([x, y]) => [x, y - 30]))}
              fill="none"
              stroke="var(--signal)"
              strokeWidth="1.5"
              strokeDasharray="6 5"
              style={fade(700)}
            />
            <g style={fade(900)}>
              {[84, 200, 318].map((x) => {
                const y = (PROFILE.find((p) => p[0] === x) ?? [x, 60])[1] - 30;
                return (
                  <path key={x} d={`M${x - 5},${y} H${x + 5} M${x},${y - 5} V${y + 5}`} stroke="var(--signal)" strokeWidth="1.5" />
                );
              })}
              <text x="206" y="-8" fill="var(--signal-text)" style={MONO_LABEL}>SEA ROUTE</text>
              <text x="0" y="132" fill="var(--fg-muted)" style={MONO_LABEL}>DEPTH CONTOURS</text>
              {/* north arrow */}
              <path d="M346,8 V-14 M341,-9 L346,-15 L351,-9" fill="none" stroke="var(--fg)" strokeWidth="1" />
              <text x="346" y="-18" textAnchor="middle" fill="var(--fg)" style={MONO_LABEL}>N</text>
            </g>
          </>
        )}
      </svg>
    </SheetFrame>
  );
}

type NodeId = 'r' | 'a' | 'b' | 'a1' | 'a2' | 'b1' | 'b2';

const NODES: Record<NodeId, [number, number]> = {
  r: [32, 60],
  a: [150, 30],
  b: [150, 90],
  a1: [300, 16],
  a2: [300, 44],
  b1: [300, 76],
  b2: [300, 104],
};
const PARENT: Partial<Record<NodeId, NodeId>> = { a: 'r', b: 'r', a1: 'a', a2: 'a', b1: 'b', b2: 'b' };
const LEAVES: NodeId[] = ['a1', 'a2', 'b1', 'b2'];

/* Story-driven RPGs. A branching structure with one chosen path. Pick a leaf
   to change the path. Ground uses road-style elbows, Erevan uses curved
   trails and diamond nodes. */
function BranchTree({ erevan, sheet }: { erevan: boolean; sheet: string }) {
  const [chosen, setChosen] = useState<NodeId>('a2');

  const onPath = new Set<NodeId>();
  for (let n: NodeId | undefined = chosen; n; n = PARENT[n]) onPath.add(n);

  const edges = (Object.keys(PARENT) as NodeId[])
    .map((child) => ({ child, parent: PARENT[child] as NodeId, active: onPath.has(child) }))
    .sort((a, b) => Number(a.active) - Number(b.active));

  const pathFor = (from: NodeId, to: NodeId) => {
    const [x1, y1] = NODES[from];
    const [x2, y2] = NODES[to];
    const mid = (x1 + x2) / 2;
    return erevan ? `M${x1},${y1} C${mid},${y1} ${mid},${y2} ${x2},${y2}` : `M${x1},${y1} H${mid} V${y2} H${x2}`;
  };

  const choose = (id: NodeId) => setChosen(id);
  const onKey = (id: NodeId) => (e: KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      choose(id);
    }
  };

  const pathLabel = [...onPath].reverse().map((id) => id.toUpperCase()).join(' → ');

  return (
    <SheetFrame
      sheet={sheet}
      type={erevan ? 'Quest map' : 'Decision tree'}
      erevan={erevan}
      readout={{ label: 'Path', value: pathLabel }}
    >
      <svg viewBox="0 0 360 120" className="w-full h-auto" role="group" aria-label="Branching story diagram. Choose a branch to highlight its path.">
        {edges.map(({ child, parent, active }) => (
          <path
            key={child}
            d={pathFor(parent, child)}
            fill="none"
            stroke={active ? 'var(--signal)' : 'var(--fg-muted)'}
            strokeWidth={active ? 2 : 1}
            strokeDasharray={erevan && !active ? '4 4' : undefined}
            opacity={active ? 1 : 0.6}
          />
        ))}
        {(Object.keys(NODES) as NodeId[]).map((id) => {
          const [x, y] = NODES[id];
          const active = onPath.has(id);
          const fill = active ? 'var(--signal)' : 'var(--bg)';
          const stroke = active ? 'var(--signal)' : 'var(--fg)';
          const mark = erevan ? (
            <rect x={x - 4.5} y={y - 4.5} width="9" height="9" transform={`rotate(45 ${x} ${y})`} fill={fill} stroke={stroke} strokeWidth="1.5" />
          ) : (
            <circle cx={x} cy={y} r="4.5" fill={fill} stroke={stroke} strokeWidth="1.5" />
          );
          if (!LEAVES.includes(id)) return <g key={id}>{mark}</g>;
          return (
            <g
              key={id}
              role="button"
              tabIndex={0}
              aria-pressed={chosen === id}
              aria-label={`Highlight branch ${LEAVES.indexOf(id) + 1} of ${LEAVES.length}`}
              onClick={() => choose(id)}
              onMouseEnter={() => choose(id)}
              onFocus={() => choose(id)}
              onKeyDown={onKey(id)}
              className="cursor-pointer outline-none focus-visible:[&>circle:first-child]:stroke-[var(--signal)]"
            >
              <circle cx={x} cy={y} r="14" fill="transparent" stroke="transparent" strokeWidth="2" />
              {mark}
              <text x={x + 12} y={y + 2.5} fill={active ? 'var(--signal-text)' : 'var(--fg-muted)'} style={MONO_LABEL}>
                {id.toUpperCase()}
              </text>
            </g>
          );
        })}
        <text x={NODES.r[0]} y={NODES.r[1] + 18} textAnchor="middle" fill="var(--fg-muted)" style={MONO_LABEL}>START</text>
      </svg>
      <p className="font-mono text-[var(--fg-muted)] mt-2" style={{ fontSize: 'var(--step--1)' }}>
        Choose a branch
      </p>
    </SheetFrame>
  );
}

const STATUS_MARK: Record<Project['status'], string> = {
  DEPLOYED: 'bg-[var(--counter)] border-[var(--counter)]',
  WORKING: 'bg-[var(--signal)] border-[var(--signal)]',
  'IN BUILD': 'border-dashed border-[var(--fg)]',
  PROTOTYPE: 'border-[var(--fg-muted)]',
};

/* Building in public. The real project list with honest statuses, set out as
   a sheet index; each row links to its case study. */
function Ledger({ erevan, sheet }: { erevan: boolean; sheet: string }) {
  return (
    <SheetFrame
      sheet={sheet}
      type="Sheet index"
      erevan={erevan}
      readout={{ label: 'Entries', value: String(projects.length).padStart(2, '0') }}
    >
      <ul className="border-t border-[var(--rule)]">
        {projects.map((project, i) => (
          <li key={project.slug} className="border-b border-[var(--rule)]">
            <Link
              to={`/work/${project.slug}`}
              className="group/row flex items-baseline gap-4 py-3 focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-2"
            >
              <span className="font-mono text-[var(--fg-muted)]" style={{ fontSize: 'var(--step--1)' }} aria-hidden="true">
                {String(i + 1).padStart(2, '0')}
              </span>
              <span className="flex-1 font-mono text-[var(--fg)] group-hover/row:underline decoration-[var(--signal)] decoration-2 underline-offset-4" style={{ fontSize: 'var(--step-0)' }}>
                {project.name}
              </span>
              <span className="flex items-center gap-2 font-mono uppercase-tracked text-[var(--fg-muted)]">
                <span className={`inline-block h-2 w-2 rounded-full border ${STATUS_MARK[project.status]}`} aria-hidden="true" />
                {project.status}
              </span>
            </Link>
          </li>
        ))}
      </ul>
      <a
        href={copy.meta.github}
        target="_blank"
        rel="noopener noreferrer"
        className="inline-block mt-4 font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-2"
        style={{ fontSize: 'var(--step--1)' }}
      >
        {copy.meta.github.replace('https://', '')}
      </a>
    </SheetFrame>
  );
}
