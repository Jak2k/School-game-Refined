import { defineConfig } from "vite";
import ssr from "vite-plugin-ssr/plugin";

export default defineConfig({
  plugins: [ssr()],
});
