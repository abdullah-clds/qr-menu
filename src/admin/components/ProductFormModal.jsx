import { useState } from "react";
import { api } from "../api/client";
import { resizeImageFile } from "../utils/resizeImage";

const ProductFormModal = ({ product, categories, onClose, onSaved }) => {
  const isEdit = !!product;
  const [form, setForm] = useState({
    category_id: product?.category_id ?? categories[0]?.id ?? "",
    name: product?.name ?? "",
    description: product?.description ?? "",
    price: product?.price ?? "",
    is_active: product ? !!product.is_active : true,
    is_available: product ? !!product.is_available : true,
    is_featured: product ? !!product.is_featured : false,
  });
  const [imageFile, setImageFile] = useState(null);
  const [preview, setPreview] = useState(product?.image_path || null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);

  const handleFile = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setImageFile(file);
    setPreview(URL.createObjectURL(file));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = { ...form, category_id: Number(form.category_id) };
      const data = isEdit
        ? await api.put(`admin/products/${product.id}`, payload)
        : await api.post("admin/products", payload);

      const productId = data.product.id;

      if (imageFile) {
        const resized = await resizeImageFile(imageFile);
        const formData = new FormData();
        formData.append("image", resized);
        await api.upload(`admin/products/${productId}/image`, formData);
      }

      onSaved();
    } catch (err) {
      setError(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-0 sm:items-center sm:p-4">
      <form
        onSubmit={handleSubmit}
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-t-2xl bg-white p-5 shadow-xl sm:rounded-2xl"
      >
        <h3 className="mb-4 text-base font-semibold text-neutral-900">
          {isEdit ? "Ürünü Düzenle" : "Yeni Ürün"}
        </h3>

        <div className="flex flex-col gap-3">
          <label className="text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Kategori</span>
            <select
              value={form.category_id}
              onChange={(e) => setForm((f) => ({ ...f, category_id: e.target.value }))}
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
            >
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Ürün adı</span>
            <input
              type="text"
              value={form.name}
              onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Açıklama</span>
            <textarea
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              rows={2}
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Fiyat</span>
            <input
              type="number"
              step="0.01"
              min="0"
              value={form.price}
              onChange={(e) => setForm((f) => ({ ...f, price: e.target.value }))}
              required
              className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
            />
          </label>

          <label className="text-sm">
            <span className="mb-1 block font-medium text-neutral-700">Görsel</span>
            <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleFile} />
            {preview ? (
              <img src={preview} alt="" className="mt-2 h-24 w-24 rounded-lg object-cover" />
            ) : null}
          </label>

          <div className="flex flex-wrap gap-4 pt-1">
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_active}
                onChange={(e) => setForm((f) => ({ ...f, is_active: e.target.checked }))}
              />
              Aktif (menüde görünsün)
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_available}
                onChange={(e) => setForm((f) => ({ ...f, is_available: e.target.checked }))}
              />
              Stokta var
            </label>
            <label className="flex items-center gap-2 text-sm">
              <input
                type="checkbox"
                checked={form.is_featured}
                onChange={(e) => setForm((f) => ({ ...f, is_featured: e.target.checked }))}
              />
              Öne çıkan
            </label>
          </div>
        </div>

        {error ? <p className="mt-3 text-sm text-red-600">{error}</p> : null}

        <div className="mt-5 flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="rounded-lg px-4 py-2 text-sm font-medium text-neutral-600 hover:bg-neutral-100"
          >
            Vazgeç
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
          >
            {saving ? "Kaydediliyor..." : "Kaydet"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default ProductFormModal;
