import { getSkillsByCategory, getSkillSymbol, type Skill } from '../content/skills';
import { copy } from '../content/copy';
import { useState, useRef, useEffect } from 'react';

export function Legend() {
  const skillsByCategory = getSkillsByCategory();
  const [hoveredSkill, setHoveredSkill] = useState<Skill | null>(null);
  const connectorRefs = useRef<Map<string, SVGLineElement>>(new Map());

  return (
    <section 
      id="legend" 
      className="section relative"
      aria-labelledby="legend-title"
    >
      <div className="container">
        <header className="mb-16">
          <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
            {copy.legend.title}
          </span>
          <h2 id="legend-title" className="font-display fraunces-ground text-[var(--fg)]" style={{ fontSize: 'var(--step-5)' }}>
            {copy.legend.subtitle}
          </h2>
        </header>

        <div className="grid-12 gap-8">
          <div className="col-span-12 lg:col-span-8">
            <div className="space-y-12" role="list" aria-label="Skills legend">
              {copy.legend.categories.map((category) => (
                <SkillCategory 
                  key={category} 
                  category={category} 
                  skills={skillsByCategory[category] || []}
                  onHover={setHoveredSkill}
                  connectorRefs={connectorRefs}
                />
              ))}
            </div>
          </div>

          <div className="col-span-12 lg:col-span-4">
            <LegendKey />
            <ProjectConnectors 
              hoveredSkill={hoveredSkill} 
              connectorRefs={connectorRefs} 
            />
          </div>
        </div>

        <svg 
          className="absolute inset-0 -z-10 pointer-events-none overflow-visible" 
          style={{ width: '100%', height: '100%' }}
          aria-hidden="true"
        >
          {hoveredSkill?.projects.map((projectSlug) => (
            <line
              key={projectSlug}
              ref={(el) => {
                if (el) connectorRefs.current.set(`${hoveredSkill.id}-${projectSlug}`, el);
              }}
              x1="0" y1="0" x2="0" y2="0"
              stroke="var(--signal)"
              strokeWidth="1"
              strokeDasharray="4,4"
              opacity="0"
              vectorEffect="non-scaling-stroke"
              className="connector-line"
            />
          ))}
        </svg>
      </div>
    </section>
  );
}

interface SkillCategoryProps {
  category: string;
  skills: ReturnType<typeof getSkillsByCategory>[string];
  onHover: (skill: Skill | null) => void;
  connectorRefs: React.RefObject<Map<string, SVGLineElement>>;
}

function SkillCategory({ category, skills, onHover, connectorRefs }: SkillCategoryProps) {
  return (
    <article className="relative" role="listitem">
      <h3 className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step-0)] mb-6 pb-2 border-b border-[var(--rule)]">
        {category}
      </h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4" role="list">
        {skills.map((skill) => (
          <SkillItem 
            key={skill.id} 
            skill={skill} 
            onHover={onHover}
            connectorRefs={connectorRefs}
          />
        ))}
      </div>
    </article>
  );
}

interface SkillItemProps {
  skill: Skill;
  onHover: (skill: Skill | null) => void;
  connectorRefs: React.RefObject<Map<string, SVGLineElement>>;
}

