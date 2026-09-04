const MenuHeader = ({ settings }) => {
  const { restaurantName, menuTitle, logo } = settings;
  const initial = (restaurantName || "R").trim().charAt(0).toUpperCase();

  return (
    <header className="flex flex-col items-center gap-3 px-6 pb-5 pt-9 text-center">
      {logo ? (
        <img
          src={logo}
          alt={restaurantName || "Logo"}
          className="size-12 rounded-full object-cover"
        />
      ) : (
        <div className="flex size-12 items-center justify-center rounded-full border border-menu-ink/15">
          <span className="font-display text-lg text-menu-ink">{initial}</span>
        </div>
      )}
      <div>
        <h1 className="font-display text-xl uppercase tracking-[0.08em] text-menu-ink">
          {restaurantName || "Restoran"}
        </h1>
        <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.4em] text-menu-muted">
          {menuTitle || "Menü"}
        </p>
      </div>
    </header>
  );
};

export default MenuHeader;
