export default function Background() {
  return (
    <div className="fixed inset-0 -z-10 overflow-hidden" aria-hidden="true">
      <div className="absolute inset-0 bg-[var(--bg-base)]" />
      <div
        className="absolute inset-0 opacity-80"
        style={{
          background:
            "linear-gradient(135deg, var(--glow-gold), transparent 32%, var(--glow-green) 68%, transparent)",
        }}
      />
      <div
        className="absolute inset-0 opacity-70"
        style={{
          background:
            "conic-gradient(from 210deg at 72% 18%, transparent, rgba(107,127,215,0.13), transparent 28%, rgba(232,184,102,0.09), transparent 58%)",
          filter: "blur(70px)",
        }}
      />
      <div
        className="absolute inset-0"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='0.035'/%3E%3C/svg%3E\")",
          opacity: 0.42,
        }}
      />
    </div>
  );
}
