import { copy } from '../content/copy';
import { cn } from '../lib/utils';
import { useTheme } from '../app/ThemeProvider';

export function Erevan() {
  return (
    <section 
      id="erevan" 
      className="section relative"
      aria-labelledby="erevan-title"
    >
      <div className="container">
        <header className="mb-16 text-center">
          <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
            {copy.erevan.title}
          </span>
          <h2 id="erevan-title" className="font-display fraunces-ground text-[var(--fg)]" style={{ fontSize: 'var(--step-5)' }}>
            {copy.erevan.subtitle}
          </h2>
        </header>

        <div className="grid-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <BookSpread novel={copy.erevan.novel} />
          </div>

          <div className="col-span-12 lg:col-span-4">
            <NovelMeta novel={copy.erevan.novel} />
            <VisualBiblePlaceholder />
          </div>
        </div>
      </div>
    </section>
  );
}

interface BookSpreadProps {
  novel: typeof copy.erevan.novel;
}

function BookSpread({ novel }: BookSpreadProps) {
  const { theme } = useTheme();
  const isGround = theme === 'ground';

  // Split excerpt in half so both columns have real content
  const midpoint = Math.floor(novel.excerpt.length / 2);
  const firstHalf = novel.excerpt.slice(0, midpoint);
  const secondHalf = novel.excerpt.slice(midpoint);
  
  return (
    <article 
      className={cn(
        'relative bg-[var(--bg)] border border-[var(--rule)] overflow-hidden',
        isGround ? '' : 'bg-opacity-90'
      )}
      style={{ aspectRatio: '1.414 / 1' }}
      role="region"
      aria-label="Novel excerpt spread"
    >
      <div className="absolute inset-0 bg-[var(--bg)]/50 pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 800 566" preserveAspectRatio="none">
          <defs>
            <pattern id="paper-grain" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M0,0 L4,4 M4,0 L0,4" stroke="var(--rule)" strokeWidth="0.2" fill="none" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="800" height="566" fill="url(#paper-grain)" />
          
          <line x1="400" y1="40" x2="400" y2="526" stroke="var(--rule)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
          
          <g fontFamily="JetBrains Mono" fontSize="9" fill="var(--fg-muted)" textAnchor="middle">
            <text x="200" y="30" className="uppercase-tracked">THE BOUND AND THE HOLLOW</text>
            <text x="600" y="30" className="uppercase-tracked">EREVAN</text>
            <text x="200" y="546" className="uppercase-tracked">P. 1</text>
            <text x="600" y="546" className="uppercase-tracked">P. 2</text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 h-full grid grid-cols-2">
        {/* Left page */}
        <div className="col-span-1 p-6 md:p-10 flex flex-col justify-between overflow-hidden">
          <div>
            <span className="font-display fraunces-erevan text-[var(--step-1)] italic text-[var(--fg-muted)] block mb-4">
              Chapter One
            </span>
          </div>
          
          <div className="flex-1 overflow-hidden" style={{ fontSize: 'var(--step-0)', lineHeight: '1.7' }}>
            <p className="text-[var(--fg)] font-body line-clamp-[10]">
              {firstHalf}
            </p>
          </div>

          <div className="flex items-end justify-between pt-6 border-t border-[var(--rule)] mt-4">
            <span className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)]">
              {novel.status}
            </span>
            <span className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)]">
              Roen Dourne
            </span>
          </div>
        </div>

        {/* Right page */}
        <div className="col-span-1 p-6 md:p-10 flex flex-col justify-between border-l border-[var(--rule)] overflow-hidden">
          <div>
            <span className="font-display fraunces-erevan text-[var(--step-1)] italic text-[var(--fg-muted)] block mb-4">
              Chapter Two
            </span>
          </div>

          <div className="flex-1 overflow-hidden" style={{ fontSize: 'var(--step-0)', lineHeight: '1.7' }}>
            <p className="text-[var(--fg)] font-body line-clamp-[10]">
              {secondHalf}
            </p>
          </div>

          <div className="flex items-end justify-between pt-6 border-t border-[var(--rule)] mt-4">
            <span className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)]">
              Visual Bible →
            </span>
            <span className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)]">
              P. 3
            </span>
          </div>
        </div>
      </div>
    </article>
  );
}

interface NovelMetaProps {
  novel: typeof copy.erevan.novel;
}

function NovelMeta({ novel }: NovelMetaProps) {
  return (
    <div className="sticky top-24 bg-[var(--bg)] border border-[var(--rule)] p-6 hard-shadow">
      <h3 className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step-0)] mb-6 pb-3 border-b border-[var(--rule)]">
        Manuscript
      </h3>
      <dl className="space-y-4 text-[var(--step-0)]">
        <div>
          <dt className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)] mb-1">Title</dt>
          <dd className="font-display fraunces-ground text-[var(--fg)]">{novel.title}</dd>
        </div>
        <div>
          <dt className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)] mb-1">World</dt>
          <dd className="font-body text-[var(--fg)]">{novel.world}</dd>
        </div>
        <div>
          <dt className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)] mb-1">Protagonist</dt>
          <dd className="font-body text-[var(--fg)]">{novel.protagonist}</dd>
        </div>
        <div>
          <dt className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)] mb-1">Status</dt>
          <dd className="font-body text-[var(--counter)] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--counter)] animate-pulse" aria-hidden="true" />
            {novel.status}
          </dd>
        </div>
        <div>
          <dt className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)] mb-1">Premise</dt>
          <dd className="font-body text-[var(--fg-muted)] italic">{novel.premise}</dd>
        </div>
      </dl>
    </div>
  );
}

function VisualBiblePlaceholder() {
  return (
    <div className="mt-8 bg-[var(--bg)] border border-[var(--rule)] p-6 hard-shadow">
      <h3 className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step-0)] mb-6 pb-3 border-b border-[var(--rule)]">
        {copy.erevan.visualBible.label}
      </h3>
      <div className="grid grid-cols-2 gap-4" role="list" aria-label="Visual Bible frames">
        {[1, 2, 3, 4].map((i) => (
          <div 
            key={i} 
            className="aspect-square bg-[var(--rule)] relative overflow-hidden"
            role="listitem"
            aria-label={`Visual Bible frame ${i}`}
          >
            <svg className="w-full h-full text-[var(--fg-muted)]" viewBox="0 0 100 100" preserveAspectRatio="none">
              <rect width="100" height="100" fill="none" stroke="currentColor" strokeWidth="1" vectorEffect="non-scaling-stroke" />
              <path d="M20,50 Q30,30 50,50 Q70,70 80,50" fill="none" stroke="currentColor" strokeWidth="1.5" vectorEffect="non-scaling-stroke" opacity="0.5" />
              <text x="50" y="55" fontFamily="JetBrains Mono" fontSize="8" textAnchor="middle" dominantBaseline="middle" fill="currentColor">
                Frame {i}
              </text>
            </svg>
            <span className="absolute bottom-2 left-2 font-mono uppercase-tracked text-[var(--step--1)] bg-[var(--bg)]/90 px-1 py-0.5">
              Study
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 font-body text-[var(--fg-muted)] text-[var(--step--1)] italic text-center">
        {copy.erevan.visualBible.placeholder}
      </p>
    </div>
  );
}
