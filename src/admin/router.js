import { useEffect, useState } from "react";

function currentPath() {
  const hash = window.location.hash.replace(/^#/, "");
  return hash || "/dashboard";
}

export function useHashRoute() {
  const [path, setPath] = useState(currentPath());

  useEffect(() => {
    const onHashChange = () => setPath(currentPath());
    window.addEventListener("hashchange", onHashChange);
    return () => window.removeEventListener("hashchange", onHashChange);
  }, []);

  return path;
}

export function navigate(path) {
  window.location.hash = path;
}
