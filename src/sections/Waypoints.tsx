import { Link } from 'react-router-dom';
import { getFeaturedProjects, getCompactProjects } from '../content/projects';
import { copy } from '../content/copy';
import { cn } from '../lib/utils';

export function Waypoints() {
  const featured = getFeaturedProjects();
  const compact = getCompactProjects();

  return (
    <section 
      id="waypoints" 
      className="section"
      aria-labelledby="waypoints-title"
    >
      <div className="container">
        <header className="mb-16">
          <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
            {copy.waypoints.title}
          </span>
          <h2 id="waypoints-title" className="font-display fraunces-ground text-[var(--fg)]" style={{ fontSize: 'var(--step-5)' }}>
            {copy.waypoints.subtitle}
          </h2>
        </header>

        <div className="space-y-12">
          {/* Featured projects — 12-col grid */}
          <div className="grid-12 gap-8">
            {featured.map((project, index) => (
              <ProjectSheet 
                key={project.slug} 
                project={project} 
                sheetNumber={index + 1}
                totalSheets={featured.length + compact.length}
                isFeatured={true}
              />
            ))}
          </div>

          {compact.length > 0 && (
            <div className="pt-12 border-t border-[var(--rule)]">
              <h3 className="font-mono uppercase-tracked text-[var(--signal)] mb-8 text-center">
                Additional Waypoints
              </h3>
              {/* Compact projects — plain Tailwind grid, not grid-12 */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {compact.map((project, index) => (
                  <ProjectSheet 
                    key={project.slug} 
                    project={project} 
                    sheetNumber={featured.length + index + 1}
                    totalSheets={featured.length + compact.length}
                    isFeatured={false}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

interface ProjectSheetProps {
  project: ReturnType<typeof getFeaturedProjects>[0];
  sheetNumber: number;
  totalSheets: number;
  isFeatured: boolean;
}

function ProjectSheet({ project, sheetNumber, totalSheets, isFeatured }: ProjectSheetProps) {
  const statusColors: Record<string, string> = {
    'DEPLOYED': 'var(--counter)',
    'WORKING': 'var(--signal)',
    'IN BUILD': 'var(--fg-muted)',
    'PROTOTYPE': 'var(--fg-muted)'
  };

  return (
    <article 
      className={cn(
        'relative group bg-[var(--bg)] border border-[var(--rule)] transition-theme hard-shadow overflow-hidden',
        isFeatured
          ? 'col-span-12 md:col-span-6 lg:col-span-4'
          : '' // compact cards live in a plain grid, no col-span needed
      )}
      style={{ aspectRatio: '1 / 1.414' }}
    >
      <div className="absolute inset-0 bg-[var(--bg)] opacity-0 group-hover:opacity-100 transition-opacity duration-240" aria-hidden="true" />
      
      <div className="relative z-10 p-6 h-full flex flex-col">
        <div className="flex-1 flex flex-col">
          <header className="mb-6">
            <h3 className="font-display fraunces-ground text-[var(--fg)] text-[var(--step-3)] mb-3">
              {project.name}
            </h3>
            <p className="text-[var(--fg-muted)] text-[var(--step-0)] leading-relaxed">
              {project.description}
            </p>
          </header>

          <div className="flex flex-wrap gap-2 mb-6">
            {project.stack.slice(0, 4).map((tech, i) => (
              <span 
                key={i} 
                className="font-mono uppercase-tracked text-[var(--step--1)] px-2 py-1 bg-[var(--rule)] text-[var(--fg-muted)] border border-[var(--rule)]"
              >
                {tech}
              </span>
            ))}
            {project.stack.length > 4 && (
              <span className="font-mono uppercase-tracked text-[var(--step--1)] px-2 py-1 text-[var(--fg-muted)]">
                +{project.stack.length - 4} more
              </span>
            )}
          </div>

          <footer className="mt-auto pt-6 border-t border-[var(--rule)]">
            <div className="grid grid-cols-2 gap-4 text-[var(--step--1)] font-mono uppercase-tracked">
              <div>
                <span className="text-[var(--fg-muted)] block mb-1">{copy.waypoints.titleBlockLabels.status}</span>
                <span className="text-[var(--fg)] flex items-center gap-2">
                  <span 
                    className="w-2 h-2 rounded-full" 
                    style={{ backgroundColor: statusColors[project.status] }}
                    aria-hidden="true"
                  />
                  {project.status}
                </span>
              </div>
              <div>
                <span className="text-[var(--fg-muted)] block mb-1">{copy.waypoints.titleBlockLabels.sheet}</span>
                <span className="text-[var(--fg)]">{sheetNumber} / {totalSheets}</span>
              </div>
              <div className="col-span-2">
                <span className="text-[var(--fg-muted)] block mb-1">{copy.waypoints.titleBlockLabels.scale}</span>
                <span className="text-[var(--fg)]">
                  {project.status === 'DEPLOYED' ? '1:1 DEPLOYED' : 
                   project.status === 'WORKING' ? '1:1 WORKING' :
                   project.status === 'IN BUILD' ? '1:1 IN BUILD' : '1:1 PROTOTYPE'}
                </span>
              </div>
            </div>

            {isFeatured && (
              <Link 
                to={`/work/${project.slug}`} 
                className="mt-4 block w-full text-center py-3 px-4 border-2 border-[var(--signal)] text-[var(--signal)] font-body font-medium text-[var(--step-0)] hover:bg-[var(--signal)] hover:text-[var(--bg)] transition-all hard-shadow"
              >
                View case study
              </Link>
            )}

            {project.repoUrl && (
              <a 
                href={project.repoUrl} 
                target="_blank" 
                rel="noopener noreferrer"
                className="mt-2 block w-full text-center py-2 px-4 text-[var(--fg-muted)] font-mono uppercase-tracked text-[var(--step--1)] hover:text-[var(--fg)] transition-colors"
              >
                View repository
              </a>
            )}
          </footer>
        </div>
      </div>

      <div className="absolute bottom-0 left-0 right-0 h-px bg-[var(--rule)]" aria-hidden="true" />
    </article>
  );
}

