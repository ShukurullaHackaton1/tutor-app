import { defineConfig } from "vite";

export default defineConfig({
  server: {
    host: true, // barcha IP-larga ruxsat
    port: 5176, // server porti
    strictPort: true, // agar band bo‘lsa, boshqa port tanlamaydi
    open: false, // brauzerda avtomatik ochmaslik
  },
  optimizeDeps: {
    exclude: ["react"],
  },
});
