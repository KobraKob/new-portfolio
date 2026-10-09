export function GrainOverlay() {
  return (
    <div 
      className="grain-overlay fixed inset-0 pointer-events-none z-[9999]"
      aria-hidden="true"
      style={{ opacity: 0.035 }}
    />
  );
}