import { fileURLToPath, URL } from "url";
import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

const resolvePath = (path) => fileURLToPath(new URL(path, import.meta.url));

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolvePath("index.html"),
        menu: resolvePath("menu/index.html"),
        admin: resolvePath("admin/index.html"),
      },
    },
  },
  server: {
    // Bind explicitly to IPv4. On this machine "localhost" resolves to both
    // ::1 and 127.0.0.1, and the default bind made the dev server hang on
    // requests. Pinning to 127.0.0.1 keeps it fast and predictable.
    host: "127.0.0.1",
    proxy: {
      "/api": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
      "/uploads": {
        target: "http://127.0.0.1:8000",
        changeOrigin: true,
      },
    },
  },
});
