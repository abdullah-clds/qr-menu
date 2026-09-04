import { useEffect, useMemo, useRef, useState } from "react";
import { useMenuData } from "./hooks/useMenuData";
import { useDarkMode } from "./hooks/useDarkMode";
import MenuHeader from "./components/MenuHeader";
import MenuSearch from "./components/MenuSearch";
import DarkModeToggle from "./components/DarkModeToggle";
import CategoryNav from "./components/CategoryNav";
import CategorySection from "./components/CategorySection";
import MenuFooter from "./components/MenuFooter";
import MenuIntro from "./components/MenuIntro";
import { LoadingState, ErrorState, EmptyState } from "./components/StatusStates";

const MenuApp = () => {
  const { status, data, error, reload } = useMenuData();
  const { scheme, isDark, toggle: toggleDarkMode } = useDarkMode();
  const [search, setSearch] = useState("");
  const [activeCategoryId, setActiveCategoryId] = useState(null);
  const [showIntro, setShowIntro] = useState(true);
  const sectionRefs = useRef(new Map());

  const categoriesWithProducts = useMemo(() => {
    if (!data) return [];
    const query = search.trim().toLocaleLowerCase("tr");

    return data.categories
      .map((category) => {
        const products = data.products.filter((product) => {
          if (product.categoryId !== category.id) return false;
          if (!query) return true;
          return product.name.toLocaleLowerCase("tr").includes(query);
        });
        return { category, products };
      })
      .filter((entry) => entry.products.length > 0);
  }, [data, search]);

  useEffect(() => {
    if (categoriesWithProducts.length > 0 && !activeCategoryId) {
      setActiveCategoryId(categoriesWithProducts[0].category.id);
    }
  }, [categoriesWithProducts, activeCategoryId]);

  useEffect(() => {
    if (categoriesWithProducts.length === 0) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);
        if (visible[0]) {
          const id = Number(visible[0].target.id.replace("category-", ""));
          setActiveCategoryId(id);
        }
      },
      { rootMargin: "-116px 0px -70% 0px", threshold: 0 }
    );

    sectionRefs.current.forEach((el) => el && observer.observe(el));
    return () => observer.disconnect();
  }, [categoriesWithProducts]);

  const handleSelectCategory = (id) => {
    setActiveCategoryId(id);
    const el = sectionRefs.current.get(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  const intro = showIntro ? (
    <MenuIntro
      restaurantName={data?.settings?.restaurantName}
      logo={data?.settings?.logo}
      onDone={() => setShowIntro(false)}
    />
  ) : null;

  if (status === "loading") {
    return (
      <div data-theme={scheme}>
        {intro}
        <LoadingState />
      </div>
    );
  }
  if (status === "error") {
    return (
      <div data-theme={scheme}>
        {intro}
        <ErrorState message={error} onRetry={reload} />
      </div>
    );
  }

  const { settings } = data;

  return (
    <div data-theme={scheme} className="min-h-dvh bg-menu-bg">
      {intro}
      <div className="mx-auto max-w-2xl pb-6">
        <MenuHeader settings={settings} />

        <div className="menu-toolbar sticky top-0 z-10 border-b border-menu-line bg-menu-bg/95 backdrop-blur-sm">
          <div className="flex min-w-0 items-center gap-2 px-4 sm:px-6">
            {categoriesWithProducts.length > 0 ? (
              <CategoryNav
                categories={categoriesWithProducts.map((e) => e.category)}
                activeId={activeCategoryId}
                onSelect={handleSelectCategory}
              />
            ) : (
              <span className="min-w-0 flex-1" />
            )}
            <DarkModeToggle isDark={isDark} onToggle={toggleDarkMode} />
            <MenuSearch value={search} onChange={setSearch} />
          </div>
        </div>

        {categoriesWithProducts.length === 0 ? (
          <EmptyState
            message={search ? "Aramanızla eşleşen bir ürün bulunamadı." : "Menü henüz hazırlanıyor."}
          />
        ) : (
          categoriesWithProducts.map(({ category, products }, index) => (
            <CategorySection
              key={category.id}
              ref={(el) => {
                if (el) sectionRefs.current.set(category.id, el);
                else sectionRefs.current.delete(category.id);
              }}
              index={index}
              category={category}
              products={products}
              currency={settings.currency}
            />
          ))
        )}

        <MenuFooter settings={settings} />
      </div>
    </div>
  );
};

export default MenuApp;
