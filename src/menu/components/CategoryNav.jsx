const CategoryNav = ({ categories, activeId, onSelect }) => (
  <nav
    className="no-scrollbar flex min-w-0 flex-1 gap-5 overflow-x-auto"
    aria-label="Kategoriler"
    role="tablist"
  >
    {categories.map((category) => {
      const isActive = category.id === activeId;
      return (
        <button
          key={category.id}
          type="button"
          role="tab"
          aria-selected={isActive}
          onClick={() => onSelect(category.id)}
          className={
            "shrink-0 whitespace-nowrap border-b-2 py-2.5 text-[13px] font-medium uppercase tracking-[0.12em] transition-colors " +
            (isActive
              ? "border-menu-ink text-menu-ink"
              : "border-transparent text-menu-muted hover:text-menu-ink")
          }
        >
          {category.name}
        </button>
      );
    })}
  </nav>
);

export default CategoryNav;
