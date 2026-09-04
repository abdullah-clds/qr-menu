const PhoneIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[15px]">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M3 5.5c0-1.1.9-2 2-2h2.3c.5 0 1 .4 1.1.9l.9 3.6c.1.4-.1.9-.4 1.1L7.5 10c1 2.4 2.9 4.3 5.3 5.3l.9-1.4c.3-.4.7-.5 1.1-.4l3.6.9c.5.1.9.6.9 1.1V18c0 1.1-.9 2-2 2h-1C9.5 20 4 14.5 4 7.5v-1Z"
    />
  </svg>
);

const PinIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[15px]">
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      d="M12 21s7-6.1 7-11.5A7 7 0 0 0 5 9.5C5 14.9 12 21 12 21Z"
    />
    <circle cx="12" cy="9.5" r="2.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const ClockIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[15px]">
    <circle cx="12" cy="12" r="8.5" strokeLinecap="round" strokeLinejoin="round" />
    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4.3l3 1.7" />
  </svg>
);

const InstagramIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-4">
    <rect x="3.5" y="3.5" width="17" height="17" rx="4.5" />
    <circle cx="12" cy="12" r="3.7" />
    <circle cx="16.8" cy="7.2" r="0.6" fill="currentColor" stroke="none" />
  </svg>
);

const MenuFooter = ({ settings }) => {
  const { restaurantName, phone, address, instagram, openingHours } = settings;

  if (!phone && !address && !instagram && !openingHours) return null;

  return (
    <footer className="mt-4 border-t border-menu-line px-6 py-8 text-center">
      {restaurantName ? (
        <p className="font-display text-sm uppercase tracking-[0.15em] text-menu-ink">
          {restaurantName}
        </p>
      ) : null}

      <div className="mt-3 flex flex-col items-center gap-1.5 text-sm text-menu-muted">
        {address ? (
          <p className="flex items-center gap-1.5">
            <PinIcon />
            {address}
          </p>
        ) : null}
        {openingHours ? (
          <p className="flex items-center gap-1.5">
            <ClockIcon />
            {openingHours}
          </p>
        ) : null}
        {phone ? (
          <a href={`tel:${phone.replace(/\s+/g, "")}`} className="flex items-center gap-1.5">
            <PhoneIcon />
            {phone}
          </a>
        ) : null}
      </div>

      {instagram ? (
        <a
          href={instagram}
          target="_blank"
          rel="noreferrer noopener"
          aria-label="Instagram"
          className="mt-4 inline-flex size-8 items-center justify-center rounded-full border border-menu-ink/15 text-menu-ink/70 transition-colors hover:text-menu-ink"
        >
          <InstagramIcon />
        </a>
      ) : null}
    </footer>
  );
};

export default MenuFooter;
