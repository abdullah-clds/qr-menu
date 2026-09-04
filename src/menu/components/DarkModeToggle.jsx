const SunIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]">
    <circle cx="12" cy="12" r="4.2" />
    <path
      strokeLinecap="round"
      d="M12 2.5v2.2M12 19.3v2.2M4.9 4.9l1.6 1.6M17.5 17.5l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.9 19.1l1.6-1.6M17.5 6.5l1.6-1.6"
    />
  </svg>
);

const MoonIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]">
    <path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a7 7 0 0 0 10.5 10.5Z" strokeLinejoin="round" />
  </svg>
);

const DarkModeToggle = ({ isDark, onToggle }) => (
  <button
    type="button"
    onClick={onToggle}
    aria-label={isDark ? "Açık temaya geç" : "Koyu temaya geç"}
    aria-pressed={isDark}
    className="flex size-8 shrink-0 items-center justify-center rounded-full text-menu-ink/70 transition-colors hover:bg-menu-ink/5 hover:text-menu-ink"
  >
    {isDark ? <SunIcon /> : <MoonIcon />}
  </button>
);

export default DarkModeToggle;
