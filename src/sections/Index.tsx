import { Link } from 'react-router-dom';
import { copy } from '../content/copy';
import { LiveClock } from '../components/LiveClock';
import { useEffect, useState } from 'react';
import { useTheme } from '../app/ThemeProvider';

export function Index() {
  const [coordinates, setCoordinates] = useState({ lat: 12.9716, lng: 77.5946 });
  const { theme } = useTheme();

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const lat = 12.9716 + (e.clientY / window.innerHeight - 0.5) * 0.01;
      const lng = 77.5946 + (e.clientX / window.innerWidth - 0.5) * 0.01;
      setCoordinates({ lat, lng });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  return (
    <section 
      id="index" 
      className="section relative min-h-[100svh] flex items-start justify-center overflow-hidden"
      aria-labelledby="hero-title"
    >
      <div className="container relative z-10 w-full">
        <div className="grid-12">
          <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 relative z-20 animate-fade-in">
            <h1 
              id="hero-title" 
              className="hero-title font-display fraunces-ground text-[var(--fg)] leading-[0.9] tracking-[-0.02em] mb-6"
              aria-label="Balavanth"
            >
              {copy.hero.name}
            </h1>
            
            <p className="font-mono uppercase-tracked text-[var(--fg-muted)] mb-8 max-w-none">
              {copy.hero.role}
            </p>

            <div className="flex items-center gap-3 mb-8 animate-slide-up stagger-1">
              <span 
                className="w-2 h-2 rounded-full bg-[var(--counter)] animate-pulse" 
                aria-hidden="true"
              />
              <span className="font-mono uppercase-tracked text-[var(--counter)]">
                {copy.hero.status}
              </span>
            </div>

            <div className="flex flex-wrap gap-4 animate-slide-up stagger-2">
              <Link 
                to="/waypoints" 
                className="px-6 py-3 bg-[var(--signal)] text-[var(--bg)] font-body font-medium text-[var(--step-0)] hover:opacity-90 transition-opacity hard-shadow"
              >
                {copy.hero.actions.work}
              </Link>
              <a
                href="/Balavanth_Resume.pdf" 
                target="_blank" 
                rel="noopener noreferrer"
                className="px-6 py-3 border-2 border-[var(--rule)] text-[var(--fg)] font-body font-medium text-[var(--step-0)] hover:border-[var(--fg)] hover:text-[var(--fg)] transition-colors hard-shadow"
              >
                {copy.hero.actions.resume}
              </a>
              {copy.meta.email && (
                <a
                  href={`mailto:${copy.meta.email}`}
                  className="px-6 py-3 border-2 border-[var(--rule)] text-[var(--fg)] font-body font-medium text-[var(--step-0)] hover:border-[var(--fg)] hover:text-[var(--fg)] transition-colors hard-shadow"
                >
                  {copy.hero.actions.email}
                </a>
              )}
            </div>

            <div className="mt-16 pt-8 border-t border-[var(--rule)] animate-slide-up stagger-3">
              <div className="flex flex-wrap items-center gap-6 font-mono uppercase-tracked text-[var(--fg-muted)]">
                <span>
                  {coordinates.lat.toFixed(4)}Â° N, {coordinates.lng.toFixed(4)}Â° E
                </span>
                <LiveClock />
                <span>{copy.hero.marginalia.sheet}</span>
              </div>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-8 xl:col-span-9 relative animate-fade-in stagger-4" aria-hidden="true">
            <div className="relative aspect-[4/3] md:aspect-[16/9] lg:aspect-[2/1]">
              <HeroTerrain theme={theme} />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function HeroTerrain({ theme }: { theme: 'ground' | 'erevan' }) {
  const isGround = theme === 'ground';
  
  return (
    <svg 
      className="w-full h-full" 
      viewBox="0 0 800 400" 
      preserveAspectRatio="none"
      role="img"
      aria-label={isGround ? "Road network with parallel lane strokes, dashed centerlines, and junction nodes" : "Contour landmass with coastline, hachure hatching, and compass rose"}
    >
      <defs>
        <pattern id="hatch-ground" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="var(--rule)" strokeWidth="0.5" fill="none" />
        </pattern>
        <pattern id="hatch-erevan" patternUnits="userSpaceOnUse" width="4" height="4">
          <path d="M-1,1 l2,-2 M0,4 l4,-4 M3,5 l2,-2" stroke="var(--fg-muted)" strokeWidth="0.3" fill="none" opacity="0.3" />
        </pattern>
      </defs>
      
      <rect width="800" height="400" fill="var(--bg)" />
      
      {isGround ? (
        <GroundRoadNetwork />
      ) : (
        <ErevanContours />
      )}
    </svg>
  );
}

function GroundRoadNetwork() {
  return (
    <g stroke="var(--fg)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke">
      <path d="M50,200 Q200,150 350,200 T650,200" strokeDasharray="20,10" opacity="0.6" className="linework" />
      <path d="M50,220 Q200,170 350,220 T650,220" strokeDasharray="20,10" opacity="0.6" className="linework" />
      <path d="M50,180 Q200,130 350,180 T650,180" stroke="var(--signal)" strokeWidth="2" strokeDasharray="10,5" className="linework" />
      <path d="M50,240 Q200,190 350,240 T650,240" stroke="var(--signal)" strokeWidth="2" strokeDasharray="10,5" className="linework" />
      
      <g stroke="var(--signal)" strokeWidth="1.5" fill="var(--signal)">
        <circle cx="200" cy="175" r="4" />
        <circle cx="350" cy="200" r="4" />
        <circle cx="500" cy="210" r="4" />
      </g>

      <g stroke="var(--fg-muted)" strokeWidth="1" fill="none" opacity="0.5">
        <path d="M200,175 Q250,120 350,200" strokeDasharray="5,5" />
        <path d="M350,200 Q425,250 500,210" strokeDasharray="5,5" />
      </g>

      <g fontFamily="JetBrains Mono" fontSize="8" fill="var(--fg-muted)" textAnchor="middle">
        <text x="200" y="165">WP-01</text>
        <text x="350" y="190">WP-02</text>
        <text x="500" y="200">WP-03</text>
      </g>
    </g>
  );
}

function ErevanContours() {
  return (
    <g stroke="var(--fg)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.7">
      <path d="M50,250 Q150,180 300,220 Q450,260 600,200 Q700,150 750,250" className="linework" fill="url(#hatch-erevan)" strokeWidth="2" />
      <path d="M50,280 Q180,200 350,260 Q500,300 650,240 Q750,200 800,280" className="linework" />
      <path d="M50,310 Q200,240 400,290 Q550,330 700,280 Q800,250 800,310" className="linework" />
      <path d="M100,220 Q250,160 400,190 Q550,220 700,180" stroke="var(--signal)" strokeWidth="1.5" className="linework" />
      <path d="M150,190 Q300,130 450,170 Q600,200 750,160" stroke="var(--signal)" strokeWidth="1" className="linework" strokeDasharray="8,4" />

      <g transform="translate(700, 100) rotate(-15)" fill="var(--signal)" fontFamily="JetBrains Mono" fontSize="10" textAnchor="middle">
        <path d="M0,-20 L0,20 M-20,0 L20,0" stroke="var(--signal)" strokeWidth="2" fill="none" />
        <text x="0" y="-30" fontWeight="500">N</text>
        <text x="0" y="35" fontSize="8">E</text>
        <text x="-35" y="5" fontSize="8">W</text>
        <text x="35" y="5" fontSize="8">S</text>
      </g>
    </g>
  );
}
