import path from "node:path";
import fse from "fs-extra";
import esbuild from "esbuild";

// Returns bundled JS as a string (no file written)
export async function buildJsText({ devDir, bannerName }) {
  const jsEntry = path.join(devDir, bannerName, "_js", "main.js");
  if (!(await fse.pathExists(jsEntry))) return "";

  const isProd = (process.env.NODE_ENV || "production") === "production";

  const res = await esbuild.build({
    entryPoints: [jsEntry],
    bundle: true,
    format: "iife",
    target: ["es2017"],
    write: false,

    // dev-friendly
    minify: isProd,
    sourcemap: !isProd,

    // only strip in production
    drop: isProd ? ["console", "debugger"] : [],
  });

  return res.outputFiles?.[0]?.text || "";
}

export async function buildJs(opts) {
  return buildJsText(opts);
}
