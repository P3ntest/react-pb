import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import { resolve } from "path";
import dts from "vite-plugin-dts";

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    react(),
    dts({
      include: ["lib"],
      tsconfigPath: "./tsconfig.app.json",
    }),
  ],
  build: {
    copyPublicDir: false,
    lib: {
      name: "use-pocketbase",
      entry: resolve(__dirname, "lib/index.ts"),
      formats: ["es"],
    },
    rollupOptions: {
      external: [
        "react",
        "react-dom",
        "react/jsx-runtime",
        "pocketbase",
        "@tanstack/react-query",
      ],
    },
  },
});
