import { defineConfig } from "vite";
import react, { reactCompilerPreset } from "@vitejs/plugin-react";
import babel from "@rolldown/plugin-babel";

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), babel({ presets: [reactCompilerPreset()] })],
  rules: {
    "no-console": "error",
  },
  css: {
    preprocessorOptions: {
      scss: {
        additionalData: `
          @use "/src/shared/styles/variables.scss" as *;
        `,
      },
    },
  },
});
