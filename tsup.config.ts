import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  format: ["cjs", "esm"], // Must include both formats
  dts: true,
  clean: true,
  outDir: "dist", // Critical - ensures proper output structure
  outExtension({ format }) {
    return {
      js: format === "cjs" ? ".cjs" : ".mjs", // Explicit extensions
    };
  },
});
