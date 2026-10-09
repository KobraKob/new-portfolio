import { Link } from 'react-router-dom';
import { copy } from '../content/copy';

export function NotFound() {
  return (
    <section className="section min-h-[100svh] flex items-center justify-center relative overflow-hidden">
      <div className="container relative z-10 text-center">
        <div className="mb-12" aria-hidden="true">
          <svg viewBox="0 0 200 200" className="w-64 h-64 mx-auto text-[var(--signal)]" role="img" aria-label="Compass rose with spinning needle">
            <circle cx="100" cy="100" r="95" fill="none" stroke="var(--rule)" stroke-width="2" vector-effect="non-scaling-stroke" />
            <circle cx="100" cy="100" r="85" fill="none" stroke="var(--rule)" stroke-width="1" vector-effect="non-scaling-stroke" stroke-dasharray="10,5" />
            
            <g font-family="JetBrains Mono" font-size="12" fill="var(--fg)" text-anchor="middle" dominant-baseline="middle">
              <text x="100" y="25" font-weight="500">N</text>
              <text x="100" y="175" font-size="10">S</text>
              <text x="25" y="105" font-size="10">W</text>
              <text x="175" y="105" font-size="10">E</text>
              <text x="65" y="45" font-size="9">NW</text>
              <text x="135" y="45" font-size="9">NE</text>
              <text x="65" y="155" font-size="9">SW</text>
              <text x="135" y="155" font-size="9">SE</text>
            </g>

            <g transform="translate(100, 100)">
              <path 
                d="M0,-70 L-4,0 L0,10 L4,0 Z" 
                fill="var(--signal)" 
                className="compass-needle"
                style={{ 
                  transformOrigin: '0 0',
                  animation: 'spin 4s ease-in-out infinite' 
                }}
              />
              <circle cx="0" cy="0" r="6" fill="var(--signal)" />
            </g>

            <style>{`
              @keyframes spin {
                0%, 100% { transform: rotate(-15deg); }
                50% { transform: rotate(15deg); }
              }
            `}</style>
          </svg>
        </div>

        <h1 className="font-display fraunces-ground text-[var(--fg)] mb-4" style={{ fontSize: 'var(--step-5)' }}>
          {copy.notFound.title}
        </h1>
        <p className="text-[var(--fg-muted)] text-[var(--step-1)] mb-12 max-w-md mx-auto">
          {copy.notFound.message}
        </p>
        <Link 
          to="/" 
          className="px-8 py-3 bg-[var(--signal)] text-[var(--bg)] font-body font-medium text-[var(--step-0)] hover:opacity-90 transition-opacity hard-shadow inline-block"
        >
          {copy.notFound.action}
        </Link>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 font-mono uppercase-tracked text-[var(--fg-muted)] text-[var(--step--1)]">
        12.9716° N, 77.5946° E
      </div>
    </section>
  );
}