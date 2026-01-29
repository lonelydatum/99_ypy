import path from "node:path";
import fs from "node:fs/promises";
import fse from "fs-extra";

import { getRoot, devDir as devDirFn, distDir as distDirFn, listBanners, parseBannerMeta } from "./lib/paths.mjs";
import { renderBannerHtml } from "./lib/render.mjs";
import { buildCssText } from "./lib/css.mjs";
import { buildJsText } from "./lib/js.mjs";

import { copyImgAssets } from "./lib/assets.mjs";
import { rewriteHtmlForCleanOutput } from "./lib/rewrite.mjs";

function parseArgs(argv) {
  const args = {};
  for (let i = 2; i < argv.length; i++) {
    const a = argv[i];
    if (!a.startsWith("--")) continue;
    const [k, v] = a.split("=");
    const key = k.replace(/^--/, "");
    if (v !== undefined) args[key] = v;
    else if (argv[i + 1] && !argv[i + 1].startsWith("--")) args[key] = argv[++i];
    else args[key] = true;
  }
  return args;
}

async function buildOne({ root, devDir, distDir, bannerName, sourcemap }) {
  const outDir = path.join(distDir, bannerName);
  await fse.remove(outDir);
  await fse.ensureDir(outDir);

  const meta = parseBannerMeta(bannerName);
  const context = {
    ...meta,
    env: process.env.NODE_ENV || "production",
    buildTimestamp: new Date().toISOString(),
  };

  // 1) render HTML
  const htmlRaw = await renderBannerHtml({ devDir, bannerName, context });

  // 2) copy assets based on ORIGINAL src paths (source of truth)
  await copyImgAssets({ devDir, bannerName, outDir, html: htmlRaw });

  // 3) rewrite HTML to clean output paths
  const htmlClean = rewriteHtmlForCleanOutput(htmlRaw);

  // 4) build CSS/JS as TEXT (no files)
  const cssText = await buildCssText({ devDir, bannerName });
  const jsText = await buildJsText({ devDir, bannerName });

  console.log(`[DEBUG] ${bannerName} css chars:`, cssText.length);
  console.log(`[DEBUG] ${bannerName} js chars:`, jsText.length);

  // 5) inject inline (handles main.css or ./main.css, and main.js or ./main.js)
  const htmlInline = htmlClean
    .replace(/<link\b[^>]*href=["']\.?\/?main\.css["'][^>]*>/i, cssText ? `<style>${cssText}</style>` : "")
    .replace(
      /<script\b[^>]*src=["']\.?\/?main\.js["'][^>]*>\s*<\/script>/i,
      jsText ? `<script>${jsText}</script>` : "",
    );

  // 6) write final HTML (only once)
  await fse.outputFile(path.join(outDir, "index.html"), htmlInline, "utf8");

  console.log(`✅ Built ${bannerName} -> ${path.relative(root, outDir)}`);
}

async function main() {
  const args = parseArgs(process.argv);
  const root = getRoot();
  const devDir = devDirFn(root);
  const distDir = distDirFn(root);

  const sourcemap = Boolean(args.sourcemap);

  const banners = await listBanners({ devDir });
  const only = args.banner;
  const target = only ? banners.filter((b) => b === only) : banners;

  if (only && target.length === 0) {
    throw new Error(`Banner not found: ${only}`);
  }

  await fse.ensureDir(distDir);

  for (const b of target) {
    await buildOne({ root, devDir, distDir, bannerName: b, sourcemap });
  }

  console.log("🎉 Done.");
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
