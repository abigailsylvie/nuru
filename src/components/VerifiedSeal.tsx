type VerifiedSealProps = {
  size?: number;
  className?: string;
};

/**
 * The seal is Nuru's signature mark: a verification check ringed by short
 * ticks that read as both a stamp of authenticity and a radiating light —
 * tying the brand name (Nuru = light) to the product's core promise
 * (every listing and every landlord is verified).
 */
export function VerifiedSeal({ size = 20, className = "" }: VerifiedSealProps) {
  const ticks = Array.from({ length: 12 });
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 40 40"
      fill="none"
      className={className}
      aria-hidden="true"
    >
      {ticks.map((_, i) => {
        const angle = (i * 360) / ticks.length;
        return (
          <line
            key={i}
            x1="20"
            y1="2.5"
            x2="20"
            y2="5.5"
            stroke="currentColor"
            strokeWidth="1.6"
            strokeLinecap="round"
            transform={`rotate(${angle} 20 20)`}
            opacity={0.55}
          />
        );
      })}
      <circle cx="20" cy="20" r="12.5" fill="currentColor" />
      <path
        d="M14.5 20.2L18 23.7L25.5 15.8"
        stroke="var(--color-paper)"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </svg>
  );
}
