import { useEffect, useState } from "react";

const DISPLAY_MS = 1400;
const FADE_MS = 320;

/**
 * Brief brand splash shown every time /menu loads — a placeholder for the
 * restaurant's real intro treatment later. Auto-dismisses; tap anywhere to
 * skip. Never blocks menu data from loading in the background.
 */
const MenuIntro = ({ restaurantName, logo, onDone }) => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setVisible(false), DISPLAY_MS);
    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (visible) return undefined;
    const timer = setTimeout(onDone, FADE_MS);
    return () => clearTimeout(timer);
  }, [visible, onDone]);

  const initial = (restaurantName || "R").trim().charAt(0).toUpperCase();

  return (
    <button
      type="button"
      onClick={() => setVisible(false)}
      aria-label="Menüye geç"
      className={
        "fixed inset-0 z-50 flex w-full flex-col items-center justify-center gap-3 bg-menu-bg transition-opacity ease-out " +
        (visible ? "opacity-100 duration-200" : "pointer-events-none opacity-0 duration-300")
      }
      style={{ transitionDuration: visible ? undefined : `${FADE_MS}ms` }}
    >
      <div className="aura-fade-in flex flex-col items-center gap-3">
        {logo ? (
          <img
            src={logo}
            alt={restaurantName || "Logo"}
            className="size-16 rounded-full object-cover"
          />
        ) : (
          <div className="flex size-16 items-center justify-center rounded-full border border-menu-ink/15">
            <span className="font-display text-2xl text-menu-ink">{initial}</span>
          </div>
        )}
        <p className="font-display text-lg uppercase tracking-[0.15em] text-menu-ink">
          {restaurantName || "Restoran"}
        </p>
      </div>
      <span className="mt-6 text-[11px] uppercase tracking-[0.2em] text-menu-muted">
        Devam etmek için dokun
      </span>
    </button>
  );
};

export default MenuIntro;
