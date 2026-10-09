import { copy } from '../content/copy';

export function OffRoute() {
  return (
    <section 
      id="offroute" 
      className="section"
      aria-labelledby="offroute-title"
    >
      <div className="container">
        <header className="mb-16 text-center">
          <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
            {copy.offroute.title}
          </span>
          <h2 id="offroute-title" className="font-display fraunces-ground text-[var(--fg)]" style={{ fontSize: 'var(--step-5)' }}>
            {copy.offroute.subtitle}
          </h2>
        </header>

        <div className="grid-12 gap-8 max-w-4xl mx-auto">
          {copy.offroute.items.map((item, index) => (
            <OffRouteItem key={item.label} item={item} index={index} />
          ))}
        </div>
      </div>
    </section>
  );
}

interface OffRouteItemProps {
  item: typeof copy.offroute.items[0];
  index: number;
}

function OffRouteItem({ item, index }: OffRouteItemProps) {
  const icons: Record<string, JSX.Element> = {
    bike: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" aria-hidden="true">
        <circle cx="6" cy="18" r="2" />
        <circle cx="18" cy="17" r="2" />
        <path d="M6 16h12" />
        <path d="M10 16V8a2 2 0 0 1 2-2h4" />
        <path d="M18 17v-5" />
      </svg>
    ),
    gamepad: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" aria-hidden="true">
        <rect x="2" y="3" width="20" height="18" rx="2" />
        <circle cx="8.5" cy="12" r="1.5" />
        <circle cx="15.5" cy="12" r="1.5" />
        <path d="M12 6v4" />
        <path d="M12 14v4" />
      </svg>
    ),
    github: (
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-8 h-8" aria-hidden="true">
        <path d="M12 2C6.5 2 2 6.5 2 12c0 4.5 2.9 8.3 7 9.6.5.1.7-.2.7-.4v-2.9c-2.8.6-3.4-1.3-3.4-1.3-.5-1.2-1.2-1.5-1.2-1.5-1-.6.1-.6.1-.6 1.1.1 1.7 1.1 1.7 1.1 1.7 1 1.7 2.7 1.2 3.4.9.1-.7.4-1.2.7-1.5-2.5-.3-5.1-1.3-5.1-5.7 0-1.3.5-2.3 1.3-3.1-.1-.3-.6-1.5.1-3.1 0 0 1-.3 3.4 1.3a12 12 0 0 1 6 0c2.4-1.6 3.4-1.3 3.4-1.3.7 1.6.2 2.8.1 3.1.8.8 1.3 1.8 1.3 3.1 0 4.4-2.6 5.4-5.1 5.7.4.3.7.9.7 1.8v2.7c0 .3.2.6.7.4C19.1 20.3 22 16.5 22 12c0-5.5-4.5-10-10-10z" />
      </svg>
    )
  };

  return (
    <article 
      className="col-span-12 md:col-span-6 relative group animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="relative bg-[var(--bg)] border border-[var(--rule)] p-6 md:p-8 hard-shadow transition-theme">
        <div className="flex gap-4">
          <div className="shrink-0 w-14 h-14 rounded-full border-2 border-[var(--rule)] flex items-center justify-center text-[var(--signal)] bg-[var(--bg)] group-hover:border-[var(--signal)] group-hover:bg-[var(--signal)]/10 transition-all">
            {icons[item.icon] || icons.bike}
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-display fraunces-ground text-[var(--fg)] text-[var(--step-2)] mb-2">
              {item.label}
            </h3>
            <p className="text-[var(--fg-muted)] leading-relaxed text-[var(--step-0)]">
              {item.description}
            </p>
          </div>
        </div>
      </div>
      
      {index < copy.offroute.items.length - 1 && (
        <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-px h-8 bg-[var(--rule)]" aria-hidden="true">
          <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-2 h-2 rounded-full border-2 border-[var(--bg)] bg-[var(--signal)]" aria-hidden="true" />
        </div>
      )}
    </article>
  );
}
