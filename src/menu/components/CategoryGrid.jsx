import CategoryCard from "./CategoryCard";

const CategoryGrid = ({ categories, onSelect }) => (
  <section className="px-4 py-8 sm:px-6 sm:py-10">
    <div className="mx-auto max-w-6xl">
      <h2 className="font-display text-2xl font-extrabold tracking-tight text-menu-text sm:text-3xl">
        Kategoriler
      </h2>
      <p className="mt-1.5 text-sm text-menu-text-muted">
        Ürünleri görmek için bir kategori seç.
      </p>

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <CategoryCard
            key={category.id}
            category={category}
            onSelect={onSelect}
            priority={index < 3}
          />
        ))}
      </div>
    </div>
  </section>
);

export default CategoryGrid;
