import { copy } from '../content/copy';
import { useTheme } from '../app/ThemeProvider';
import { useState, useRef, useEffect } from 'react';

// Visual Bible assets — WebP with small-screen variants; PNG fallbacks referenced as URL strings
import scenesWebp      from '../assets/erevan-scenes.webp';
import scenesSmWebp    from '../assets/erevan-scenes-sm.webp';
import charWebp        from '../assets/erevan-character.webp';
import charSmWebp      from '../assets/erevan-character-sm.webp';
import birdWebp        from '../assets/erevan-creature.webp';
import birdSmWebp      from '../assets/erevan-creature-sm.webp';
import worldVideo      from '../assets/erevan-world-opt.mp4';
import worldPoster     from '../assets/erevan-world-poster.jpg';

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
          <h2
            id="erevan-title"
            className="font-display fraunces-ground text-[var(--fg)]"
            style={{ fontSize: 'var(--step-5)' }}
          >
            {copy.erevan.subtitle}
          </h2>
        </header>

        {/* Book spread + meta sidebar */}
        <div className="grid-12 gap-8 items-start mb-16">
          <div className="col-span-12 lg:col-span-8">
            <BookSpread novel={copy.erevan.novel} />
          </div>
          <div className="col-span-12 lg:col-span-4 flex flex-col gap-6">
            <NovelMeta novel={copy.erevan.novel} />
          </div>
        </div>

        {/* Visual Bible — full width below */}
        <VisualBible />
      </div>
    </section>
  );
}

/* ─── Book Spread ─────────────────────────────────────────────────────────── */

interface BookSpreadProps {
  novel: typeof copy.erevan.novel;
}

const DARK_BG      = '#0F0E0C';
const DARK_FG      = '#E9E2D0';
const DARK_FG_MUTED = '#9A9384';
const DARK_RULE    = 'rgba(233,226,208,0.14)';

function BookSpread({ novel }: BookSpreadProps) {
  useTheme();

  const midpoint   = Math.floor(novel.excerpt.length / 2);
  const firstHalf  = novel.excerpt.slice(0, midpoint);
  const secondHalf = novel.excerpt.slice(midpoint);

  return (
    <article
      className="relative border overflow-hidden"
      style={{ aspectRatio: '1.414 / 1', backgroundColor: DARK_BG, color: DARK_FG, borderColor: DARK_RULE } as React.CSSProperties}
      role="region"
      aria-label="Novel excerpt spread"
    >
      {/* Paper grain + spine */}
      <div className="absolute inset-0 pointer-events-none" aria-hidden="true">
        <svg className="w-full h-full" viewBox="0 0 800 566" preserveAspectRatio="none">
          <defs>
            <pattern id="paper-grain-erevan" patternUnits="userSpaceOnUse" width="4" height="4">
              <path d="M0,0 L4,4 M4,0 L0,4" stroke={DARK_RULE} strokeWidth="0.2" fill="none" opacity="0.2" />
            </pattern>
          </defs>
          <rect width="800" height="566" fill="url(#paper-grain-erevan)" />
          <line x1="400" y1="40" x2="400" y2="526" stroke={DARK_RULE} strokeWidth="2" vectorEffect="non-scaling-stroke" />
          <g fontFamily="JetBrains Mono" fontSize="9" fill={DARK_FG_MUTED} textAnchor="middle">
            <text x="200" y="30" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>THE BOUND AND THE HOLLOW</text>
            <text x="600" y="30" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>EREVAN</text>
            <text x="200" y="546" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>P. 1</text>
            <text x="600" y="546" style={{ textTransform: 'uppercase', letterSpacing: '0.08em' }}>P. 2</text>
          </g>
        </svg>
      </div>

      <div className="relative z-10 h-full grid grid-cols-2">
        {/* Left page */}
        <div className="p-6 md:p-10 flex flex-col gap-4 overflow-hidden">
          <span className="font-display fraunces-erevan block" style={{ color: DARK_FG_MUTED, fontSize: 'var(--step-0)', fontStyle: 'italic' }}>
            Chapter One
          </span>
          <p className="flex-1 font-body overflow-hidden" style={{ color: DARK_FG, fontSize: 'var(--step-0)', lineHeight: '1.7', display: '-webkit-box', WebkitLineClamp: 9, WebkitBoxOrient: 'vertical' }}>
            {firstHalf}
          </p>
          <div className="flex items-end justify-between pt-4" style={{ borderTop: `1px solid ${DARK_RULE}` }}>
            <span className="font-mono uppercase-tracked" style={{ color: DARK_FG_MUTED, fontSize: 'var(--step--1)' }}>{novel.status}</span>
            <span className="font-mono uppercase-tracked" style={{ color: DARK_FG_MUTED, fontSize: 'var(--step--1)' }}>Roen Dourne</span>
          </div>
        </div>

        {/* Right page */}
        <div className="p-6 md:p-10 flex flex-col gap-4 overflow-hidden" style={{ borderLeft: `1px solid ${DARK_RULE}` }}>
          <span className="font-display fraunces-erevan block" style={{ color: DARK_FG_MUTED, fontSize: 'var(--step-0)', fontStyle: 'italic' }}>
            Chapter Two
          </span>
          <p className="flex-1 font-body overflow-hidden" style={{ color: DARK_FG, fontSize: 'var(--step-0)', lineHeight: '1.7', display: '-webkit-box', WebkitLineClamp: 9, WebkitBoxOrient: 'vertical' }}>
            {secondHalf}
          </p>
          <div className="flex items-end justify-between pt-4" style={{ borderTop: `1px solid ${DARK_RULE}` }}>
            <span className="font-mono uppercase-tracked" style={{ color: DARK_FG_MUTED, fontSize: 'var(--step--1)' }}>Visual Bible →</span>
            <span className="font-mono uppercase-tracked" style={{ color: DARK_FG_MUTED, fontSize: 'var(--step--1)' }}>P. 3</span>
          </div>
        </div>
      </div>
    </article>
  );
}

