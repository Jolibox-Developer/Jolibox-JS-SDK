/// <reference types="vitest" />
import { defineConfig } from "vite";

export default defineConfig({
  test: {
    // ...
    watch: false,
    environment: "happy-dom",
    setupFiles: ['./src/__tests__/setup.ts'],
    onConsoleLog: (log) => {
      if (log.includes("__uspapiLocator")) {
        // ignore google ads console log error
        return false;
      }
    },
  },
});
