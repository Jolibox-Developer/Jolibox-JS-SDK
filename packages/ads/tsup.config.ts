import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  target: "es6",
  format: ["cjs", "esm"],
  minify: true,
  dts: true,
});
