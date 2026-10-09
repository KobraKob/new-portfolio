import { copy } from '../content/copy';
import { LiveClock } from '../components/LiveClock';
import { useState } from 'react';

export function Transmit() {
  const [copied, setCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(copy.meta.email);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
    }
  };

  return (
    <section 
      id="transmit" 
      className="section relative min-h-[100svh] flex items-center"
      aria-labelledby="transmit-title"
    >
      <div className="container w-full">
        <header className="mb-16 text-center">
          <span className="font-mono uppercase-tracked text-[var(--signal)] block mb-4">
            {copy.transmit.title}
          </span>
          <h2 id="transmit-title" className="font-display fraunces-ground text-[var(--fg)]" style={{ fontSize: 'var(--step-5)' }}>
            {copy.transmit.subtitle}
          </h2>
        </header>

        <div className="max-w-3xl mx-auto text-center">
          {copy.meta.email && (
            <a
              href={`mailto:${copy.meta.email}`}
              className="block mb-8 font-display fraunces-ground text-[var(--fg)] hover:text-[var(--signal)] transition-colors break-all"
              style={{ fontSize: 'var(--step-5)', lineHeight: '1.1', textDecoration: 'underline', textDecorationColor: 'var(--signal)', textDecorationThickness: '3px', textUnderlineOffset: '6px' }}
            >
              {copy.meta.email}
            </a>
          )}

          <p className="font-mono uppercase-tracked text-[var(--counter)] text-[var(--step-0)] mb-12 flex items-center justify-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[var(--counter)] animate-pulse" aria-hidden="true" />
            {copy.transmit.availability}
          </p>

          <div className="flex flex-wrap items-center justify-center gap-4 mb-12">
            <a 
              href={copy.meta.github} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-[var(--rule)] text-[var(--fg)] font-body font-medium text-[var(--step-0)] hover:border-[var(--fg)] hover:text-[var(--fg)] transition-colors hard-shadow"
            >
              {copy.transmit.links.github}
            </a>
            <a 
              href={copy.meta.linkedin} 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-[var(--rule)] text-[var(--fg)] font-body font-medium text-[var(--step-0)] hover:border-[var(--fg)] hover:text-[var(--fg)] transition-colors hard-shadow"
            >
              {copy.transmit.links.linkedin}
            </a>
            <a 
              href="/Balavanth_Resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer"
              className="px-6 py-3 border-2 border-[var(--rule)] text-[var(--fg)] font-body font-medium text-[var(--step-0)] hover:border-[var(--fg)] hover:text-[var(--fg)] transition-colors hard-shadow"
            >
              {copy.transmit.links.resume}
            </a>
            {copy.meta.email && (
              <button
                onClick={handleCopyEmail}
                className="px-6 py-3 border-2 border-[var(--rule)] text-[var(--fg)] font-body font-medium text-[var(--step-0)] hover:border-[var(--fg)] hover:text-[var(--fg)] transition-colors hard-shadow"
              >
                {copied ? 'Copied!' : copy.transmit.links.copyEmail}
              </button>
            )}
          </div>

          <LiveClock />

          <div className="mt-16 pt-8 border-t border-[var(--rule)]">
            <p className="font-mono uppercase-tracked text-[var(--fg-muted)] text-center">
              {copy.transmit.footer.copyright}
            </p>
            <p className="font-mono uppercase-tracked text-[var(--fg-muted)] text-center mt-2">
              {copy.transmit.footer.buildStamp}
            </p>
          </div>
        </div>
      </div>

      {/* Back to top — compass rose icon */}
      <a 
        href="#index" 
        className="fixed bottom-6 left-1/2 -translate-x-1/2 z-20 w-12 h-12 rounded-full border-2 border-[var(--rule)] bg-[var(--bg)] flex items-center justify-center text-[var(--fg-muted)] hover:text-[var(--signal)] hover:border-[var(--signal)] transition-all hard-shadow"
        aria-label="Back to Index"
      >
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" className="w-6 h-6" aria-hidden="true">
          <circle cx="12" cy="12" r="10" />
          <path d="M12 2v3M12 19v3M2 12h3M19 12h3" strokeWidth="1" />
          <path d="M12 7l1.5 3.5L12 12l-1.5-1.5z" fill="currentColor" stroke="none" />
          <path d="M12 17l-1.5-3.5L12 12l1.5 1.5z" fill="currentColor" stroke="none" />
        </svg>
      </a>
    </section>
  );
}
