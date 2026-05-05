export default function HeroGridBackground() {
  return (
    <svg
      aria-hidden
      className="text-primary/75 dark:text-primary pointer-events-none absolute inset-0 size-full [mask-image:linear-gradient(to_bottom,black,transparent_88%)]"
    >
      <defs>
        <pattern
          id="hero-grid"
          width="48"
          height="48"
          patternUnits="userSpaceOnUse"
        >
          <path
            d="M 48 0 L 0 0 0 48"
            fill="none"
            stroke="currentColor"
            strokeOpacity="0.32"
            strokeWidth="1"
          />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hero-grid)" />
    </svg>
  );
}
