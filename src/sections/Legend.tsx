import { useEffect, useRef, useState } from 'react';
import type { CSSProperties } from 'react';
import { getSkillsByCategory, type Skill } from '../content/skills';
import { copy } from '../content/copy';
import './legend.css';

type SkillList = ReturnType<typeof getSkillsByCategory>[string];

// Move into copy.ts if you want all text in one place
const LABELS = {
  mapKey: 'Map Key',
  countKey: 'Projects using the skill',
  trace: 'Trace',
  hint: 'Hover or focus a skill to trace it to the projects that use it.',
};

/* ------------------------------------------------------------------ */
/*  Reveal once when the legend scrolls into view                      */
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
      { threshold: 0.15 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, seen] as const;
}

/* ------------------------------------------------------------------ */
/*  Map symbol: ring with registration ticks                           */
/*  shipped = filled, working = half filled, anything else = open      */
/* ------------------------------------------------------------------ */
function Mark({ status, size = 20 }: { status: string; size?: number }) {
  const s = String(status);
  return (
    <svg className="lg-mark" width={size} height={size} viewBox="0 0 20 20" aria-hidden="true">
      <path
        className="lg-mark__ticks"
        d="M10,0v3M10,17v3M0,10h3M17,10h3"
        stroke="currentColor"
        strokeWidth="1.2"
        fill="none"
      />
      <circle cx="10" cy="10" r="6.2" fill="none" stroke="currentColor" strokeWidth="1.4" />
      {s === 'shipped' && <circle cx="10" cy="10" r="6.2" fill="currentColor" />}
      {s === 'working' && <path d="M10,3.8A6.2,6.2 0 0 0 10,16.2Z" fill="currentColor" />}
    </svg>
  );
}

