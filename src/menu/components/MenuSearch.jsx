import { useEffect, useRef, useState } from "react";

const SearchIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]">
    <circle cx="11" cy="11" r="6.5" strokeLinecap="round" strokeLinejoin="round" />
    <path d="M20 20l-4.3-4.3" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const CloseIcon = () => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="size-[18px]">
    <path d="M6 6l12 12M18 6L6 18" strokeLinecap="round" strokeLinejoin="round" />
  </svg>
);

const MenuSearch = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const inputRef = useRef(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  const close = () => {
    setOpen(false);
    onChange("");
  };

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        aria-label="Menüde ara"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-menu-ink/70 transition-colors hover:bg-menu-ink/5 hover:text-menu-ink"
      >
        <SearchIcon />
      </button>
    );
  }

  return (
    <div className="flex shrink-0 items-center gap-1.5">
      <input
        ref={inputRef}
        type="search"
        inputMode="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Ara..."
        aria-label="Menüde ara"
        className="w-36 border-b border-menu-ink/25 bg-transparent px-0.5 py-1 text-sm text-menu-ink outline-none placeholder:text-menu-muted focus:border-menu-ink sm:w-48"
      />
      <button
        type="button"
        onClick={close}
        aria-label="Aramayı kapat"
        className="flex size-8 shrink-0 items-center justify-center rounded-full text-menu-ink/60 hover:bg-menu-ink/5"
      >
        <CloseIcon />
      </button>
    </div>
  );
};

export default MenuSearch;
