import { formatPrice } from "../../shared/format";

const ProductRow = ({ product, currency }) => {
  const { name, description, price, image, available, featured } = product;

  return (
    <li className="menu-reveal flex gap-4 border-b border-menu-line py-4 last:border-b-0">
      {image ? (
        <img
          src={image}
          alt={name}
          loading="lazy"
          decoding="async"
          width={88}
          height={88}
          className="size-[76px] shrink-0 rounded-md bg-menu-line/40 object-cover sm:size-[88px]"
          style={available ? undefined : { opacity: 0.55 }}
        />
      ) : null}

      <div className="min-w-0 flex-1">
        <div className="flex items-baseline gap-2">
          <span className="min-w-0 font-medium text-menu-ink">{name}</span>
          <span
            aria-hidden="true"
            className="h-px flex-1 translate-y-[-4px] border-b border-dotted border-menu-ink/25"
          />
          <span className="shrink-0 font-medium tabular-nums text-menu-ink">
            {formatPrice(price, currency)}
          </span>
        </div>

        {description ? (
          <p className="mt-1 line-clamp-2 text-sm leading-relaxed text-menu-muted">
            {description}
          </p>
        ) : null}

        {featured || !available ? (
          <div className="mt-1.5 flex items-center gap-2">
            {featured ? (
              <span className="text-[11px] font-semibold uppercase tracking-[0.12em] text-menu-accent">
                Şefin Seçimi
              </span>
            ) : null}
            {!available ? (
              <span className="rounded border border-menu-ink/15 px-1.5 py-0.5 text-[11px] font-medium uppercase tracking-[0.08em] text-menu-muted">
                Tükendi
              </span>
            ) : null}
          </div>
        ) : null}
      </div>
    </li>
  );
};

export default ProductRow;
