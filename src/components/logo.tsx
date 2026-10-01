export function Logo({ size = 28, className }: { size?: number; className?: string }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 32 32"
      fill="none"
      aria-hidden
      className={className}
      focusable="false"
    >
      <rect width="32" height="32" rx="7.5" fill="var(--sp-accent)" />
      <path
        d="M16 6.8c-3.52 0-6.37 2.78-6.37 6.21 0 4.5 5.37 9.92 5.92 10.46a.64.64 0 0 0 .9 0c.55-.54 5.92-5.96 5.92-10.46 0-3.43-2.85-6.21-6.37-6.21Z"
        fill="none"
        stroke="#fff"
        strokeWidth="1.8"
      />
      <path d="M13.4 12.2h5.2M13.4 15.05h3.3" stroke="#fff" strokeWidth="1.6" strokeLinecap="round" />
      <circle cx="16" cy="26.1" r="1.45" fill="#fff" fillOpacity="0.85" />
    </svg>
  );
}
