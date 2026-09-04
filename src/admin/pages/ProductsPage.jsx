import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useToast } from "../context/ToastContext";
import { formatPrice } from "../../shared/format";
import ConfirmDialog from "../components/ConfirmDialog";
import ProductFormModal from "../components/ProductFormModal";

const ProductsPage = () => {
  const showToast = useToast();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("");
  const [editingProduct, setEditingProduct] = useState(undefined); // undefined = closed, null = new
  const [pendingDelete, setPendingDelete] = useState(null);

  useEffect(() => {
    api.get("admin/categories").then((data) => setCategories(data.categories));
  }, []);

  const load = () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (search) params.set("search", search);
    if (categoryFilter) params.set("category_id", categoryFilter);
    api
      .get(`admin/products?${params.toString()}`)
      .then((data) => setProducts(data.products))
      .finally(() => setLoading(false));
  };

  useEffect(load, [search, categoryFilter]);

  const toggleField = async (product, field) => {
    try {
      await api.put(`admin/products/${product.id}`, {
        category_id: product.category_id,
        name: product.name,
        description: product.description,
        price: product.price,
        is_active: field === "is_active" ? !product.is_active : !!product.is_active,
        is_available: field === "is_available" ? !product.is_available : !!product.is_available,
        is_featured: !!product.is_featured,
      });
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.del(`admin/products/${pendingDelete.id}`);
      showToast("Ürün silindi.");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-1 gap-2">
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Ürün ara..."
            className="w-full max-w-xs rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
          >
            <option value="">Tüm kategoriler</option>
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
        </div>
        <button
          type="button"
          onClick={() => setEditingProduct(null)}
          disabled={categories.length === 0}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-40"
        >
          + Yeni Ürün
        </button>
      </div>

      {categories.length === 0 && !loading ? (
        <p className="text-sm text-neutral-500">
          Önce en az bir kategori oluşturmalısınız.
        </p>
      ) : null}

      {loading ? (
        <p className="text-sm text-neutral-500">Yükleniyor...</p>
      ) : products.length === 0 ? (
        <p className="text-sm text-neutral-500">Ürün bulunamadı.</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {products.map((product) => (
            <li
              key={product.id}
              className="flex items-center gap-3 rounded-xl border border-neutral-200 bg-white p-3"
            >
              <div className="size-12 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
                {product.image_path ? (
                  <img src={product.image_path} alt="" className="size-full object-cover" />
                ) : null}
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate font-medium text-neutral-900">{product.name}</p>
                <p className="text-sm text-neutral-500">
                  {product.category_name} · {formatPrice(product.price)}
                </p>
              </div>
              <div className="flex shrink-0 flex-col items-end gap-1.5 sm:flex-row sm:items-center">
                <button
                  type="button"
                  onClick={() => toggleField(product, "is_available")}
                  className={
                    "rounded-lg px-2.5 py-1 text-xs font-semibold " +
                    (product.is_available
                      ? "bg-green-100 text-green-700"
                      : "bg-amber-100 text-amber-700")
                  }
                >
                  {product.is_available ? "Stokta" : "Tükendi"}
                </button>
                <button
                  type="button"
                  onClick={() => toggleField(product, "is_active")}
                  className={
                    "rounded-lg px-2.5 py-1 text-xs font-semibold " +
                    (product.is_active
                      ? "bg-neutral-100 text-neutral-700"
                      : "bg-neutral-200 text-neutral-500")
                  }
                >
                  {product.is_active ? "Görünür" : "Gizli"}
                </button>
                <div className="flex gap-1.5">
                  <button
                    type="button"
                    onClick={() => setEditingProduct(product)}
                    className="rounded-lg border border-neutral-200 px-2.5 py-1 text-sm text-neutral-600"
                  >
                    Düzenle
                  </button>
                  <button
                    type="button"
                    onClick={() => setPendingDelete(product)}
                    className="rounded-lg border border-neutral-200 px-2.5 py-1 text-sm text-red-600"
                  >
                    Sil
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}

      {editingProduct !== undefined ? (
        <ProductFormModal
          product={editingProduct}
          categories={categories}
          onClose={() => setEditingProduct(undefined)}
          onSaved={() => {
            setEditingProduct(undefined);
            showToast("Ürün kaydedildi.");
            load();
          }}
        />
      ) : null}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Ürünü sil"
        message={`"${pendingDelete?.name}" ürününü silmek istediğinize emin misiniz?`}
        confirmLabel="Sil"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default ProductsPage;