/* ─── Novel Meta ──────────────────────────────────────────────────────────── */

interface NovelMetaProps {
  novel: typeof copy.erevan.novel;
}

function NovelMeta({ novel }: NovelMetaProps) {
  return (
    <div className="bg-[var(--bg)] border border-[var(--rule)] p-6 hard-shadow">
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
          <dd className="font-body text-[var(--fg-muted)] italic leading-relaxed">{novel.premise}</dd>
        </div>
      </dl>
    </div>
  );
}

/* ─── Visual Bible ────────────────────────────────────────────────────────── */

const visualBibleFrames = [
  {
    id: 'scenes',
    label: 'Scene Studies',
    caption: 'Ch. 2 · Ch. 6 · Ch. 7',
    type: 'image' as const,
    webp: scenesWebp,
    webpSm: scenesSmWebp,
    fallback: scenesWebp, // WebP is the authoritative source; PNG not bundled
    alt: 'Scene illustrations: Discovery in Sundermark, Inside the Archive, The Silence of the Hollow',
    span: 'col-span-12 md:col-span-8',
  },
  {
    id: 'character',
    label: 'Roen Dourne',
    caption: 'Character study',
    type: 'image' as const,
    webp: charWebp,
    webpSm: charSmWebp,
    fallback: charWebp,
    alt: 'Character study of Roen Dourne — full body and close-up',
    span: 'col-span-12 md:col-span-4',
  },
  {
    id: 'creature',
    label: 'The White Bird',
    caption: 'Creature sheet',
    type: 'image' as const,
    webp: birdWebp,
    webpSm: birdSmWebp,
    fallback: birdWebp,
    alt: 'Creature concept sheet for the white bird of Erevan — multiple angles',
    span: 'col-span-12 md:col-span-6',
  },
  {
    id: 'world',
    label: 'World Reel',
    caption: 'Motion study',
    type: 'video' as const,
    src: worldVideo,
    poster: worldPoster,
    span: 'col-span-12 md:col-span-6',
  },
] as const;

function VisualBible() {
  const [lightbox, setLightbox] = useState<null | typeof visualBibleFrames[number]>(null);

  return (
    <section aria-labelledby="visual-bible-title">
      {/* Section header */}
      <header className="mb-8 pb-4 border-b border-[var(--rule)] flex items-baseline justify-between">
        <h3
          id="visual-bible-title"
          className="font-mono uppercase-tracked text-[var(--signal)]"
          style={{ fontSize: 'var(--step-0)' }}
        >
          {copy.erevan.visualBible.label}
        </h3>
        <span className="font-mono uppercase-tracked text-[var(--fg-muted)]" style={{ fontSize: 'var(--step--1)' }}>
          {visualBibleFrames.length} frames
        </span>
      </header>

      {/* Grid of frames */}
      <div className="grid-12 gap-4">
        {visualBibleFrames.map((frame) => (
          <VisualBibleFrame
            key={frame.id}
            frame={frame}
            onOpen={() => setLightbox(frame)}
          />
        ))}
      </div>

      {/* Lightbox */}
      {lightbox && (
        <Lightbox frame={lightbox} onClose={() => setLightbox(null)} />
      )}
    </section>
  );
}

