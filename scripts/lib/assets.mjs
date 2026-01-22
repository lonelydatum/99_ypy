import path from "node:path";
import fg from "fast-glob";
import fse from "fs-extra";

export function extractImgSrc(html) {
  const out = new Set();
  for (const m of html.matchAll(/\bimg\b[^>]*\bsrc\s*=\s*["']([^"']+)["']/gi)) {
    out.add(m[1].trim());
  }
  return [...out]
    .filter(Boolean)
    .filter((p) => !p.startsWith("http://") && !p.startsWith("https://") && !p.startsWith("data:"));
}

export function resolveDevPath({ devDir, bannerName, assetUrl }) {
  const clean = assetUrl.replace(/^\.\//, "");

  // Your legacy pattern: ../_common/images/...
  if (clean.startsWith("../_common/")) {
    return path.join(devDir, "_common", clean.replace(/^\.\.\/_common\//, ""));
  }

  // Banner-local (if you ever use ./images/foo.png etc)
  return path.join(devDir, bannerName, clean);
}

// Copies assets into outDir, flattened (basename only)
export async function copyImgAssets({ devDir, bannerName, outDir, html }) {
  const urls = extractImgSrc(html);

  for (const url of urls) {
    const src = resolveDevPath({ devDir, bannerName, assetUrl: url });
    const dst = path.join(outDir, path.basename(url));

    if (!(await fse.pathExists(src))) {
      console.warn(`⚠️  Missing <img> asset: ${url}`);
      continue;
    }
    await fse.copy(src, dst, { overwrite: true });
  }

  return urls;
}
