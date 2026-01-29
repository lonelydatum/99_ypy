import path from "node:path";
import { spawn } from "node:child_process";
import chokidar from "chokidar";
import browserSync from "browser-sync";
import fs from "node:fs";

import { getRoot, devDir as devDirFn, distDir as distDirFn } from "./lib/paths.mjs";

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

function runNode(root, scriptRel, extraArgs = []) {
  return spawn(process.execPath, [scriptRel, ...extraArgs], {
    cwd: root,
    stdio: "inherit",
  });
}

async function runBuildOnce({ root, banner, mode }) {
  await new Promise((resolve, reject) => {
    const args = [];
    if (banner) args.push(`--banner=${banner}`);
    if (mode) args.push(`--mode=${mode}`);
    const p = runNode(root, "scripts/build.mjs", args);
    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`build failed (exit ${code})`));
    });
  });
}

const args = parseArgs(process.argv);
const root = getRoot();
const devDir = devDirFn(root);
const distDir = distDirFn(root);

const banner = args.banner || process.env.BANNER || null;

console.log("[dev] devDir:", devDir);
console.log("[dev] distDir:", distDir);

// 1) initial build
await runBuildOnce({ root, banner, mode: "dev" });

// 2) start BrowserSync (serves dist + live reload)
const bs = browserSync.create();
let lastBanner = banner || null;

function listDevBanners() {
  return fs
    .readdirSync(devDir, { withFileTypes: true })
    .filter((d) => d.isDirectory())
    .map((d) => d.name)
    .filter((name) => !name.startsWith("_")); // hide _common etc.
}

function bannerListHtml(banners) {
  return `<!doctype html>
<html>
<head>
  <meta charset="utf-8" />
  <title>Banners</title>
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <style>
    body{font-family:system-ui,-apple-system,Segoe UI,Roboto,sans-serif;padding:20px}
    .muted{color:#666;font-size:12px;margin:6px 0 14px}
    input{width:100%;max-width:520px;padding:10px 12px;font-size:14px;margin:0 0 14px;border:1px solid #ddd;border-radius:10px}
    .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(220px,1fr));gap:12px}
    a{display:block;padding:12px;border:1px solid #ddd;border-radius:12px;text-decoration:none;color:inherit}
    a:hover{background:#f6f6f6}
    .name{font-weight:600}
    .path{color:#666;font-size:12px;margin-top:4px}
  </style>
</head>
<body>
  <h1>Banners</h1>
  <div class="muted">Folders from <code>dev/</code> — links open built output in <code>dist/</code>.</div>
  <input id="q" placeholder="Filter… (type then press Enter)" autofocus />
  <div class="grid" id="list">
    ${banners
      .map((b) => `<a href="/${encodeURIComponent(b)}/"><div class="name">${b}</div><div class="path">/${b}/</div></a>`)
      .join("")}
  </div>
  <script>
    const q = document.getElementById('q');
    const links = Array.from(document.querySelectorAll('#list a'));
    function apply(){
      const s = q.value.trim().toLowerCase();
      let first = null;
      links.forEach(a=>{
        const ok = a.textContent.toLowerCase().includes(s);
        a.style.display = ok ? '' : 'none';
        if (ok && !first) first = a;
      });
      return first;
    }
    q.addEventListener('input', apply);
    q.addEventListener('keydown', (e)=>{
      if(e.key === 'Enter'){
        const first = apply();
        if(first) location.href = first.getAttribute('href');
      }
    });
  </script>
</body>
</html>`;
}

bs.init({
  server: { baseDir: distDir }, // ✅ serve built output
  port: 3000,
  open: true,
  notify: false,
  ghostMode: false,

  middleware: [
    (req, res, next) => {
      const m = req.url.match(/^\/([^/]+)\//);
      if (m && m[1] && m[1] !== "browser-sync") {
        lastBanner = m[1];
      }

      // Root: ALWAYS show list
      if (req.url === "/" || req.url === "/index.html") {
        const banners = listDevBanners();
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.end(bannerListHtml(banners));
      }

      if (req.url === "/__banners" || req.url === "/__banners/") {
        const banners = listDevBanners();
        res.setHeader("Content-Type", "text/html; charset=utf-8");
        return res.end(bannerListHtml(banners));
      }

      return next();
    },
  ],
});

// 3) rebuild queue (debounced + no overlap)
let timer = null;
let building = false;
let pending = false;

async function rebuild() {
  if (building) {
    pending = true;
    return;
  }
  building = true;

  try {
    await runBuildOnce({ root, banner, mode: "dev" });

    console.log("[dev] build complete → reloading");
    bs.reload();
  } catch (err) {
    console.error("[dev] build error:", err?.message || err);
  }

  building = false;
  if (pending) {
    pending = false;
    rebuild();
  }
}

// 4) watch dev directory
const watcher = chokidar.watch(devDir, {
  ignoreInitial: true,
  persistent: true,
  ignored: ["**/.DS_Store", "**/.git/**", "**/node_modules/**"],
  usePolling: true, // macOS + network drives friendly
  interval: 200,
  awaitWriteFinish: { stabilityThreshold: 200, pollInterval: 50 },
});

watcher.once("ready", () => {
  console.log("[dev] watcher ready — live rebuild enabled");
});

watcher.on("all", (event, file) => {
  const ext = path.extname(file).toLowerCase();
  const ok = [".ejs", ".scss", ".sass", ".js", ".png", ".jpg", ".jpeg", ".gif", ".svg", ".webp"].includes(ext);

  if (!ok) return;

  if (banner) {
    const rel = path.relative(devDir, file).replace(/\\/g, "/");
    const isCommon = rel.startsWith("_common/");
    const isBanner = rel.startsWith(`${banner}/`);
    if (!isCommon && !isBanner) return;
  }

  console.log(`[dev] ${event}: ${path.relative(root, file)}`);
  clearTimeout(timer);
  timer = setTimeout(() => rebuild(), 150);
});
