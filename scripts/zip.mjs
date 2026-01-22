import path from "node:path";
import { spawn } from "node:child_process";
import fs from "node:fs";
import { getRoot, distDir } from "./lib/paths.mjs";

const root = getRoot();
const deployDir = distDir(root); // docs/deploy
const zipDir = path.join(root, "docs", "zip");
const zipFile = path.join(zipDir, "file.zip");

fs.mkdirSync(zipDir, { recursive: true });

console.log("[zip] zipping", deployDir, "->", zipFile);

const p = spawn("zip", ["-r", zipFile, path.basename(deployDir)], {
  cwd: path.dirname(deployDir),
  stdio: "inherit",
});

p.on("exit", (code) => {
  if (code === 0) {
    console.log("✅ zip created:", zipFile);
  } else {
    console.error("❌ zip failed (exit", code + ")");
    process.exit(code);
  }
});
