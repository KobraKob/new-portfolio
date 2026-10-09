import { useParams, Link } from 'react-router-dom';
import { getProjectBySlug } from '../content/projects';
import { copy } from '../content/copy';
import { LiveClock } from '../components/LiveClock';

export function CaseStudy() {
  const { slug } = useParams<{ slug: string }>();
  const project = getProjectBySlug(slug || '');

  if (!project) {
    return <NotFoundCaseStudy />;
  }

  return (
    <section 
      id="case-study" 
      className="section relative min-h-[100svh]"
      aria-labelledby="case-study-title"
    >
      <div className="container">
        <header className="mb-12">
          <div className="flex items-center gap-4 mb-6">
            <Link 
              to="/waypoints" 
              className="p-2 text-[var(--fg-muted)] hover:text-[var(--signal)] transition-colors"
              aria-label="Back to Waypoints"
            >
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" className="w-5 h-5" aria-hidden="true">
                <path d="M19 12H5M12 5l-7 7 7 7" />
              </svg>
            </Link>
            <span className="font-mono uppercase-tracked text-[var(--signal)]">
              {copy.waypoints.title}
            </span>
          </div>

          <div className="grid-12 gap-8">
            <div className="col-span-12 lg:col-span-8">
              <h1 id="case-study-title" className="font-display fraunces-ground text-[var(--fg)] mb-4" style={{ fontSize: 'var(--step-5)' }}>
                {project.name}
              </h1>
              <p className="text-[var(--fg-muted)] text-[var(--step-1)] leading-relaxed mb-6">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-2 mb-6">
                {project.stack.map((tech, i) => (
                  <span key={i} className="font-mono uppercase-tracked text-[var(--step--1)] px-3 py-1 bg-[var(--rule)] text-[var(--fg-muted)] border border-[var(--rule)]">
                    {tech}
                  </span>
                ))}
              </div>
              <div className="flex flex-wrap items-center gap-6 font-mono uppercase-tracked text-[var(--step--1)]">
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-[var(--signal)]" aria-hidden="true" />
                  {project.status}
                </span>
                <span>SHEET 1 / 1</span>
                <span>
                  {project.status === 'DEPLOYED' ? 'SCALE 1:1 DEPLOYED' : 
                   project.status === 'WORKING' ? 'SCALE 1:1 WORKING' :
                   project.status === 'IN BUILD' ? 'SCALE 1:1 IN BUILD' : 'SCALE 1:1 PROTOTYPE'}
                </span>
              </div>
            </div>
            <div className="col-span-12 lg:col-span-4">
              <div className="sticky top-24 bg-[var(--bg)] border border-[var(--rule)] p-6 hard-shadow">
                <h3 className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step-0)] mb-4 pb-3 border-b border-[var(--rule)]">
                  Links
                </h3>
                <div className="space-y-3">
                  {project.repoUrl && (
                    <a href={project.repoUrl} target="_blank" rel="noopener noreferrer" className="block text-[var(--fg)] hover:text-[var(--signal)] transition-colors font-body text-[var(--step-0)]">
                      Repository →
                    </a>
                  )}
                  {project.demoUrl && (
                    <a href={project.demoUrl} target="_blank" rel="noopener noreferrer" className="block text-[var(--fg)] hover:text-[var(--signal)] transition-colors font-body text-[var(--step-0)]">
                      Live Demo →
                    </a>
                  )}
                  {!project.repoUrl && !project.demoUrl && (
                    <p className="text-[var(--fg-muted)] text-[var(--step-0)] italic">
                      Links to be added
                    </p>
                  )}
                </div>
              </div>
            </div>
          </div>
        </header>

        {project.caseStudy && (
          <article className="prose max-w-4xl mx-auto space-y-16">
            <CaseStudySection title="Problem" content={project.caseStudy.problem} />
            <CaseStudySection title="Approach" content={project.caseStudy.approach} />
            <CaseStudySection title="Architecture" content={project.caseStudy.architecture} />
            <CaseStudySection title="What Broke / What I Learned" content={project.caseStudy.learned} />
            <CaseStudySection title="What's Next" content={project.caseStudy.next} />
          </article>
        )}

        <footer className="mt-24 pt-8 border-t border-[var(--rule)]">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="font-mono uppercase-tracked text-[var(--fg-muted)] text-center md:text-left">
              © 2026 Balavanth · Bengaluru · 12.9716° N, 77.5946° E
            </p>
            <LiveClock />
          </div>
        </footer>
      </div>
    </section>
  );
}

function CaseStudySection({ title, content }: { title: string; content: string }) {
  return (
    <section aria-labelledby={`case-study-${title.toLowerCase().replace(/\s+/g, '-')}`}>
      <h2 id={`case-study-${title.toLowerCase().replace(/\s+/g, '-')}`} className="font-mono uppercase-tracked text-[var(--signal)] text-[var(--step-0)] mb-4 pb-2 border-b border-[var(--rule)]">
        {title}
      </h2>
      <div className="text-[var(--fg)] leading-relaxed text-[var(--step-0)]">
        {content.split('\n\n').map((paragraph, i) => (
          <p key={i} className="mb-4 animate-fade-in">{paragraph}</p>
        ))}
      </div>
    </section>
  );
}

function NotFoundCaseStudy() {
  return (
    <section className="section min-h-[100svh] flex items-center justify-center">
      <div className="text-center">
        <h1 className="font-display fraunces-ground text-[var(--fg)] mb-4" style={{ fontSize: 'var(--step-5)' }}>
          Case study not found
        </h1>
        <p className="text-[var(--fg-muted)] mb-8">The requested project doesn't exist.</p>
        <Link to="/waypoints" className="px-6 py-3 bg-[var(--signal)] text-[var(--bg)] font-body font-medium text-[var(--step-0)] hover:opacity-90 transition-opacity hard-shadow inline-block">
          Back to Waypoints
        </Link>
      </div>
    </section>
  );
}