type Frame = typeof visualBibleFrames[number];

function VisualBibleFrame({ frame, onOpen }: { frame: Frame; onOpen: () => void }) {
  const videoRef = useRef<HTMLVideoElement>(null);

  // Only autoplay video when it enters the viewport, and respect reduced-motion
  useEffect(() => {
    if (frame.type !== 'video') return;
    const video = videoRef.current;
    if (!video) return;

    const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) return; // leave paused for reduced-motion users

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          video.play().catch(() => {/* browser policy, ignore */});
        } else {
          video.pause();
        }
      },
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [frame.type]);

  return (
    <button
      type="button"
      className={`${frame.span} relative group overflow-hidden border border-[var(--rule)] hard-shadow focus-visible:outline-2 focus-visible:outline-[var(--signal)] focus-visible:outline-offset-2`}
      style={{ aspectRatio: frame.id === 'character' ? '3/4' : '16/9' }}
      onClick={onOpen}
      aria-label={`View ${frame.label} — ${frame.caption}`}
    >
      {frame.type === 'image' ? (
        <picture>
          <source
            srcSet={`${'webpSm' in frame ? frame.webpSm : ''} 700w, ${'webp' in frame ? frame.webp : ''} 1400w`}
            type="image/webp"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 66vw, 50vw"
          />
          <img
            src={'fallback' in frame ? frame.fallback : ''}
            alt={frame.alt}
            className="w-full h-full object-cover transition-transform duration-480 group-hover:scale-[1.02]"
            loading="lazy"
            decoding="async"
          />
        </picture>
      ) : (
        <video
          ref={videoRef}
          src={frame.src}
          poster={frame.poster}
          className="w-full h-full object-cover"
          loop
          muted
          playsInline
          preload="none"
          aria-label={frame.label}
        />
      )}

      <div className="absolute inset-0 bg-[var(--fg)]/0 group-hover:bg-[var(--fg)]/10 transition-colors duration-240 pointer-events-none" aria-hidden="true" />
      <div className="absolute bottom-0 left-0 right-0 flex items-end justify-between px-4 py-3 bg-[#0F0E0C]/80">
        <span className="font-mono uppercase-tracked text-[#E9E2D0]" style={{ fontSize: 'var(--step--1)' }}>
          {frame.label}
        </span>
        <span className="font-mono uppercase-tracked text-[#9A9384]" style={{ fontSize: 'var(--step--1)' }}>
          {frame.caption}
        </span>
      </div>

      <div className="absolute top-3 right-3 w-7 h-7 border border-[#9A9384]/60 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-240" aria-hidden="true">
        <svg viewBox="0 0 16 16" fill="none" stroke="#E9E2D0" strokeWidth="1.2" className="w-3.5 h-3.5">
          <path d="M10 2h4v4M6 14H2v-4M14 2l-5 5M2 14l5-5" />
        </svg>
      </div>
    </button>
  );
}

function Lightbox({ frame, onClose }: { frame: Frame; onClose: () => void }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-[#0F0E0C]/92 p-4 md:p-8"
      role="dialog"
      aria-modal="true"
      aria-label={`${frame.label} — ${frame.caption}`}
      onClick={onClose}
    >
      <div
        className="relative max-w-5xl w-full max-h-[90vh] flex flex-col gap-4"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          type="button"
          className="absolute -top-10 right-0 font-mono uppercase-tracked text-[#9A9384] hover:text-[#E9E2D0] transition-colors"
          style={{ fontSize: 'var(--step--1)' }}
          onClick={onClose}
          aria-label="Close"
        >
          ESC / CLOSE ✕
        </button>

        {/* Media */}
        <div className="border border-[rgba(233,226,208,0.14)] overflow-hidden">
          {frame.type === 'image' ? (
            <img
              src={frame.src}
              alt={frame.alt}
              className="w-full h-full object-contain max-h-[75vh]"
            />
          ) : (
            <video
              src={frame.src}
              className="w-full max-h-[75vh] object-contain"
              controls
              autoPlay
              loop
              muted
              playsInline
            />
          )}
        </div>

        {/* Caption bar */}
        <div className="flex items-center justify-between px-1">
          <span className="font-mono uppercase-tracked text-[#E9E2D0]" style={{ fontSize: 'var(--step--1)' }}>
            {frame.label}
          </span>
          <span className="font-mono uppercase-tracked text-[#9A9384]" style={{ fontSize: 'var(--step--1)' }}>
            {frame.caption}
          </span>
        </div>
      </div>
    </div>
  );
}
