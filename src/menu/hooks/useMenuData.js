import { useCallback, useEffect, useState } from "react";
import { DEMO_MENU_DATA } from "./demoData";

export function useMenuData() {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  const load = useCallback(() => {
    // Design-preview builds only (e.g. the GitHub Pages demo, which has no
    // PHP/MySQL backend to call). Never set in the real production build —
    // npm run build never defines VITE_DEMO_MODE, so this branch is dead
    // code there.
    if (import.meta.env.VITE_DEMO_MODE === "true") {
      setState({ status: "success", data: DEMO_MENU_DATA, error: null });
      return;
    }

    setState({ status: "loading", data: null, error: null });
    fetch("/api/public/menu")
      .then(async (res) => {
        const body = await res.json().catch(() => null);
        if (!res.ok || !body?.success) {
          throw new Error(body?.error || "Menü yüklenemedi.");
        }
        return body.data;
      })
      .then((data) => setState({ status: "success", data, error: null }))
      .catch((error) =>
        setState({ status: "error", data: null, error: error.message || "Menü yüklenemedi." })
      );
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  return { ...state, reload: load };
}
