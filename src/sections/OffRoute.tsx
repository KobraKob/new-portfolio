import { useEffect, useRef, useState, type KeyboardEvent } from 'react';
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
            style={{ fontSize: 'var(--step-4)' }}
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
                  <StopDrawing kind={item.icon} erevan={isErevan} />
                </div>
              </div>
            </li>
          ))}

          <li className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 md:gap-x-8" aria-label="End of route">
            <div className="relative h-8" aria-hidden="true">
              <span
                className="absolute block h-[2px] w-4 bg-[var(--signal)]"
                style={{ left: RAIL_X[items.length % 2] - 7, top: 0 }}
              />
            </div>
            <Link
              to="/transmit"
              className="justify-self-start font-mono text-[var(--fg)] border-b-[3px] border-[var(--signal)] pb-1 hover:border-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-4"
              style={{ fontSize: 'var(--step-0)' }}
            >
              Continue to {copy.transmit.title}
            </Link>
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

function StopDrawing({ kind, erevan }: { kind: string; erevan: boolean }) {
  if (kind === 'gamepad') return <BranchTree erevan={erevan} />;
  if (kind === 'github') return <Ledger />;
  return <RouteProfile erevan={erevan} />;
}

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
function RouteProfile({ erevan }: { erevan: boolean }) {
  const line = smooth(PROFILE);
  const peak = PROFILE[7];

  return (
    <svg viewBox="0 0 360 120" className="w-full h-auto" role="img" aria-label={erevan ? 'Coastline with depth contours and a dashed sea route' : 'Elevation profile of a long route'}>
      <defs>
        <pattern id="offroute-hatch" patternUnits="userSpaceOnUse" width="5" height="5" patternTransform="rotate(45)">
          <line x1="0" y1="0" x2="0" y2="5" stroke="var(--fg-muted)" strokeWidth="0.6" opacity="0.5" />
        </pattern>
      </defs>

      {!erevan ? (
        <>
          <path d={`${line} L360,108 L0,108 Z`} fill="url(#offroute-hatch)" />
          <path d={line} fill="none" stroke="var(--fg)" strokeWidth="1.5" strokeLinejoin="round" />
          <line x1="0" y1="108" x2="360" y2="108" stroke="var(--fg-muted)" strokeWidth="1" />
          {Array.from({ length: 13 }, (_, i) => (
            <line key={i} x1={i * 30} y1="108" x2={i * 30} y2={i % 3 === 0 ? 116 : 112} stroke="var(--fg-muted)" strokeWidth="1" />
          ))}
          <circle cx={peak[0]} cy={peak[1]} r="5" fill="var(--signal)" stroke="var(--bg)" strokeWidth="2" />
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
          <path d={`${line} L360,118 L0,118 Z`} fill="url(#offroute-hatch)" />
          <path d={line} fill="none" stroke="var(--fg)" strokeWidth="1.5" strokeLinejoin="round" />
          <path
            d={smooth(PROFILE.map(([x, y]) => [x, y - 30]))}
            fill="none"
            stroke="var(--signal)"
            strokeWidth="1.5"
            strokeDasharray="6 5"
          />
          {[84, 200, 318].map((x) => {
            const y = (PROFILE.find((p) => p[0] === x) ?? [x, 60])[1] - 30;
            return (
              <path key={x} d={`M${x - 5},${y} H${x + 5} M${x},${y - 5} V${y + 5}`} stroke="var(--signal)" strokeWidth="1.5" />
            );
          })}
        </>
      )}
    </svg>
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
function BranchTree({ erevan }: { erevan: boolean }) {
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

  return (
    <div>
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
            </g>
          );
        })}
      </svg>
      <p className="font-mono text-[var(--fg-muted)] mt-2" style={{ fontSize: 'var(--step--1)' }}>
        Choose a branch
      </p>
    </div>
  );
}

const STATUS_MARK: Record<Project['status'], string> = {
  DEPLOYED: 'bg-[var(--counter)] border-[var(--counter)]',
  WORKING: 'bg-[var(--fg)] border-[var(--fg)]',
  'IN BUILD': 'border-dashed border-[var(--fg)]',
  PROTOTYPE: 'border-[var(--fg-muted)]',
};

/* Building in public. The real project list with honest statuses, each row
   linking to its case study. */
function Ledger() {
  return (
    <div>
      <ul className="border-t border-[var(--rule)]">
        {projects.map((project) => (
          <li key={project.slug} className="border-b border-[var(--rule)]">
            <Link
              to={`/work/${project.slug}`}
              className="group/row flex items-baseline justify-between gap-4 py-3 focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-2"
            >
              <span className="font-mono text-[var(--fg)] group-hover/row:underline decoration-[var(--signal)] decoration-2 underline-offset-4" style={{ fontSize: 'var(--step-0)' }}>
                {project.name}
              </span>
              <span className="flex items-center gap-2 font-mono text-[var(--fg-muted)]" style={{ fontSize: 'var(--step--1)' }}>
                <span className={`inline-block h-2 w-2 border ${STATUS_MARK[project.status]}`} aria-hidden="true" />
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
        className="inline-block mt-3 font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-2"
        style={{ fontSize: 'var(--step--1)' }}
      >
        {copy.meta.github.replace('https://', '')}
      </a>
    </div>
  );
}