/* Scale strip: tick marks, same as the other sheets */
function Strip() {
  return (
    <svg className="lg-strip" height="12" aria-hidden="true">
      <line x1="0" y1="6" x2="100%" y2="6" stroke="var(--fg)" strokeOpacity="0.55" strokeWidth="6" strokeDasharray="1 9" />
      <line x1="0" y1="6" x2="100%" y2="6" stroke="var(--fg)" strokeWidth="12" strokeDasharray="1 49" />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export function Legend() {
  const skillsByCategory = getSkillsByCategory();
  const [active, setActive] = useState<Skill | null>(null);
  const [ref, seen] = useSeen<HTMLDivElement>();

  // Running index across categories, used to stagger the symbols
  let running = 0;
  const categories = copy.legend.categories.map((name) => {
    const skills: SkillList = skillsByCategory[name] || [];
    const start = running;
    running += skills.length;
    return { name, skills, start };
  });

  return (
    <section id="legend" className="section relative" aria-labelledby="legend-title">
      <div className="container">
        <header className="mb-16">
          <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
            {copy.legend.title}
          </span>
          <h2
            id="legend-title"
            className="font-display fraunces-ground text-[var(--fg)]"
            style={{ fontSize: 'var(--step-5)' }}
          >
            {copy.legend.subtitle}
          </h2>
        </header>

        <div ref={ref} className={`grid-12 gap-8 ${seen ? 'is-seen' : ''}`}>
          {/* ------------------------- Skills sheet ------------------------ */}
          <div className="col-span-12 lg:col-span-8">
            <div className="lg-sheet">
              <div className="lg-sheet__inner">
                <Strip />
                <div className="lg-sheet__body">
                  {categories.map((cat) => (
                    <div key={cat.name} className="lg-cat">
                      <h3 className="lg-cat__head font-mono uppercase-tracked">
                        <span className="lg-cat__name">{cat.name}</span>
                        <span className="lg-cat__rule" aria-hidden="true" />
                        <span className="lg-cat__n" aria-hidden="true">
                          {cat.skills.length}
                        </span>
                      </h3>

                      <ul className="lg-rows" role="list" aria-label={cat.name}>
                        {cat.skills.map((skill, i) => (
                          <li key={skill.id}>
                            <button
                              type="button"
                              data-skill-id={skill.id}
                              className={`lg-row ${active?.id === skill.id ? 'is-active' : ''}`}
                              style={{ ['--i' as string]: Math.min(cat.start + i, 40) } as CSSProperties}
                              onMouseEnter={() => setActive(skill)}
                              onMouseLeave={() => setActive(null)}
                              onFocus={() => setActive(skill)}
                              onBlur={() => setActive(null)}
                              aria-label={`${skill.name}, ${copy.legend.symbolKey[skill.status]}; used in ${skill.projects.join(', ')}`}
                            >
                              <Mark status={skill.status} />
                              <span className="lg-name font-display fraunces-ground text-[var(--fg)]">
                                {skill.name}
                              </span>
                              <span className="lg-leader" aria-hidden="true" />
                              <span className="lg-count font-mono" aria-hidden="true">
                                {skill.projects.length}
                              </span>
                            </button>
                          </li>
                        ))}
                      </ul>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* --------------------------- Map key --------------------------- */}
          <aside className="col-span-12 lg:col-span-4">
            <div className="lg-key-wrap">
              <div className="lg-sheet">
                <div className="lg-sheet__inner">
                  <Strip />
                  <div className="lg-sheet__body">
                    <h3 className="lg-key__title font-mono uppercase-tracked">{LABELS.mapKey}</h3>

                    <dl className="lg-key">
                      {Object.entries(copy.legend.symbolKey).map(([status, description]) => (
                        <div key={status} className="lg-key__row">
                          <dt>
                            <Mark status={status} size={28} />
                          </dt>
                          <dd className="font-body text-[var(--fg-muted)] text-[var(--step-0)]">{description}</dd>
                        </div>
                      ))}
                      <div className="lg-key__row">
                        <dt className="lg-key__sample font-mono" aria-hidden="true">
                          <span className="lg-key__dots" />3
                        </dt>
                        <dd className="font-body text-[var(--fg-muted)] text-[var(--step-0)]">{LABELS.countKey}</dd>
                      </div>
                    </dl>

                    <div className="lg-trace">
                      <h4 className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step--1)] mb-3">
                        {LABELS.trace}
                      </h4>
                      {active ? (
                        <>
                          <p
                            className="font-display fraunces-ground text-[var(--fg)] mb-1"
                            style={{ fontSize: 'var(--step-2)', lineHeight: 1 }}
                          >
                            {active.name}
                          </p>
                          <p className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)] mb-4">
                            {copy.legend.symbolKey[active.status]}
                          </p>
                          <ul className="lg-tags" role="list">
                            {active.projects.map((p) => (
                              <li key={p} className="font-mono uppercase-tracked">
                                {p.toUpperCase()}
                              </li>
                            ))}
                          </ul>
                        </>
                      ) : (
                        <p className="lg-trace__hint text-[var(--fg-muted)] text-[var(--step-0)]">{LABELS.hint}</p>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </aside>
        </div>
      </div>

      <Connectors skill={active} />
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  Connectors: viewport-fixed lines from the skill to each project    */
/*  Targets are found by [data-project-id="<slug>"] anywhere on page   */
/* ------------------------------------------------------------------ */
function Connectors({ skill }: { skill: Skill | null }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    const svg = svgRef.current;
    if (!svg) return;
    svg.replaceChildren();
    svg.style.opacity = '0';
    if (!skill) return;

    const NS = 'http://www.w3.org/2000/svg';
    const parts = skill.projects.map((slug) => {
      const g = document.createElementNS(NS, 'g');
      const line = document.createElementNS(NS, 'line');
      line.style.stroke = 'var(--signal)';
      line.setAttribute('stroke-width', '1.2');
      line.setAttribute('stroke-dasharray', '2 5');
      line.setAttribute('stroke-linecap', 'round');
      const dot = document.createElementNS(NS, 'circle');
      dot.setAttribute('r', '3.5');
      dot.style.fill = 'var(--signal)';
      g.append(line, dot);
      g.setAttribute('opacity', '0');
      svg.appendChild(g);
      return { slug, g, line, dot };
    });

    let raf = 0;
    const draw = () => {
      raf = 0;
      const from = document.querySelector<HTMLElement>(`[data-skill-id="${CSS.escape(String(skill.id))}"]`);
      if (!from) return;
      const a = from.getBoundingClientRect();
      const sy = a.top + a.height / 2;

      for (const { slug, g, line, dot } of parts) {
        const to = document.querySelector<HTMLElement>(`[data-project-id="${CSS.escape(slug)}"]`);
        if (!to) {
          g.setAttribute('opacity', '0');
          continue;
        }
        const b = to.getBoundingClientRect();
        const tx = b.left + b.width / 2;
        const ty = b.top + b.height / 2;
        const sx = tx > a.left + a.width / 2 ? a.right : a.left;
        line.setAttribute('x1', String(sx));
        line.setAttribute('y1', String(sy));
        line.setAttribute('x2', String(tx));
        line.setAttribute('y2', String(ty));
        dot.setAttribute('cx', String(tx));
        dot.setAttribute('cy', String(ty));
        g.setAttribute('opacity', '0.8');
      }
      svg.style.opacity = '1';
    };
    const schedule = () => {
      if (!raf) raf = requestAnimationFrame(draw);
    };

    draw();
    window.addEventListener('scroll', schedule, { passive: true });
    window.addEventListener('resize', schedule);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', schedule);
      window.removeEventListener('resize', schedule);
      svg.replaceChildren();
      svg.style.opacity = '0';
    };
  }, [skill]);

  return <svg ref={svgRef} className="lg-overlay" aria-hidden="true" />;
}