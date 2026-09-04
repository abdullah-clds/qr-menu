import { useEffect } from "react";
import { AuthProvider, useAuth } from "./context/AuthContext";
import { ToastProvider } from "./context/ToastContext";
import { useHashRoute, navigate } from "./router";
import AdminLayout from "./components/AdminLayout";
import LoginPage from "./pages/LoginPage";
import DashboardPage from "./pages/DashboardPage";
import ProductsPage from "./pages/ProductsPage";
import CategoriesPage from "./pages/CategoriesPage";
import SettingsPage from "./pages/SettingsPage";
import QrCodePage from "./pages/QrCodePage";

const PAGES = {
  "/dashboard": DashboardPage,
  "/products": ProductsPage,
  "/categories": CategoriesPage,
  "/settings": SettingsPage,
  "/qr": QrCodePage,
};

const AdminShell = () => {
  const { admin, status } = useAuth();
  const path = useHashRoute();

  useEffect(() => {
    if (status !== "ready") return;
    if (!admin && path !== "/login") navigate("/login");
    if (admin && path === "/login") navigate("/dashboard");
  }, [status, admin, path]);

  if (status === "checking") {
    return <div className="flex min-h-dvh items-center justify-center text-neutral-400">Yükleniyor...</div>;
  }

  if (!admin) {
    return <LoginPage />;
  }

  const Page = PAGES[path] || DashboardPage;

  return (
    <AdminLayout path={path in PAGES ? path : "/dashboard"}>
      <Page />
    </AdminLayout>
  );
};

const AdminApp = () => (
  <AuthProvider>
    <ToastProvider>
      <AdminShell />
    </ToastProvider>
  </AuthProvider>
);

export default AdminApp;
