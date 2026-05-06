export default function CtaTechBackground() {
  return (
    <svg
      aria-hidden
      className="text-primary pointer-events-none absolute inset-0 size-full"
      preserveAspectRatio="none"
      viewBox="0 0 1200 360"
    >
      <defs>
        <linearGradient id="cta-panel" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0%" stopColor="currentColor" stopOpacity="0.96" />
          <stop offset="58%" stopColor="currentColor" stopOpacity="0.88" />
          <stop offset="100%" stopColor="currentColor" stopOpacity="0.74" />
        </linearGradient>
        <radialGradient id="cta-cyan-glow" cx="22%" cy="18%" r="46%">
          <stop offset="0%" stopColor="#7dd3fc" stopOpacity="0.42" />
          <stop offset="100%" stopColor="#7dd3fc" stopOpacity="0" />
        </radialGradient>
        <radialGradient id="cta-emerald-glow" cx="82%" cy="78%" r="48%">
          <stop offset="0%" stopColor="#6ee7b7" stopOpacity="0.34" />
          <stop offset="100%" stopColor="#6ee7b7" stopOpacity="0" />
        </radialGradient>
        <linearGradient id="cta-cyan-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#bae6fd" stopOpacity="0" />
          <stop offset="50%" stopColor="#bae6fd" stopOpacity="0.82" />
          <stop offset="100%" stopColor="#bae6fd" stopOpacity="0" />
        </linearGradient>
        <linearGradient id="cta-emerald-line" x1="0" x2="1" y1="0" y2="0">
          <stop offset="0%" stopColor="#a7f3d0" stopOpacity="0" />
          <stop offset="54%" stopColor="#a7f3d0" stopOpacity="0.72" />
          <stop offset="100%" stopColor="#a7f3d0" stopOpacity="0" />
        </linearGradient>
      </defs>

      <rect width="1200" height="360" fill="url(#cta-panel)" />
      <rect width="1200" height="360" fill="url(#cta-cyan-glow)" />
      <rect width="1200" height="360" fill="url(#cta-emerald-glow)" />

      <g opacity="0.28" stroke="#ffffff" strokeWidth="1">
        <path d="M-80 300 240 -20" />
        <path d="M40 380 410 10" />
        <path d="M780 390 1190 -20" />
        <path d="M960 390 1290 60" />
      </g>

      <g fill="none" strokeLinecap="round">
        <path d="M0 1H1200" stroke="url(#cta-cyan-line)" />
        <path d="M120 359H1080" stroke="url(#cta-emerald-line)" />
        <path d="M0 188H220" stroke="url(#cta-cyan-line)" />
        <path d="M980 238H1200" stroke="url(#cta-emerald-line)" />
      </g>

      <g
        fill="none"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="1.5"
      >
        <path d="M74 86V42H204" stroke="#bae6fd" strokeOpacity="0.42" />
        <path d="M1126 274v44H996" stroke="#a7f3d0" strokeOpacity="0.38" />
        <path d="M108 122h88l28-28h86" stroke="#bae6fd" strokeOpacity="0.3" />
        <path d="M890 254h92l30-30h84" stroke="#a7f3d0" strokeOpacity="0.28" />
      </g>

      <g fill="#ffffff" opacity="0.52">
        <circle cx="224" cy="94" r="2" />
        <circle cx="310" cy="94" r="2" />
        <circle cx="982" cy="254" r="2" />
        <circle cx="1096" cy="224" r="2" />
      </g>
    </svg>
  );
}
