import { useEffect, useMemo } from "react";
import { useMenuData } from "./hooks/useMenuData";
import { useCategoryRoute } from "./hooks/useCategoryRoute";
import MenuHero from "./components/MenuHero";
import CategoryGrid from "./components/CategoryGrid";
import CategoryDetail from "./components/CategoryDetail";
import ContactSection from "./components/ContactSection";
import MenuFooter from "./components/MenuFooter";
import { LoadingState, ErrorState, EmptyState } from "./components/StatusStates";

const MenuApp = () => {
  const { status, data, error, reload } = useMenuData();
  const { slug, openCategory, closeCategory } = useCategoryRoute();

  const activeCategory = useMemo(() => {
    if (!data || !slug) return null;
    return data.categories.find((c) => c.slug === slug) || null;
  }, [data, slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [activeCategory]);

  if (status === "loading") return <LoadingState />;
  if (status === "error") return <ErrorState message={error} onRetry={reload} />;

  const { settings, categories, products } = data;

  if (activeCategory) {
    const categoryProducts = products.filter((p) => p.categoryId === activeCategory.id);
    return (
      <div className="min-h-dvh bg-menu-bg">
        <CategoryDetail
          category={activeCategory}
          products={categoryProducts}
          currency={settings.currency}
          onBack={closeCategory}
        />
      </div>
    );
  }

  return (
    <div className="min-h-dvh bg-menu-bg">
      <MenuHero settings={settings} />

      {categories.length === 0 ? (
        <EmptyState message="Menü henüz hazırlanıyor." />
      ) : (
        <CategoryGrid
          categories={categories}
          onSelect={(category) => openCategory(category.slug)}
        />
      )}

      <ContactSection settings={settings} />
      <MenuFooter restaurantName={settings.restaurantName} />
    </div>
  );
};

export default MenuApp;
