import { useCallback, useEffect, useState } from "react";

function readSlugFromLocation() {
  return new URLSearchParams(window.location.search).get("category");
}

/**
 * Shared-hosting-friendly category routing: state lives in the `?category=`
 * query string on the static root document, so a browser refresh or direct
 * link never needs an Apache rewrite rule. history.pushState keeps the back
 * button working without a full reload.
 */
export function useCategoryRoute() {
  const [slug, setSlug] = useState(readSlugFromLocation);

  useEffect(() => {
    const onPopState = () => setSlug(readSlugFromLocation());
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  const openCategory = useCallback((categorySlug) => {
    const url = `${window.location.pathname}?category=${encodeURIComponent(categorySlug)}`;
    window.history.pushState({ category: categorySlug }, "", url);
    setSlug(categorySlug);
  }, []);

  const closeCategory = useCallback(() => {
    window.history.pushState({}, "", window.location.pathname);
    setSlug(null);
  }, []);

  return { slug, openCategory, closeCategory };
}
