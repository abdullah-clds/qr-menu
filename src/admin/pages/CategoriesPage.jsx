import { useEffect, useRef, useState } from "react";
import { api } from "../api/client";
import { useToast } from "../context/ToastContext";
import ConfirmDialog from "../components/ConfirmDialog";
import { resizeImageFile } from "../utils/resizeImage";

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
  const [uploadingId, setUploadingId] = useState(null);
  const fileInputs = useRef({});

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

  const handleImageChange = async (category, e) => {
    const file = e.target.files?.[0];
    e.target.value = "";
    if (!file) return;
    setUploadingId(category.id);
    try {
      const resized = await resizeImageFile(file);
      const formData = new FormData();
      formData.append("image", resized);
      await api.upload(`admin/categories/${category.id}/image`, formData);
      showToast("Kategori görseli güncellendi.");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingId(null);
    }
  };

  const handleRemoveImage = async (category) => {
    setUploadingId(category.id);
    try {
      await api.del(`admin/categories/${category.id}/image`);
      showToast("Kategori görseli kaldırıldı.");
      load();
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setUploadingId(null);
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
                <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <div className="flex min-w-0 items-center gap-3">
                    {category.image_path ? (
                      <img
                        src={category.image_path}
                        alt=""
                        className="size-12 shrink-0 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="flex size-12 shrink-0 items-center justify-center rounded-lg bg-neutral-100 text-[10px] text-neutral-400">
                        Görsel yok
                      </div>
                    )}
                    <div className="min-w-0 flex-1">
                      <p className="break-words font-medium text-neutral-900">{category.name}</p>
                      {category.description ? (
                        <p className="truncate text-sm text-neutral-500">{category.description}</p>
                      ) : null}
                      <div className="mt-1 flex items-center gap-2">
                        <input
                          ref={(el) => {
                            fileInputs.current[category.id] = el;
                          }}
                          type="file"
                          accept="image/jpeg,image/png,image/webp"
                          className="hidden"
                          onChange={(e) => handleImageChange(category, e)}
                        />
                        <button
                          type="button"
                          disabled={uploadingId === category.id}
                          onClick={() => fileInputs.current[category.id]?.click()}
                          className="text-xs font-medium text-neutral-600 underline decoration-neutral-300 underline-offset-2 disabled:opacity-50"
                        >
                          {uploadingId === category.id
                            ? "Yükleniyor..."
                            : category.image_path
                              ? "Görseli değiştir"
                              : "Görsel ekle"}
                        </button>
                        {category.image_path ? (
                          <button
                            type="button"
                            disabled={uploadingId === category.id}
                            onClick={() => handleRemoveImage(category)}
                            className="text-xs font-medium text-red-600 underline decoration-red-200 underline-offset-2 disabled:opacity-50"
                          >
                            Kaldır
                          </button>
                        ) : null}
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-wrap items-center gap-1 sm:shrink-0">
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
