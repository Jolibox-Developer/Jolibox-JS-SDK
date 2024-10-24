import { defineConfig } from "tsup";

export default defineConfig({
  entry: ["src/index.ts"],
  splitting: false,
  sourcemap: true,
  clean: true,
  outDir: "dist",
  target: "chrome52",
  format: ["cjs", "esm", "iife"],
  outExtension(ctx) {
    switch (ctx.format) {
      case "cjs":
        return { js: ".cjs", dts: ".cts" };
      case "esm":
        return { js: ".js", dts: ".ts" };
      default:
        return { js: ".iife.js" };
    }
  },
  minify: true,
  dts: true,
});
