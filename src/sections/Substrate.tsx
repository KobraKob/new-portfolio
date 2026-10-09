import { copy } from '../content/copy';

export function Substrate() {
  return (
    <section 
      id="substrate" 
      className="section"
      aria-labelledby="substrate-title"
    >
      <div className="container">
        <div className="grid-12">
          <div className="col-span-12 md:col-span-5 lg:col-span-4">
            <header className="mb-12">
              <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
                {copy.substrate.title}
              </span>
              <h2 id="substrate-title" className="font-display fraunces-ground text-[var(--fg)]" style={{ fontSize: 'var(--step-5)' }}>
                {copy.substrate.subtitle}
              </h2>
            </header>

            <div className="prose max-w-none">
              {copy.substrate.body.map((paragraph, index) => (
                <p key={index} className={`text-[var(--fg)] leading-relaxed mb-6 animate-fade-in stagger-${index + 1}`}>
                  {paragraph}
                </p>
              ))}
            </div>

            <div className="mt-12 pt-8 border-t border-[var(--rule)]">
              <p className="font-display fraunces-erevan text-[var(--fg-muted)] text-[var(--step-1)] italic">
                &ldquo;{copy.substrate.marginalia}&rdquo;
              </p>
            </div>
          </div>

          <div className="col-span-12 md:col-span-7 lg:col-span-8 relative -ml-8" aria-hidden="true">
            <div className="aspect-square max-w-xs mx-auto md:mx-0 md:ml-auto relative">
              <svg viewBox="0 0 300 300" className="w-full h-full" role="img" aria-label="Hand-drawn marginal note symbol">
                <defs>
                  <pattern id="paper-texture" patternUnits="userSpaceOnUse" width="8" height="8">
                    <path d="M0,0 L8,8 M8,0 L0,8" stroke="var(--rule)" strokeWidth="0.3" fill="none" opacity="0.3" />
                  </pattern>
                </defs>
                <rect width="300" height="300" fill="url(#paper-texture)" />
                
                <g stroke="var(--fg)" strokeWidth="2" fill="none" vectorEffect="non-scaling-stroke" transform="translate(150, 150)">
                  <circle r="120" strokeDasharray="753.6" strokeDashoffset="753.6" className="linework">
                    <animate attributeName="stroke-dashoffset" from="753.6" to="0" dur="2s" fill="freeze" />
                  </circle>
                  
                  <path d="M-60,-20 Q0,-60 60,-20 Q80,0 60,20 Q0,60 -60,20 Q-80,0 -60,-20 Z" 
                        stroke="var(--signal)" strokeWidth="2.5" className="emphasis-rule"
                        strokeDasharray="450" strokeDashoffset="450">
                    <animate attributeName="stroke-dashoffset" from="450" to="0" dur="1.5s" begin="0.5s" fill="freeze" />
                  </path>

                  <g fontFamily="JetBrains Mono" fontSize="10" fill="var(--fg-muted)" textAnchor="middle" dominantBaseline="middle">
                    <text x="0" y="-50" opacity="0" className="animate-fade-in stagger-5">12.97°</text>
                    <text x="0" y="50" opacity="0" className="animate-fade-in stagger-6">77.59°</text>
                  </g>
                </g>
              </svg>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
