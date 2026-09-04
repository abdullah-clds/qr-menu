import { formatPrice } from "../../shared/format";

const ProductRow = ({ product, currency }) => {
  const { name, description, price, image, available } = product;

  return (
    <li className="menu-fade-in flex gap-3.5 rounded-[1.75rem] border border-menu-line bg-menu-surface p-3.5 sm:gap-4 sm:p-4">
      {image ? (
        <img
          src={image}
          alt=""
          loading="lazy"
          decoding="async"
          className="size-20 shrink-0 rounded-2xl object-cover sm:size-24"
          style={available ? undefined : { opacity: 0.5 }}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h3 className="min-w-0 break-words font-display text-base font-bold text-menu-text sm:text-lg">
            {name}
          </h3>
          <span className="shrink-0 whitespace-nowrap font-display text-base font-extrabold tabular-nums text-menu-text sm:text-lg">
            {formatPrice(price, currency)}
          </span>
        </div>

        {description ? (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-menu-text-muted">
            {description}
          </p>
        ) : null}

        {!available ? (
          <span className="mt-2 inline-block rounded-full bg-menu-hero/8 px-2.5 py-1 text-[11px] font-semibold uppercase tracking-[0.08em] text-menu-text-muted">
            Tükendi
          </span>
        ) : null}
      </div>
    </li>
  );
};

export default ProductRow;
