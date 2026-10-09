import { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { getFeaturedProjects, getCompactProjects, type Project } from '../content/projects';
import { copy } from '../content/copy';
import { useTheme } from '../app/ThemeProvider';
import { Rail, RAIL_X, useRouteDraw } from '../components/RouteRail';

/*
 * Waypoints: the work, hung off the same route rail as Off-Route.
 * Each featured project is a stop. Its drawing is a route diagram built from
 * its real stack: origin, then one station per technology. Status is carried
 * by the line itself (solid = shipped or working, dashed = still being built),
 * so the drawing stays honest. Ground draws road-style elbows, Erevan draws
 * curved trails and diamond stations, from the same data.
 */

const pad = (n: number) => String(n).padStart(2, '0');

const STATUS_MARK: Record<Project['status'], string> = {
  DEPLOYED: 'bg-[var(--counter)] border-[var(--counter)]',
  WORKING: 'bg-[var(--signal)] border-[var(--signal)]',
  'IN BUILD': 'border-dashed border-[var(--fg)]',
  PROTOTYPE: 'border-[var(--fg-muted)]',
};

export function Waypoints() {
  const { theme } = useTheme();
  const isErevan = theme === 'erevan';
  const featured = getFeaturedProjects();
  const compact = getCompactProjects();
  const rows = useRef<(HTMLLIElement | null)[]>([]);
  useRouteDraw(rows);

  const display = isErevan ? 'fraunces-erevan' : 'fraunces-ground';
  const stops = featured.length + (compact.length > 0 ? 1 : 0);

  return (
    <section id="waypoints" className="section" aria-labelledby="waypoints-title">
      <div className="container">
        <header className="mb-16 md:mb-24 max-w-[36ch]">
          <span className="font-mono uppercase-tracked text-[var(--signal-text)] block mb-4">{copy.waypoints.title}</span>
          <h2 id="waypoints-title" className={`${display} text-[var(--fg)] leading-[0.95]`} style={{ fontSize: 'var(--step-4)' }}>
            {copy.waypoints.subtitle}
          </h2>
        </header>

        <ol className="relative">
          {featured.map((project, index) => (
            <li
              key={project.slug}
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
                    Waypoint {pad(index + 1)} / {pad(stops)}
                  </span>
                  <h3
                    className={`${display} text-[var(--fg)] mb-3`}
                    style={
                      {
                        fontSize: 'var(--step-3)',
                        lineHeight: 1.05,
                        viewTransitionName: `project-card-${project.slug}`,
                      } as React.CSSProperties
                    }
                  >
                    {project.name}
                  </h3>
                  <p className="text-[var(--fg-muted)] leading-relaxed max-w-[44ch] mb-5" style={{ fontSize: 'var(--step-0)' }}>
                    {project.description}
                  </p>
                  <StatusLine status={project.status} />
                  <div className="mt-6 flex flex-wrap items-baseline gap-x-6 gap-y-2">
                    <Link
                      to={`/work/${project.slug}`}
                      className="font-mono text-[var(--fg)] border-b-[3px] border-[var(--signal)] pb-1 hover:border-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-4"
                      style={{ fontSize: 'var(--step-0)' }}
                    >
                      View case study
                    </Link>
                    {project.repoUrl && (
                      <a
                        href={project.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-mono text-[var(--fg-muted)] hover:text-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-2"
                        style={{ fontSize: 'var(--step--1)' }}
                      >
                        {project.repoUrl.replace('https://', '')}
                      </a>
                    )}
                  </div>
                </div>
                <div className="md:col-span-7 min-w-0">
                  <StackRoute project={project} erevan={isErevan} />
                </div>
              </div>
            </li>
          ))}

          {compact.length > 0 && (
            <li
              ref={(el) => {
                rows.current[featured.length] = el;
              }}
              data-reached="true"
              className="group/stop relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 md:gap-x-8"
            >
              <Rail index={featured.length} />
              <div className="pb-16 md:pb-24 grid gap-8 md:grid-cols-12 md:items-start">
                <div className="md:col-span-5">
                  <span className="font-mono uppercase-tracked text-[var(--fg-muted)] block mb-3">
                    Waypoint {pad(stops)} / {pad(stops)}
                  </span>
                  <h3 className={`${display} text-[var(--fg)] mb-3`} style={{ fontSize: 'var(--step-3)', lineHeight: 1.05 }}>
                    Additional waypoints
                  </h3>
                  <p className="text-[var(--fg-muted)] leading-relaxed max-w-[44ch]" style={{ fontSize: 'var(--step-0)' }}>
                    Smaller builds along the same route.
                  </p>
                </div>
                <div className="md:col-span-7 min-w-0">
                  <Ledger projects={compact} />
                </div>
              </div>
            </li>
          )}

          <li className="relative grid grid-cols-[2.5rem_minmax(0,1fr)] gap-x-4 md:gap-x-8" aria-label="End of waypoints">
            <div className="relative h-8" aria-hidden="true">
              <span
                className="absolute block h-[2px] w-4 bg-[var(--signal)]"
                style={{ left: RAIL_X[stops % 2] - 7, top: 0 }}
              />
            </div>
            <Link
              to="/fieldnotes"
              className="justify-self-start font-mono text-[var(--fg)] border-b-[3px] border-[var(--signal)] pb-1 hover:border-[var(--fg)] transition-colors focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-4"
              style={{ fontSize: 'var(--step-0)' }}
            >
              Continue to {copy.fieldnotes.title}
            </Link>
          </li>
        </ol>
      </div>
    </section>
  );
}

function StatusLine({ status }: { status: Project['status'] }) {
  return (
    <span className="inline-flex items-center gap-2 font-mono uppercase-tracked text-[var(--fg-muted)]">
      <span className={`inline-block h-2 w-2 rounded-full border ${STATUS_MARK[status]}`} aria-hidden="true" />
      {copy.waypoints.titleBlockLabels.status} · {status}
    </span>
  );
}

/* ----------------------------------------------------------- stack route */

const W = 360;
const H = 120;
const Y_LOW = 84;
const Y_HIGH = 40;

/* The stack as a route. Origin on the left, one station per technology.
   Stations alternate high and low so neighbouring labels never collide. */
function StackRoute({ project, erevan }: { project: Project; erevan: boolean }) {
  const { stack, status } = project;
  const n = stack.length;
  const solid = status === 'DEPLOYED' || status === 'WORKING';
  const [ref, shown] = useReveal<SVGSVGElement>();

  const points = Array.from({ length: n + 1 }, (_, i) => ({
    x: 18 + (i * (W - 56)) / n,
    y: i % 2 === 0 ? Y_LOW : Y_HIGH,
  }));

  const edge = (a: { x: number; y: number }, b: { x: number; y: number }) => {
    const mid = (a.x + b.x) / 2;
    return erevan
      ? `M${a.x},${a.y} C${mid},${a.y} ${mid},${b.y} ${b.x},${b.y}`
      : `M${a.x},${a.y} H${mid} V${b.y} H${b.x}`;
  };

  return (
    <svg
      ref={ref}
      viewBox={`0 0 ${W} ${H}`}
      className="w-full h-auto"
      role="img"
      aria-label={`${project.name} stack route: ${stack.join(', ')}. Status: ${status}.`}
    >
      {points.slice(1).map((p, i) => {
        const delay = i * 180;
        return (
          <path
            key={`e${i}`}
            d={edge(points[i], p)}
            fill="none"
            stroke="var(--signal)"
            strokeWidth="2"
            strokeLinejoin="round"
            {...(solid
              ? {
                  pathLength: 1,
                  strokeDasharray: 1,
                  strokeDashoffset: shown ? 0 : 1,
                  style: { transition: `stroke-dashoffset 600ms var(--ease-settle) ${delay}ms` },
                }
              : {
                  strokeDasharray: '6 5',
                  style: { opacity: shown ? 1 : 0, transition: `opacity 480ms var(--ease-settle) ${delay}ms` },
                })}
          />
        );
      })}

      {/* origin */}
      <rect x={points[0].x - 4} y={points[0].y - 4} width="8" height="8" fill="var(--fg)" />

      {points.slice(1).map((p, i) => {
        const last = i === n - 1;
        const above = p.y === Y_HIGH;
        const fill = solid ? (last ? 'var(--signal)' : 'var(--bg)') : 'var(--bg)';
        const mark = erevan ? (
          <rect x={p.x - 4.5} y={p.y - 4.5} width="9" height="9" transform={`rotate(45 ${p.x} ${p.y})`} fill={fill} stroke="var(--signal)" strokeWidth="1.5" />
        ) : (
          <circle cx={p.x} cy={p.y} r="4.5" fill={fill} stroke="var(--signal)" strokeWidth="1.5" />
        );
        return (
          <g key={stack[i]} style={{ opacity: shown ? 1 : 0, transition: `opacity 360ms var(--ease-settle) ${i * 180 + 300}ms` }}>
            {mark}
            <text
              x={p.x}
              y={above ? p.y - 12 : p.y + 17}
              textAnchor={last && p.x > W - 80 ? 'end' : 'middle'}
              fill="var(--fg)"
              style={{ fontFamily: 'var(--font-mono)', fontSize: 8, letterSpacing: '0.04em' }}
            >
              {stack[i]}
            </text>
          </g>
        );
      })}
    </svg>
  );
}

/* Draw-on-reveal. Defaults to fully drawn when motion is reduced or
   IntersectionObserver is missing. */
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

/* ---------------------------------------------------------------- ledger */

function Ledger({ projects }: { projects: Project[] }) {
  return (
    <ul className="border-t border-[var(--rule)]">
      {projects.map((project) => {
        const body = (
          <>
            <span className="flex-1 min-w-0">
              <span
                className={`block font-mono text-[var(--fg)] ${project.repoUrl ? 'group-hover/row:underline decoration-[var(--signal)] decoration-2 underline-offset-4' : ''}`}
                style={{ fontSize: 'var(--step-0)' }}
              >
                {project.name}
              </span>
              <span className="block text-[var(--fg-muted)] mt-1" style={{ fontSize: 'var(--step--1)' }}>
                {project.description} · {project.stack.join(' / ')}
              </span>
            </span>
            <span className="flex items-center gap-2 font-mono uppercase-tracked text-[var(--fg-muted)] shrink-0">
              <span className={`inline-block h-2 w-2 rounded-full border ${STATUS_MARK[project.status]}`} aria-hidden="true" />
              {project.status}
            </span>
          </>
        );
        const row = 'group/row flex items-baseline justify-between gap-4 py-3';
        return (
          <li key={project.slug} className="border-b border-[var(--rule)]">
            {project.repoUrl ? (
              <a
                href={project.repoUrl}
                target="_blank"
                rel="noopener noreferrer"
                className={`${row} focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-2`}
              >
                {body}
              </a>
            ) : (
              <div className={row}>{body}</div>
            )}
          </li>
        );
      })}
    </ul>
  );
}