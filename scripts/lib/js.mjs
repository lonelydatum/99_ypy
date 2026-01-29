import path from "node:path";
import fse from "fs-extra";
import esbuild from "esbuild";

// Returns bundled + minified JS as a string (no file written)
export async function buildJsText({ devDir, bannerName }) {
  const jsEntry = path.join(devDir, bannerName, "_js", "main.js");
  if (!(await fse.pathExists(jsEntry))) return "";

  const res = await esbuild.build({
    entryPoints: [jsEntry],
    drop: ["console", "debugger"],
    bundle: true,
    format: "iife",
    target: ["es2017"],
    minify: true,
    write: false,
  });

  return res.outputFiles?.[0]?.text || "";
}

// Backwards-compatible alias (so old imports still work)
export async function buildJs(opts) {
  return buildJsText(opts);
}
