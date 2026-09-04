import { forwardRef } from "react";
import ProductRow from "./ProductRow";

const CategorySection = forwardRef(({ index, category, products, currency }, ref) => (
  <section ref={ref} id={`category-${category.id}`} className="scroll-mt-28 px-6 py-7">
    <div className="mb-1 flex items-baseline gap-2.5 border-b border-menu-line pb-3">
      <span className="font-display text-sm text-menu-muted">
        {String(index + 1).padStart(2, "0")}
      </span>
      <h2 className="font-display text-2xl uppercase tracking-[0.03em] text-menu-ink">
        {category.name}
      </h2>
    </div>
    {category.description ? (
      <p className="mb-1 mt-2 text-sm leading-relaxed text-menu-muted">{category.description}</p>
    ) : null}

    <ul>
      {products.map((product) => (
        <ProductRow key={product.id} product={product} currency={currency} />
      ))}
    </ul>
  </section>
));

CategorySection.displayName = "CategorySection";

export default CategorySection;
