import { $, type BuildConfig } from "bun";
import dts from "bun-plugin-dts";

await $`rm -rf dist`;

const shared = {
  entrypoints: ["./src/index.ts"],
  target: "browser",
  sourcemap: "external",
  minify: true,
  outdir: "./dist",
} satisfies Partial<BuildConfig>;

await Promise.all([
  Bun.build({
    ...shared,
    plugins: [dts()],
    format: "esm",
    naming: "[dir]/[name].js",
  }),
  Bun.build({
    ...shared,
    format: "cjs",
    naming: "[dir]/[name].cjs",
  }),
]);
