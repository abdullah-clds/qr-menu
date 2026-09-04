import { useAuth } from "../context/AuthContext";
import { navigate } from "../router";

const NAV_ITEMS = [
  { path: "/dashboard", label: "Panel" },
  { path: "/products", label: "Ürünler" },
  { path: "/categories", label: "Kategoriler" },
  { path: "/settings", label: "Restoran" },
  { path: "/qr", label: "QR Kod" },
];

const AdminLayout = ({ path, children }) => {
  const { admin, logout } = useAuth();

  const handleLogout = async () => {
    await logout();
    navigate("/login");
  };

  return (
    <div className="min-h-dvh bg-neutral-50 text-neutral-900">
      <header className="sticky top-0 z-10 border-b border-neutral-200 bg-white">
        <div className="mx-auto flex max-w-5xl items-center justify-between gap-4 px-4 py-3">
          <span className="text-sm font-semibold uppercase tracking-tight">Yönetim Paneli</span>
          <div className="flex items-center gap-3 text-sm text-neutral-500">
            <span className="hidden sm:inline">{admin?.name}</span>
            <button
              type="button"
              onClick={handleLogout}
              className="rounded-lg border border-neutral-200 px-3 py-1.5 font-medium text-neutral-700 hover:bg-neutral-100"
            >
              Çıkış
            </button>
          </div>
        </div>
        <nav className="no-scrollbar mx-auto flex max-w-5xl gap-1 overflow-x-auto px-4 pb-2">
          {NAV_ITEMS.map((item) => (
            <button
              key={item.path}
              type="button"
              onClick={() => navigate(item.path)}
              className={
                "shrink-0 rounded-lg px-3 py-1.5 text-sm font-medium transition-colors " +
                (path === item.path
                  ? "bg-neutral-900 text-white"
                  : "text-neutral-600 hover:bg-neutral-100")
              }
            >
              {item.label}
            </button>
          ))}
        </nav>
      </header>
      <main className="mx-auto max-w-5xl px-4 py-5">{children}</main>
    </div>
  );
};

export default AdminLayout;
