import browserSync from "browser-sync";
import path from "node:path";
import { getRoot, docsDir } from "./lib/paths.mjs";

const root = getRoot();
const serveDir = docsDir(root); // 👈 serve from /docs
console.log(serveDir);

const bs = browserSync.create();

bs.init({
  server: {
    baseDir: serveDir,
    directory: true, // optional: clickable folder list
  },
  port: 3000,
  open: true,
  notify: false,
  ghostMode: false,
  files: [
    path.join(serveDir, "**/*.html"),
    path.join(serveDir, "**/*.css"),
    path.join(serveDir, "**/*.js"),
    path.join(serveDir, "**/*.png"),
    path.join(serveDir, "**/*.jpg"),
    path.join(serveDir, "**/*.jpeg"),
    path.join(serveDir, "**/*.svg"),
    path.join(serveDir, "**/*.gif"),
    path.join(serveDir, "**/*.webp"),
  ],
});
