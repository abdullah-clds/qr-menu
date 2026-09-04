import { useEffect, useState } from "react";
import { api } from "../api/client";
import { navigate } from "../router";

const StatCard = ({ label, value }) => (
  <div className="rounded-xl border border-neutral-200 bg-white p-4">
    <p className="text-xs font-medium uppercase tracking-wide text-neutral-500">{label}</p>
    <p className="mt-1 text-2xl font-semibold text-neutral-900">{value}</p>
  </div>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    api.get("admin/dashboard").then(setStats).catch(() => setStats(null));
  }, []);

  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <StatCard label="Toplam Ürün" value={stats?.totalProducts ?? "–"} />
        <StatCard label="Kategori" value={stats?.totalCategories ?? "–"} />
        <StatCard label="Tükenen" value={stats?.unavailableProducts ?? "–"} />
        <StatCard label="Gizli Ürün" value={stats?.hiddenProducts ?? "–"} />
      </div>

      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => navigate("/products")}
          className="rounded-lg bg-neutral-900 px-4 py-2 text-sm font-medium text-white"
        >
          Ürünleri Yönet
        </button>
        <button
          type="button"
          onClick={() => navigate("/categories")}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700"
        >
          Kategorileri Yönet
        </button>
        <button
          type="button"
          onClick={() => navigate("/qr")}
          className="rounded-lg border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700"
        >
          QR Kodu Görüntüle
        </button>
      </div>
    </div>
  );
};

export default DashboardPage;
