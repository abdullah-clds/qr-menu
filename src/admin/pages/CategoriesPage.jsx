import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";

const emptyForm = { name: "", description: "" };

const CategoriesPage = () => {
  const showToast = useToast();
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState(emptyForm);
  const [creating, setCreating] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState(emptyForm);
  const [pendingDelete, setPendingDelete] = useState(null);

  const load = () => {
    setLoading(true);
    api
      .get("admin/categories")
      .then((data) => setCategories(data.categories))
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!form.name.trim()) return;
    setCreating(true);
    try {
      await api.post("admin/categories", form);
      setForm(emptyForm);
      showToast("Kategori eklendi.");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setCreating(false);
    }
  };

  const startEdit = (category) => {
    setEditingId(category.id);
    setEditForm({ name: category.name, description: category.description || "" });
  };

  const saveEdit = async (category) => {
    try {
      await api.put(`admin/categories/${category.id}`, {
        ...editForm,
        is_active: !!category.is_active,
        sort_order: category.sort_order,
      });
      setEditingId(null);
      showToast("Kategori güncellendi.");
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const toggleActive = async (category) => {
    try {
      await api.put(`admin/categories/${category.id}`, {
        name: category.name,
        description: category.description,
        is_active: !category.is_active,
        sort_order: category.sort_order,
      });
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const move = async (category, direction) => {
    const index = categories.findIndex((c) => c.id === category.id);
    const swapWith = categories[index + direction];
    if (!swapWith) return;
    try {
      await Promise.all([
        api.put(`admin/categories/${category.id}`, {
          name: category.name,
          description: category.description,
          is_active: !!category.is_active,
          sort_order: swapWith.sort_order,
        }),
        api.put(`admin/categories/${swapWith.id}`, {
          name: swapWith.name,
          description: swapWith.description,
          is_active: !!swapWith.is_active,
          sort_order: category.sort_order,
        }),
      ]);
      load();
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const confirmDelete = async () => {
    try {
      await api.del(`admin/categories/${pendingDelete.id}`);
      showToast("Kategori silindi.");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setPendingDelete(null);
    }
  };

  return (
    <div className="flex flex-col gap-5">
      <form
        onSubmit={handleCreate}
        className="flex flex-col gap-2 rounded-xl border border-neutral-200 bg-white p-4 sm:flex-row sm:items-end"
      >
        <label className="flex-1 text-sm">
          <span className="mb-1 block font-medium text-neutral-700">Yeni kategori adı</span>
          <input
            type="text"
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            placeholder="örn. Tatlılar"
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          />
        </label>
        <button
          type="submit"
          disabled={creating}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white disabled:opacity-60"
        >
          Ekle
        </button>
      </form>

      {loading ? (
        <p className="text-sm text-neutral-500">Yükleniyor...</p>
      ) : (
        <ul className="flex flex-col gap-2">
          {categories.map((category, index) => (
            <li key={category.id} className="rounded-xl border border-neutral-200 bg-white p-4">
              {editingId === category.id ? (
                <div className="flex flex-col gap-2">
                  <input
                    type="text"
                    value={editForm.name}
                    onChange={(e) => setEditForm((f) => ({ ...f, name: e.target.value }))}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                  />
                  <textarea
                    value={editForm.description}
                    onChange={(e) => setEditForm((f) => ({ ...f, description: e.target.value }))}
                    placeholder="Açıklama (opsiyonel)"
                    rows={2}
                    className="rounded-lg border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
                  />
                  <div className="flex gap-2">
                    <button
                      type="button"
                      onClick={() => saveEdit(category)}
                      className="rounded-lg bg-neutral-900 px-3 py-1.5 text-sm font-medium text-white"
                    >
                      Kaydet
                    </button>
                    <button
                      type="button"
                      onClick={() => setEditingId(null)}
                      className="rounded-lg border border-neutral-300 px-3 py-1.5 text-sm font-medium text-neutral-700"
                    >
                      Vazgeç
                    </button>
                  </div>
                </div>
              ) : (
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="truncate font-medium text-neutral-900">{category.name}</p>
                    {category.description ? (
                      <p className="truncate text-sm text-neutral-500">{category.description}</p>
                    ) : null}
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <button
                      type="button"
                      onClick={() => move(category, -1)}
                      disabled={index === 0}
                      className="rounded-lg border border-neutral-200 px-2 py-1 text-sm text-neutral-600 disabled:opacity-30"
                      aria-label="Yukarı taşı"
                    >
                      ↑
                    </button>
                    <button
                      type="button"
                      onClick={() => move(category, 1)}
                      disabled={index === categories.length - 1}
                      className="rounded-lg border border-neutral-200 px-2 py-1 text-sm text-neutral-600 disabled:opacity-30"
                      aria-label="Aşağı taşı"
                    >
                      ↓
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleActive(category)}
                      className={
                        "rounded-lg px-2.5 py-1 text-xs font-semibold " +
                        (category.is_active
                          ? "bg-green-100 text-green-700"
                          : "bg-neutral-200 text-neutral-600")
                      }
                    >
                      {category.is_active ? "Aktif" : "Pasif"}
                    </button>
                    <button
                      type="button"
                      onClick={() => startEdit(category)}
                      className="rounded-lg border border-neutral-200 px-2.5 py-1 text-sm text-neutral-600"
                    >
                      Düzenle
                    </button>
                    <button
                      type="button"
                      onClick={() => setPendingDelete(category)}
                      className="rounded-lg border border-neutral-200 px-2.5 py-1 text-sm text-red-600"
                    >
                      Sil
                    </button>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      )}

      <ConfirmDialog
        open={!!pendingDelete}
        title="Kategoriyi sil"
        message={`"${pendingDelete?.name}" kategorisini silmek istediğinize emin misiniz? Bağlı ürün varsa silme işlemi engellenir.`}
        confirmLabel="Sil"
        onConfirm={confirmDelete}
        onCancel={() => setPendingDelete(null)}
      />
    </div>
  );
};

export default CategoriesPage;
