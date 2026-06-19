export function HeroFallback() {
  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg
        viewBox="0 0 300 300"
        className="w-64 h-64 opacity-80"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Icosahedron-like wireframe for mobile */}
        <g stroke="var(--theme-accent)" strokeWidth="0.8" fill="none" opacity="0.9">
          <polygon points="150,20 260,90 230,210 70,210 40,90" />
          <polygon points="150,20 230,210 70,210" />
          <line x1="150" y1="20" x2="150" y2="280" />
          <line x1="40" y1="90" x2="260" y2="90" />
          <line x1="70" y1="210" x2="260" y2="90" />
          <line x1="230" y1="210" x2="40" y2="90" />
          <circle cx="150" cy="150" r="100" strokeDasharray="4 8" opacity="0.3" />
        </g>

        {/* Accent dots / satellites */}
        <circle cx="150" cy="20"  r="4" fill="var(--theme-accent)" />
        <circle cx="260" cy="90"  r="3" fill="var(--theme-secondary)" />
        <circle cx="40"  cy="90"  r="3" fill="#0055FF" />

        {/* Center glow */}
        <circle cx="150" cy="150" r="8" fill="var(--theme-accent)" opacity="0.6" />
      </svg>
    </div>
  )
}

export default HeroFallback
