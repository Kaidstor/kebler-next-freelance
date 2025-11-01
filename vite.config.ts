import { defineConfig } from "vite";
import { resolve } from "path";
import { fileURLToPath } from "url";
import { dirname } from "path";
import tailwindcss from "@tailwindcss/vite";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    watch: {
      // следить за всеми html в корне
      ignored: [],
    },
  },
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, "index.html"),
        book: resolve(__dirname, "book.html"),
        campsites: resolve(__dirname, "campsites.html"),
        rvSites: resolve(__dirname, "rv-sites.html"),
      },
    },
  },
});
