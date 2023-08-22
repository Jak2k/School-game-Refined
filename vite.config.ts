import { defineConfig } from "vite";
import ssr from "vite-plugin-ssr/plugin";
import EsLintPlugin from "@nabla/vite-plugin-eslint";

export default defineConfig((configEnv) => ({
  plugins: [ssr(), EsLintPlugin()],
}));
