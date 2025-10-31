import { defineConfig } from "vite";
import tailwindcss from "@tailwindcss/vite";

export default defineConfig({
  plugins: [tailwindcss()],
  server: {
    watch: {
      // следить за всеми html в корне
      ignored: [],
    },
  },
});
