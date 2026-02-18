import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["lib/index.ts", "lib/vitest.ts"],
  target: "esnext",
  dts: true,
  clean: true,
  tsconfig: "tsconfig.app.json",
  external: ["@testing-library/dom", "@testing-library/user-event", "vitest", "@vitest/expect"],
});
