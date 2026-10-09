import { getExperience } from '../content/experience';
import { copy } from '../content/copy';
import { cn } from '../lib/utils';

export function FieldNotes() {
  const experience = getExperience();

  // Separate experiences with and without subWaypoints
  const experiencesWithSubWaypoints = experience.filter(item => 
    item.subWaypoints && item.subWaypoints.length > 0
  );
  
  const experiencesWithoutSubWaypoints = experience.filter(item => 
    !item.subWaypoints || item.subWaypoints.length === 0
  );

  return (
    <section 
      id="fieldnotes" 
      className="section relative"
      aria-labelledby="fieldnotes-title"
    >
      <div className="container relative">
        <header className="mb-16">
          <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
            {copy.fieldnotes.title}
          </span>
          <h2 id="fieldnotes-title" className="font-display fraunces-ground text-[var(--fg)]" style={{ fontSize: 'var(--step-5)' }}>
            {copy.fieldnotes.subtitle}
          </h2>
        </header>

        <div className="grid-12">
          {/* Timeline visualization for experiences with subWaypoints (like TCS) */}
          {!experiencesWithSubWaypoints.length ? null : (
            <aside className="relative z-10 col-span-2 hidden xl:block">
              <div className="sticky top-24">
                <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
                  {copy.fieldnotes.routeLabel}
                </span>
                <div className="relative">
                  <svg className="w-1 h-full absolute left-1/2 -translate-x-1/2" viewBox="0 0 2 400" preserveAspectRatio="none" aria-hidden="true">
                    <line x1="1" y1="0" x2="1" y2="400" stroke="var(--rule)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
                    <line x1="1" y1="0" x2="1" y2="400" stroke="var(--signal)" strokeWidth="2" vectorEffect="non-scaling-stroke" className="route-progress" style={{ strokeDasharray: '400', strokeDashoffset: '400' }} />
                  </svg>
                  
                  <ul className="relative space-y-16 md:space-y-24" role="list" aria-label="Experience timeline">
                    {experiencesWithSubWaypoints.map((item, index) => (
                      <ExperienceTimelineItem key={item.id} item={item} index={index} total={experiencesWithSubWaypoints.length} />
                    ))}
                  </ul>
                </div>
              </div>
            </aside>
          )}
          
          {/* Main content area — always full 12 cols (aside only shows on xl) */}
          <div className="col-span-12 relative">
            {/* Render experiences with subWaypoints as cards */}
            {experiencesWithSubWaypoints.map((item, index) => (
              <ExperienceCard key={item.id} item={item} index={index} totalExperiences={experience.length} />
            ))}
            
            {/* Render experiences without subWaypoints using the two-column layout */}
            {experiencesWithoutSubWaypoints.map((item, index) => (
              <EducationExperienceCard key={item.id} item={item} index={index} totalExperiences={experience.length} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

// Timeline item for experiences with subWaypoints (like TCS)
function ExperienceTimelineItem({ item, index, total }: { 
  item: ReturnType<typeof getExperience>[0]; 
  index: number; 
  total: number;
}) {
  return (
    <li key={item.id} className="relative">
      <div 
        className={cn(
          'absolute left-1/2 -translate-x-1/2 w-4 h-4 rounded-full border-3 border-[var(--bg)] z-10 transition-all duration-480',
          'bg-[var(--fg-muted)]',
          index === 0 && 'bg-[var(--signal)]',
          index === total - 1 && 'bg-[var(--signal)]',
          'group-hover:bg-[var(--signal)] group-hover:border-[var(--signal)] group-hover:scale-150'
        )}
        aria-hidden="true"
      />
      <div className="ml-12 md:ml-0 md:text-right md:pr-8 md:w-full lg:w-auto">
        <time className="font-mono uppercase-tracked text-[var(--step--1)] text-[var(--fg-muted)] block mb-1">
          {item.period}
        </time>
        <h3 className="font-display fraunces-ground text-[var(--fg)] text-[var(--step-1)] mb-1">
          {item.role}
        </h3>
        <p className="font-body text-[var(--fg-muted)] text-[var(--step-0)]">
          {item.organization}
        </p>
        <p className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)] mt-1">
          {item.location}
        </p>
      </div>
    </li>
  );
}

// Standard experience card (for experiences with subWaypoints like TCS)
function ExperienceCard({ item, index, totalExperiences }: { 
  item: ReturnType<typeof getExperience>[0]; 
  index: number; 
  totalExperiences: number;
}) {
  return (
    <article 
      className="relative mb-16 md:mb-20 last:mb-0 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      <div className="absolute left-0 top-4 -translate-x-1/2 w-3 h-3 rounded-full bg-[var(--signal)] border-3 border-[var(--bg)]" aria-hidden="true" />
      
      <div className="bg-[var(--bg)] border border-[var(--rule)] p-6 md:p-8 hard-shadow relative transition-theme">
        <header className="mb-6">
          <div className="flex flex-wrap items-baseline gap-3 mb-3">
            <h3 className="font-display fraunces-ground text-[var(--fg)] text-[var(--step-2)]">
              {item.role}
            </h3>
            <span className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)] px-2 py-1 bg-[var(--rule)]">
              {item.period}
            </span>
          </div>
          <p className="font-body text-[var(--fg-muted)] text-[var(--step-0)]">
            {item.organization}
          </p>
          <p className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)] mt-1">
            {item.location}
          </p>
        </header>

        <div className="prose max-w-none">
          <ul className="space-y-3" role="list">
            {item.description.map((desc, i) => (
              <li key={i} className="flex gap-3 text-[var(--fg)] text-[var(--step-0)] leading-relaxed">
                <span className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step--1)] shrink-0 mt-1" aria-hidden="true">
                  ▸
                </span>
                <span>{desc}</span>
              </li>
            ))}
          </ul>

          {item.subWaypoints && item.subWaypoints.length > 0 && (
            <div className="mt-6 pt-6 border-t border-[var(--rule)]">
              <h4 className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step--1)] mb-4">
                Sub-waypoints
              </h4>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 2xl:grid-cols-4">
                {item.subWaypoints.map((sub) => (
                  <div key={sub.label} className="min-w-0 bg-[var(--rule)]/30 p-4">
                    <h5
                      className="font-display fraunces-ground mb-2 break-words text-[var(--fg)]"
                      style={{ fontSize: 'clamp(1.45rem, 2.2vw, 2.25rem)', lineHeight: '0.92' }}
                    >
                      {sub.label}
                    </h5>
                    <p className="mb-0 text-[var(--fg-muted)] text-[var(--step-0)] leading-relaxed">
                      {sub.description}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </article>
  );
}

// Two-column layout for experiences without subWaypoints (like BCA Education)
function EducationExperienceCard({ item, index, totalExperiences: _totalExperiences }: { 
  item: ReturnType<typeof getExperience>[0]; 
  index: number; 
  totalExperiences: number;
}) {
  return (
    <article 
      className="relative mb-16 md:mb-20 last:mb-0 animate-fade-in"
      style={{ animationDelay: `${index * 100}ms` }}
    >
      {/* Two-column layout */}
      <div className="grid grid-cols-12 gap-6">
        {/* Left column: Large decorative heading */}
        <div className="col-span-12 md:col-span-5 relative z-10 p-6">
          <h2 
            className="font-display fraunces-ground text-[var(--fg)] mb-4 leading-[0.9] tracking-[-0.02em]"
            style={{ fontSize: 'clamp(2.5rem, 6vw, 4.5rem)' }}
          >
            {item.role}
          </h2>
          
          <p className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)] mb-2">
            {item.period}
          </p>
          
          <p className="font-body text-[var(--fg-muted)] text-[var(--step-0)]">
            {item.location}
          </p>
        </div>
        
        {/* Right column: Education information card */}
        <div className="col-span-12 md:col-span-7 relative z-10">
          <div className="bg-[var(--bg)] border border-[var(--rule)] p-6 md:p-8 hard-shadow relative transition-theme">            
            <div className="prose max-w-none">
              {item.description.map((desc, i) => (
                <p key={i} className={`font-body text-[var(--fg-muted)] text-[var(--step-0)] ${i < item.description.length - 1 ? 'mb-4' : ''}`}>
                  {desc}
                </p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </article>
  );
}