function SkillItem({ skill, onHover }: SkillItemProps) {
  const symbol = getSkillSymbol(skill.status);
  
  return (
    <button
      type="button"
      className="group relative flex items-start gap-4 p-4 bg-[var(--bg)] border border-[var(--rule)] hover:border-[var(--signal)] transition-colors hard-shadow"
      onMouseEnter={() => onHover(skill)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(skill)}
      onBlur={() => onHover(null)}
      aria-label={`${skill.name}, ${copy.legend.symbolKey[skill.status]}; used in ${skill.projects.join(', ')}`}
    >
      <span 
        className="font-mono text-[var(--step-2)] text-[var(--signal)] shrink-0 mt-0.5"
        aria-hidden="true"
      >
        {symbol}
      </span>
      <div className="flex-1 min-w-0">
        <h4 className="font-display fraunces-ground text-[var(--fg)] text-[var(--step-0)] mb-1 truncate">
          {skill.name}
        </h4>
        <p className="font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)]">
          {copy.legend.symbolKey[skill.status]}
        </p>
        <div className="mt-2 flex flex-wrap gap-1">
          {skill.projects.slice(0, 3).map((project) => (
            <span 
              key={project} 
              className="font-mono uppercase-tracked text-[var(--step--1)] px-1.5 py-0.5 bg-[var(--rule)] text-[var(--fg-muted)] text-[var(--fg)]/60"
            >
              {project.toUpperCase()}
            </span>
          ))}
          {skill.projects.length > 3 && (
            <span className="font-mono uppercase-tracked text-[var(--step--1)] text-[var(--fg-muted)]">
              +{skill.projects.length - 3}
            </span>
          )}
        </div>
      </div>
    </button>
  );
}

function LegendKey() {
  return (
    <div className="sticky top-24 bg-[var(--bg)] border border-[var(--rule)] p-6 hard-shadow">
      <h3 className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step-0)] mb-6 pb-3 border-b border-[var(--rule)]">
        Map Key
      </h3>
      <dl className="space-y-4" role="list">
        {Object.entries(copy.legend.symbolKey).map(([status, description]) => (
          <div key={status} className="flex items-center gap-3">
            <dt className="font-mono text-[var(--step-2)] text-[var(--signal)] shrink-0">
              {status === 'shipped' ? 'â—' : status === 'working' ? 'â—' : 'â—‹'}
            </dt>
            <dd className="font-body text-[var(--fg-muted)] text-[var(--step-0)]">
              {description}
            </dd>
          </div>
        ))}
      </dl>
    </div>
  );
}

interface ProjectConnectorsProps {
  hoveredSkill: Skill | null;
  connectorRefs: React.RefObject<Map<string, SVGLineElement>>;
}

function ProjectConnectors({ hoveredSkill, connectorRefs }: ProjectConnectorsProps) {
  useEffect(() => {
    if (!hoveredSkill) return;
    const skillElements = document.querySelectorAll('[data-skill-id]');
    const projectElements = document.querySelectorAll('[data-project-id]');
    
    if (skillElements.length === 0 || projectElements.length === 0) return;

    const updateConnectors = () => {
      const skillEl = document.querySelector(`[data-skill-id="${hoveredSkill.id}"]`) as HTMLElement;
      if (!skillEl) return;

      const skillRect = skillEl.getBoundingClientRect();
      const containerRect = skillEl.closest('.container')?.getBoundingClientRect();
      if (!containerRect) return;

      hoveredSkill.projects.forEach((projectSlug) => {
        const projectEl = document.querySelector(`[data-project-id="${projectSlug}"]`) as HTMLElement;
        if (!projectEl) return;

        const projectRect = projectEl.getBoundingClientRect();
        const line = connectorRefs.current.get(`${hoveredSkill.id}-${projectSlug}`);
        
        if (line) {
          const x1 = skillRect.right - containerRect.left;
          const y1 = skillRect.top + skillRect.height / 2 - containerRect.top;
          const x2 = projectRect.left - containerRect.left;
          const y2 = projectRect.top + projectRect.height / 2 - containerRect.top;
          
          line.setAttribute('x1', x1.toString());
          line.setAttribute('y1', y1.toString());
          line.setAttribute('x2', x2.toString());
          line.setAttribute('y2', y2.toString());
          line.style.opacity = '0.6';
        }
      });
    };

    updateConnectors();
    window.addEventListener('resize', updateConnectors);
    window.addEventListener('scroll', updateConnectors);
    
    return () => {
      window.removeEventListener('resize', updateConnectors);
      window.removeEventListener('scroll', updateConnectors);
      hoveredSkill.projects.forEach((projectSlug) => {
        const line = connectorRefs.current.get(`${hoveredSkill.id}-${projectSlug}`);
        if (line) line.style.opacity = '0';
      });
    };
  }, [hoveredSkill, connectorRefs]);

  return null;
}

