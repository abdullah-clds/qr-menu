import { useEffect, useState } from "react";
import { api } from "../api/client";
import { useToast } from "../context/ToastContext";
import { resizeImageFile } from "../utils/resizeImage";

const FIELDS = [
  { key: "restaurant_name", label: "Restoran adı" },
  { key: "menu_title", label: "Menü başlığı" },
  { key: "menu_description", label: "Menü açıklaması" },
  { key: "currency", label: "Para birimi (örn. TRY)" },
  { key: "phone", label: "Telefon" },
  { key: "whatsapp", label: "WhatsApp" },
  { key: "email", label: "E-posta" },
  { key: "address", label: "Adres" },
  { key: "opening_hours", label: "Çalışma saatleri" },
  { key: "instagram", label: "Instagram" },
  { key: "facebook", label: "Facebook" },
  { key: "tiktok", label: "TikTok" },
];

const SettingsPage = () => {
  const showToast = useToast();
  const [form, setForm] = useState(null);
  const [logoPreview, setLogoPreview] = useState(null);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get("admin/settings").then((data) => {
      setForm(data.settings);
      setLogoPreview(data.settings.logo_path);
    });
  }, []);

  const handleLogoChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const resized = await resizeImageFile(file);
      const formData = new FormData();
      formData.append("logo", resized);
      const data = await api.upload("admin/settings/logo", formData);
      setLogoPreview(data.settings.logo_path);
      showToast("Logo güncellendi.");
    } catch (err) {
      showToast(err.message, "error");
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const data = await api.put("admin/settings", form);
      setForm(data.settings);
      showToast("Ayarlar kaydedildi.");
    } catch (err) {
      showToast(err.message, "error");
    } finally {
      setSaving(false);
    }
  };

  if (!form) return <p className="text-sm text-neutral-500">Yükleniyor...</p>;

  return (
    <form
      onSubmit={handleSubmit}
      className="flex max-w-lg flex-col gap-4 rounded-xl border border-neutral-200 bg-white p-5"
    >
      <div>
        <span className="mb-1 block text-sm font-medium text-neutral-700">Logo</span>
        <div className="flex items-center gap-3">
          {logoPreview ? (
            <img src={logoPreview} alt="" className="size-14 rounded-full object-cover" />
          ) : (
            <div className="size-14 rounded-full bg-neutral-100" />
          )}
          <input type="file" accept="image/jpeg,image/png,image/webp" onChange={handleLogoChange} />
        </div>
      </div>

      {FIELDS.map(({ key, label }) => (
        <label key={key} className="text-sm">
          <span className="mb-1 block font-medium text-neutral-700">{label}</span>
          <input
            type="text"
            value={form[key] || ""}
            onChange={(e) => setForm((f) => ({ ...f, [key]: e.target.value }))}
            className="w-full rounded-lg border border-neutral-300 px-3 py-2 outline-none focus:border-neutral-900"
          />
        </label>
      ))}

      <button
        type="submit"
        disabled={saving}
        className="w-fit rounded-lg bg-neutral-900 px-5 py-2 text-sm font-medium text-white disabled:opacity-60"
      >
        {saving ? "Kaydediliyor..." : "Kaydet"}
      </button>
    </form>
  );
};

export default SettingsPage;
