import { useEffect, useRef, useState } from 'react';
import { getExperience } from '../content/experience';
import { copy } from '../content/copy';
import './fieldnotes.css';

type Experience = ReturnType<typeof getExperience>[0];

// Move into copy.ts if you want all text in one place
const LABELS = {
  subWaypoints: 'Sub-waypoints',
  location: 'Location',
  period: 'Period',
  waypoints: 'Waypoints',
};

/* ------------------------------------------------------------------ */
/*  Reveal once when an item enters the upper part of the viewport     */
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
      { rootMargin: '0px 0px -35% 0px' }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return [ref, seen] as const;
}

/* ------------------------------------------------------------------ */
/*  Section                                                            */
/* ------------------------------------------------------------------ */
export function FieldNotes() {
  const experience = getExperience();

  // Same ordering as before: entries with sub-waypoints first
  const withSub = experience.filter((i) => i.subWaypoints && i.subWaypoints.length > 0);
  const withoutSub = experience.filter((i) => !i.subWaypoints || i.subWaypoints.length === 0);
  const items = [...withSub, ...withoutSub];

  const listRef = useRef<HTMLOListElement>(null);

  // Scroll-linked traverse line: fills as you read down the list
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let raf = 0;

    const update = () => {
      raf = 0;
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      el.style.setProperty('--progress', reduce ? '1' : p.toFixed(4));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(update);
    };

    update();
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll);
    return () => {
      if (raf) cancelAnimationFrame(raf);
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
    };
  }, []);

  return (
    <section id="fieldnotes" className="section relative" aria-labelledby="fieldnotes-title">
      <div className="container relative">
        <header className="mb-16">
          <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
            {copy.fieldnotes.title}
          </span>
          <h2
            id="fieldnotes-title"
            className="font-display fraunces-ground text-[var(--fg)]"
            style={{ fontSize: 'var(--step-5)' }}
          >
            {copy.fieldnotes.subtitle}
          </h2>
        </header>

        <span className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step--1)] block mb-8 fn-route-label">
          {copy.fieldnotes.routeLabel}
        </span>

        <ol ref={listRef} className="fn-list" aria-label="Experience">
          {items.map((item) => (
            <FieldSheet key={item.id} item={item} />
          ))}
        </ol>
      </div>
    </section>
  );
}

/* ------------------------------------------------------------------ */
/*  One survey sheet per entry                                         */
/* ------------------------------------------------------------------ */
function FieldSheet({ item }: { item: Experience }) {
  const [ref, seen] = useSeen<HTMLLIElement>();
  const subs = item.subWaypoints ?? [];
  const hasSubs = subs.length > 0;

  // Title block cells; period only shows here below lg (the rail shows it above)
  const cells: { k: string; v: string; mobileOnly?: boolean }[] = [
    { k: LABELS.period, v: item.period, mobileOnly: true },
  ];
  if (item.location) cells.push({ k: LABELS.location, v: item.location });
  if (hasSubs) cells.push({ k: LABELS.waypoints, v: String(subs.length) });

  const titleId = `fn-${item.id}`;

  return (
    <li ref={ref} className={`fn-item ${seen ? 'is-seen' : ''}`}>
      <time className="fn-item__period font-mono uppercase-tracked">{item.period}</time>

      <div className="fn-item__rail" aria-hidden="true">
        <span className="fn-node" />
      </div>

      <article className="fn-sheet" aria-labelledby={titleId}>
        <div className="fn-sheet__inner">
          {/* Scale strip: tick marks, revealed left to right */}
          <svg className="fn-strip" height="12" aria-hidden="true">
            <line
              x1="0"
              y1="6"
              x2="100%"
              y2="6"
              stroke="var(--fg)"
              strokeOpacity="0.55"
              strokeWidth="6"
              strokeDasharray="1 9"
            />
            <line
              x1="0"
              y1="6"
              x2="100%"
              y2="6"
              stroke="var(--fg)"
              strokeWidth="12"
              strokeDasharray="1 49"
            />
          </svg>

          <header className="fn-sheet__head">
            <h3
              id={titleId}
              className="font-display fraunces-ground text-[var(--fg)]"
              style={{ fontSize: 'var(--step-3)', lineHeight: 1.02 }}
            >
              {item.role}
            </h3>
            {item.organization && (
              <p className="font-body text-[var(--fg-muted)] text-[var(--step-0)] mt-2 mb-0">
                {item.organization}
              </p>
            )}
          </header>

          {/* Title block */}
          <div className="fn-block font-mono">
            {cells.map((c) => (
              <div key={c.k} className={c.mobileOnly ? 'fn-block__cell fn-block__cell--mobile' : 'fn-block__cell'}>
                <span className="fn-block__k">{c.k}</span>
                <span className="fn-block__v">{c.v}</span>
              </div>
            ))}
          </div>

          <div className="fn-body">
            {hasSubs ? (
              <ul className="fn-list-points" role="list">
                {item.description.map((desc, i) => (
                  <li key={i} className="text-[var(--fg)] text-[var(--step-0)] leading-relaxed">
                    <span className="fn-bullet" aria-hidden="true" />
                    <span>{desc}</span>
                  </li>
                ))}
              </ul>
            ) : (
              item.description.map((desc, i) => (
                <p
                  key={i}
                  className="font-body text-[var(--fg)] text-[var(--step-0)] leading-relaxed mb-4 last:mb-0"
                >
                  {desc}
                </p>
              ))
            )}

            {hasSubs && (
              <div className="fn-waypoints">
                <h4 className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step--1)] mb-4">
                  {LABELS.subWaypoints}
                </h4>
                <ul className="fn-wp-grid" role="list">
                  {subs.map((sub) => (
                    <li key={sub.label} className="fn-wp">
                      <svg className="fn-wp__mark" width="14" height="14" viewBox="0 0 14 14" aria-hidden="true">
                        <g fill="none" stroke="currentColor" strokeWidth="1.2">
                          <circle cx="7" cy="7" r="3" />
                          <path d="M7,0v3.5M7,10.5V14M0,7h3.5M10.5,7H14" />
                        </g>
                      </svg>
                      <h5
                        className="font-display fraunces-ground text-[var(--fg)] mb-2 break-words"
                        style={{ fontSize: 'clamp(1.2rem, 1.7vw, 1.65rem)', lineHeight: 1 }}
                      >
                        {sub.label}
                      </h5>
                      <p className="mb-0 text-[var(--fg-muted)] text-[var(--step-0)] leading-relaxed">
                        {sub.description}
                      </p>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </article>
    </li>
  );
}