import ProductRow from "./ProductRow";
import { ChevronLeftIcon } from "./icons";
import { EmptyState } from "./StatusStates";

const CategoryDetail = ({ category, products, currency, onBack }) => (
  <section className="px-4 pb-10 pt-5 sm:px-6 sm:pt-6">
    <div className="mx-auto max-w-3xl">
      <button
        type="button"
        onClick={onBack}
        className="inline-flex items-center gap-1 rounded-full py-2 pr-3 text-sm font-semibold text-menu-text-muted transition-colors hover:text-menu-text"
      >
        <ChevronLeftIcon className="size-5" />
        Kategorilere Dön
      </button>

      <div className="mt-2 flex items-baseline justify-between gap-3">
        <h1 className="break-words font-display text-2xl font-extrabold tracking-tight text-menu-text sm:text-3xl">
          {category.name}
        </h1>
        <span className="shrink-0 text-sm font-medium text-menu-text-muted">
          {products.length} ürün
        </span>
      </div>
      {category.description ? (
        <p className="mt-2 text-sm leading-relaxed text-menu-text-muted">{category.description}</p>
      ) : null}

      {products.length === 0 ? (
        <EmptyState message="Bu kategoride henüz ürün yok." />
      ) : (
        <ul className="mt-5 flex flex-col gap-3">
          {products.map((product) => (
            <ProductRow key={product.id} product={product} currency={currency} />
          ))}
        </ul>
      )}
    </div>
  </section>
);

export default CategoryDetail;
