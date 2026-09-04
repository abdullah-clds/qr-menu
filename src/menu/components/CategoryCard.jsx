const CategoryCard = ({ category, onSelect, priority }) => {
  const { name, image, productCount } = category;

  return (
    <button
      type="button"
      onClick={() => onSelect(category)}
      className="menu-fade-in group relative block aspect-[8/5] w-full overflow-hidden rounded-menu-card text-left shadow-menu-card transition-transform focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-menu-hero"
    >
      {image ? (
        <img
          src={image}
          alt=""
          loading={priority ? "eager" : "lazy"}
          fetchPriority={priority ? "high" : undefined}
          className="absolute inset-0 size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
        />
      ) : (
        <div className="absolute inset-0 bg-menu-hero">
          <div
            className="absolute inset-0 opacity-[0.15]"
            style={{
              backgroundImage:
                "radial-gradient(circle at 1px 1px, #ffffff 1px, transparent 0)",
              backgroundSize: "18px 18px",
            }}
          />
        </div>
      )}

      <div
        className="absolute inset-0"
        style={{ background: "linear-gradient(180deg, transparent 35%, rgba(15,23,42,0.85) 100%)" }}
      />

      <div className="absolute inset-x-0 bottom-0 p-4 sm:p-5">
        <p className="text-[10px] font-semibold uppercase tracking-[0.25em] text-white/70">
          {productCount} ürün
        </p>
        <h3 className="mt-1 break-words font-display text-xl font-extrabold leading-tight text-white sm:text-2xl">
          {name}
        </h3>
      </div>
    </button>
  );
};

export default CategoryCard;
