import { defineConfig } from "tsdown";

export default defineConfig({
  entry: "lib/index.ts",
  dts: true,
  clean: true,
  tsconfig: "tsconfig.app.json",
  external: ["@testing-library/dom", "@testing-library/user-event"],
});
