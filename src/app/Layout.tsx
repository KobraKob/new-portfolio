import { Outlet, useLocation } from 'react-router-dom';
import { Navigation } from '../components/Navigation';
import { ThemeToggle } from '../components/ThemeToggle';
import { CommandPalette } from '../components/CommandPalette';
import { GrainOverlay } from '../components/GrainOverlay';
import { LiveClock } from '../components/LiveClock';
import { MapInstrumentation } from '../components/MapInstrumentation';

export function Layout() {
  const location = useLocation();

  const isTransmit = location.pathname === '/transmit';

  return (
    <div className="min-h-screen relative transition-theme">
      <GrainOverlay />
      <MapInstrumentation />
      <a href="#main" className="skip-link">
        Skip to main content
      </a>
      
      <Navigation />
      
      <ThemeToggle />
      
      <CommandPalette />
      
      <main id="main" className="relative z-10 md:pl-20">
        <Outlet />
      </main>
      
      {!isTransmit && (
        <footer className="border-t border-[var(--rule)] py-6 px-6 transition-theme md:pl-24">
          <div className="container flex flex-col md:flex-row md:items-center md:justify-between gap-4">
            <p className="font-mono uppercase-tracked text-[var(--fg-muted)] text-center md:text-left">
              © 2026 Balavanth · Bengaluru · 12.9716° N, 77.5946° E
            </p>
            <LiveClock />
          </div>
        </footer>
      )}
    </div>
  );
}
