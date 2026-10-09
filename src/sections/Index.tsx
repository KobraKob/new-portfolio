import { useRef, useEffect, useState } from 'react';
import { copy } from '../content/copy';
import { LiveClock } from '../components/LiveClock';
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
          <div className="col-span-12 md:col-span-5 lg:col-span-4 xl:col-span-3 relative z-20 animate-fade-in overflow-hidden">
            <h1
              id="hero-title"
              className="hero-title font-display fraunces-ground text-[var(--fg)] leading-[0.9] tracking-[-0.02em] mb-6 whitespace-nowrap overflow-visible"
              aria-label="Balavanth"
              style={{ marginRight: '-8vw' }}
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
              <a
                href="/waypoints"
                onClick={(e) => {
                  const el = document.getElementById('waypoints');
                  if (el) {
                    e.preventDefault();
                    el.scrollIntoView({ behavior: 'smooth' });
                  }
                }}
                className="px-6 py-3 bg-[var(--signal)] text-[var(--bg)] font-body font-medium text-[var(--step-0)] hover:opacity-90 transition-opacity hard-shadow"
              >
                {copy.hero.actions.work}
              </a>
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
                  {coordinates.lat.toFixed(4)}° N, {coordinates.lng.toFixed(4)}° E
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
  const svgRef = useRef<SVGSVGElement>(null);
  const layer0Ref = useRef<SVGGElement>(null);
  const layer1Ref = useRef<SVGGElement>(null);
  const layer2Ref = useRef<SVGGElement>(null);
  const currentOffset = useRef({ x: 0, y: 0 });
  const targetOffset = useRef({ x: 0, y: 0 });
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return;

    const MULTIPLIERS = [0.01, 0.025, 0.05];
    const layerRefs = [layer0Ref, layer1Ref, layer2Ref];

    const onMouseMove = (e: MouseEvent) => {
      const cx = window.innerWidth / 2;
      const cy = window.innerHeight / 2;
      targetOffset.current = {
        x: (e.clientX - cx) / cx,
        y: (e.clientY - cy) / cy,
      };
    };

    const tick = () => {
      const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
      currentOffset.current.x = lerp(currentOffset.current.x, targetOffset.current.x, 0.08);
      currentOffset.current.y = lerp(currentOffset.current.y, targetOffset.current.y, 0.08);

      layerRefs.forEach((ref, i) => {
        if (ref.current) {
          const dx = currentOffset.current.x * MULTIPLIERS[i] * 60;
          const dy = currentOffset.current.y * MULTIPLIERS[i] * 60;
          ref.current.style.transform = `translate(${dx}px, ${dy}px)`;
        }
      });

      rafRef.current = requestAnimationFrame(tick);
    };

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    rafRef.current = requestAnimationFrame(tick);

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <svg
      ref={svgRef}
      className="w-full h-full"
      viewBox="0 0 800 400"
      preserveAspectRatio="xMidYMid slice"
      role="img"
      aria-label={isGround
        ? 'Road network with parallel lane strokes, dashed centerlines, and junction nodes'
        : 'Contour landmass with coastline, hachure hatching, and compass rose'}
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
        <>
          {/* Layer 0 — slowest, background roads */}
          <g ref={layer0Ref} style={{ willChange: 'transform' }}>
            <path d="M0,320 Q200,300 400,320 T800,320" stroke="var(--rule)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.4" />
            <path d="M0,80 Q200,100 400,80 T800,80" stroke="var(--rule)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.4" />
            <path d="M0,340 Q200,320 400,340 T800,340" stroke="var(--rule)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.3" />
          </g>
          {/* Layer 1 — mid */}
          <g ref={layer1Ref} style={{ willChange: 'transform' }}>
            <path d="M50,200 Q200,150 350,200 T650,200" stroke="var(--fg)" strokeWidth="1.5" strokeDasharray="20,10" fill="none" vectorEffect="non-scaling-stroke" opacity="0.6" />
            <path d="M50,220 Q200,170 350,220 T650,220" stroke="var(--fg)" strokeWidth="1.5" strokeDasharray="20,10" fill="none" vectorEffect="non-scaling-stroke" opacity="0.6" />
            <path d="M50,180 Q200,130 350,180 T650,180" stroke="var(--signal)" strokeWidth="2" strokeDasharray="10,5" fill="none" vectorEffect="non-scaling-stroke" />
            <path d="M50,240 Q200,190 350,240 T650,240" stroke="var(--signal)" strokeWidth="2" strokeDasharray="10,5" fill="none" vectorEffect="non-scaling-stroke" />
          </g>
          {/* Layer 2 — fastest, foreground nodes */}
          <g ref={layer2Ref} style={{ willChange: 'transform' }}>
            <circle cx="200" cy="175" r="5" fill="var(--signal)" stroke="var(--bg)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <circle cx="350" cy="200" r="5" fill="var(--signal)" stroke="var(--bg)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <circle cx="500" cy="210" r="5" fill="var(--signal)" stroke="var(--bg)" strokeWidth="2" vectorEffect="non-scaling-stroke" />
            <path d="M200,175 Q275,120 350,200" stroke="var(--fg-muted)" strokeWidth="1" strokeDasharray="5,5" fill="none" vectorEffect="non-scaling-stroke" opacity="0.5" />
            <path d="M350,200 Q425,250 500,210" stroke="var(--fg-muted)" strokeWidth="1" strokeDasharray="5,5" fill="none" vectorEffect="non-scaling-stroke" opacity="0.5" />
            <text x="200" y="162" fontFamily="JetBrains Mono" fontSize="8" fill="var(--fg-muted)" textAnchor="middle">WP-01</text>
            <text x="350" y="187" fontFamily="JetBrains Mono" fontSize="8" fill="var(--fg-muted)" textAnchor="middle">WP-02</text>
            <text x="500" y="197" fontFamily="JetBrains Mono" fontSize="8" fill="var(--fg-muted)" textAnchor="middle">WP-03</text>
          </g>
        </>
      ) : (
        <>
          {/* Erevan layer 0 — background contours */}
          <g ref={layer0Ref} style={{ willChange: 'transform' }}>
            <path d="M50,310 Q200,240 400,290 Q550,330 700,280 Q800,250 800,310" stroke="var(--fg)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.4" />
            <path d="M50,340 Q200,280 450,320 Q600,350 800,330" stroke="var(--fg)" strokeWidth="1" fill="none" vectorEffect="non-scaling-stroke" opacity="0.3" />
          </g>
          {/* Erevan layer 1 — mid coastline */}
          <g ref={layer1Ref} style={{ willChange: 'transform' }}>
            <path d="M50,250 Q150,180 300,220 Q450,260 600,200 Q700,150 750,250" stroke="var(--fg)" strokeWidth="2" fill="url(#hatch-erevan)" vectorEffect="non-scaling-stroke" opacity="0.7" />
            <path d="M50,280 Q180,200 350,260 Q500,300 650,240 Q750,200 800,280" stroke="var(--fg)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" opacity="0.6" />
            <path d="M100,220 Q250,160 400,190 Q550,220 700,180" stroke="var(--signal)" strokeWidth="1.5" fill="none" vectorEffect="non-scaling-stroke" />
          </g>
          {/* Erevan layer 2 — foreground compass */}
          <g ref={layer2Ref} style={{ willChange: 'transform' }}>
            <path d="M150,190 Q300,130 450,170 Q600,200 750,160" stroke="var(--signal)" strokeWidth="1" strokeDasharray="8,4" fill="none" vectorEffect="non-scaling-stroke" />
            <g transform="translate(680, 90) rotate(-15)">
              <path d="M0,-22 L0,22 M-22,0 L22,0" stroke="var(--signal)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" />
              <text x="0" y="-30" fontFamily="JetBrains Mono" fontSize="10" fill="var(--signal)" textAnchor="middle" fontWeight="500">N</text>
              <text x="0" y="38" fontFamily="JetBrains Mono" fontSize="8" fill="var(--fg-muted)" textAnchor="middle">S</text>
              <text x="-36" y="4" fontFamily="JetBrains Mono" fontSize="8" fill="var(--fg-muted)" textAnchor="middle">W</text>
              <text x="36" y="4" fontFamily="JetBrains Mono" fontSize="8" fill="var(--fg-muted)" textAnchor="middle">E</text>
            </g>
          </g>
        </>
      )}
    </svg>
  );
}
