import { useCallback, useEffect, useState } from "react";

export function useMenuData() {
  const [state, setState] = useState({ status: "loading", data: null, error: null });

  const load = useCallback(() => {
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
