/* eslint-disable no-undef */
import esbuild from "esbuild";

esbuild
  .build({
    entryPoints: ["src/background.ts"],
    bundle: true,
    outfile: "public/background.js",
    platform: "browser",
    target: ["es2020"],
    sourcemap: true,
    minify: true,
  })
  .catch(() => process.exit(1));
