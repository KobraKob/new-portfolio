import { NavLink, useLocation } from 'react-router-dom';
import { useState } from 'react';
import { copy } from '../content/copy';
import { cn } from '../lib/utils';

export function Navigation() {
  const location = useLocation();
  const sections = copy.nav.sections;
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <nav 
        className="fixed left-0 top-0 z-40 h-screen w-20 overflow-hidden border-r border-[var(--rule)] bg-[var(--bg)] transition-theme hidden md:block"
        aria-label="Main navigation"
      >
        <ul className="flex h-full w-full flex-col items-center justify-center gap-6 px-1">
        {sections.map((section) => (
          <li key={section.id}>
            <NavLink
              to={`/${section.id === 'index' ? '' : section.id}`}
              className={({ isActive }) => cn(
                'relative w-full h-10 flex items-center justify-center',
                'font-mono uppercase-tracked text-[var(--fg-muted)] transition-colors',
                'hover:text-[var(--fg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--signal)] focus-visible:ring-offset-2 focus-visible:ring-offset-[var(--bg)] rounded-sm',
                isActive && 'text-[var(--signal)]'
              )}
              aria-current={location.pathname === `/${section.id === 'index' ? '' : section.id}` ? 'page' : undefined}
            >
              <span className="writing-mode-vertical-rl text-orientation-mixed">
                {section.label}
              </span>
              {location.pathname === `/${section.id === 'index' ? '' : section.id}` && (
                <span 
                  className="absolute left-full ml-2 w-1.5 h-1.5 rounded-full bg-[var(--signal)]"
                  aria-hidden="true"
                />
              )}
            </NavLink>
          </li>
        ))}
        </ul>
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-px h-24 bg-[var(--rule)]" aria-hidden="true" />
      </nav>

      <nav className="fixed inset-x-0 bottom-0 z-40 md:hidden" aria-label="Mobile navigation">
        {isOpen && (
          <div className="border-t border-[var(--rule)] bg-[var(--bg)] px-5 pb-5 pt-4 shadow-[0_-4px_0_0_var(--rule)]">
            <p className="mb-3 font-mono text-[var(--step--1)] tracking-[0.12em] text-[var(--fg-muted)]">MAP INDEX</p>
            <ul className="grid grid-cols-2 gap-x-4 border-t border-[var(--rule)] pt-3">
              {sections.map((section) => (
                <li key={section.id}>
                  <NavLink
                    to={`/${section.id === 'index' ? '' : section.id}`}
                    onClick={() => setIsOpen(false)}
                    className={({ isActive }) => cn(
                      'block border-b border-[var(--rule)] py-3 font-mono text-[var(--step--1)] tracking-[0.08em]',
                      isActive ? 'text-[var(--signal)]' : 'text-[var(--fg)]'
                    )}
                  >
                    {section.label}
                  </NavLink>
                </li>
              ))}
            </ul>
          </div>
        )}
        <button
          type="button"
          onClick={() => setIsOpen((open) => !open)}
          aria-expanded={isOpen}
          className="ml-4 mb-4 border-2 border-[var(--fg)] bg-[var(--bg)] px-5 py-3 font-mono text-[var(--step--1)] tracking-[0.12em] text-[var(--fg)] shadow-[4px_4px_0_0_var(--signal)]"
        >
          {isOpen ? 'CLOSE MAP' : 'MAP'}
        </button>
      </nav>
    </>
  );
}
