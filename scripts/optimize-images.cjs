"use strict";

const path = require("path");
const fs = require("fs/promises");
const fsSync = require("fs");
const fg = require("fast-glob");
const sharp = require("sharp");
const { execFile } = require("child_process");
const os = require("os");
const CONCURRENCY = Math.max(2, Math.min(8, os.cpus().length));

// scripts/.. = code/
const CODE_ROOT = path.resolve(__dirname, "..");

// default folders
const DEFAULT_INPUT = path.join(CODE_ROOT, "dev/_common/images");
const DEFAULT_OUTPUT = path.join(CODE_ROOT, "dev/_common/images_optimized");
const args = process.argv;

function getArg(name) {
  const i = args.indexOf(name);
  return i >= 0 ? args[i + 1] : null;
}

let pngquantPath;
let optipngPath;

async function loadBins() {
  if (!pngquantPath) {
    const pq = await import("pngquant-bin");
    pngquantPath = pq.default || pq;
  }
  if (!optipngPath) {
    const op = await import("optipng-bin");
    optipngPath = op.default || op;
  }
}

// const INPUT_DIR = path.resolve(
//     __dirname,
//     "../../code/dev/_common/images"
// );

// const OUTPUT_DIR = path.resolve(
//     __dirname,
//     "../../code/dev/_common/images_optimized"
// );

const INPUT_DIR = getArg("--in") || DEFAULT_INPUT;
const OUTPUT_DIR = getArg("--out") || DEFAULT_OUTPUT;

const JPEG_QUALITY = 78;
const PNG_COMPRESSION_LEVEL = 9;
const WEBP_QUALITY = 78;
function run(cmd, args) {
  return new Promise((res, rej) => {
    execFile(cmd, args, (err) => {
      if (err) rej(err);
      else res();
    });
  });
}

function isImage(file) {
  const ext = path.extname(file).toLowerCase();
  return [".png", ".jpg", ".jpeg", ".webp", ".gif", ".svg"].includes(ext);
}

async function ensureDir(dir) {
  await fs.mkdir(dir, { recursive: true });
}

async function copyFile(src, dst) {
  await ensureDir(path.dirname(dst));
  await fs.copyFile(src, dst);
}

async function optimizeOne(srcPath) {
  const rel = path.relative(INPUT_DIR, srcPath);
  const outPath = path.join(OUTPUT_DIR, rel);
  const ext = path.extname(srcPath).toLowerCase();

  // file can disappear between glob + processing (or be a broken symlink)
  if (!fsSync.existsSync(srcPath)) return;

  if (!isImage(srcPath)) return;

  // Copy types we don't want to process
  if (ext === ".gif" || ext === ".svg") {
    await copyFile(srcPath, outPath);
    return;
  }

  await ensureDir(path.dirname(outPath));

  const img = sharp(srcPath, { failOnError: false });

  if (ext === ".jpg" || ext === ".jpeg") {
    await img.jpeg({ quality: JPEG_QUALITY, mozjpeg: true }).toFile(outPath);
    return;
  }

  // if (ext === ".png") {
  //   await img
  //     .png({ compressionLevel: PNG_COMPRESSION_LEVEL, adaptiveFiltering: true })
  //     .toFile(outPath);
  //   return;
  // }

  if (ext === ".png") {
    await loadBins();

    const tmp = outPath + ".tmp.png";

    // Normalize PNG via sharp
    await img.png().toFile(tmp);

    try {
      // pngquant (palette + perceptual magic)
      await run(pngquantPath, [
        "--quality=40-80", // 👈 loosened
        "--speed=3", // 👈 faster (optional)
        "--output",
        outPath,
        tmp,
      ]);

      // optipng (final squeeze)
      await run(optipngPath, ["-o5", outPath]); // 👈 faster (optional)
    } catch (e) {
      // Fallback: if pngquant can't meet quality constraints, keep sharp result
      await fs.copyFile(tmp, outPath);
    } finally {
      // Clean temp even if things fail
      await fs.unlink(tmp).catch(() => {});
    }

    return;
  }

  if (ext === ".webp") {
    await img.webp({ quality: WEBP_QUALITY }).toFile(outPath);
    return;
  }

  await copyFile(srcPath, outPath);
}

async function main() {
  console.log("Input :", INPUT_DIR);
  console.log("Output:", OUTPUT_DIR);

  const files = await fg(["**/*.*"], {
    cwd: INPUT_DIR,
    absolute: true,
    followSymbolicLinks: false,
  });
  const images = files.filter(isImage);

  let i = 0;

  async function worker() {
    while (true) {
      const idx = i++;
      if (idx >= images.length) return;
      const f = images[idx];
      try {
        await optimizeOne(f);
      } catch (e) {
        console.error("Failed:", f, e?.message || e);
      }
    }
  }

  await Promise.all(Array.from({ length: CONCURRENCY }, worker));
  console.log("Done.");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
