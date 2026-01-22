import path from "node:path";
import fse from "fs-extra";

export function getRoot() {
  return process.cwd();
}

export function devDir(root) {
  return path.join(root, "dev");
}

export function distDir(root) {
  return path.join(root, "docs", "deploy");
}

export function docsDir(root) {
  return path.join(root, "docs");
}

export async function listBanners({ devDir }) {
  const entries = await fse.readdir(devDir);
  const out = [];
  for (const name of entries) {
    if (name === "_common") continue;
    if (name.startsWith(".")) continue;
    const full = path.join(devDir, name);
    const st = await fse.stat(full).catch(() => null);
    if (st?.isDirectory()) out.push(name);
  }
  return out.sort();
}

export function parseBannerMeta(bannerName) {
  // nfl_300x250 => { name: "nfl", size: "300x250", width: 300, height: 250 }
  const m = bannerName.match(/^(.*)_(\d+)x(\d+)$/);
  if (!m) {
    return { banner: bannerName, name: bannerName, size: "", width: 0, height: 0 };
  }
  return {
    banner: bannerName,
    name: m[1],
    size: `${m[2]}x${m[3]}`,
    width: Number(m[2]),
    height: Number(m[3]),
  };
}
