import fs from "node:fs";
import path from "node:path";
import { spawn } from "node:child_process";
import { getRoot, distDir } from "./lib/paths.mjs";

const root = getRoot();
const deployDir = distDir(root); // docs/deploy
const zipDir = path.join(root, "docs", "zip");

fs.mkdirSync(zipDir, { recursive: true });

function zipFolder(folderName) {
  return new Promise((resolve, reject) => {
    const zipPath = path.join(zipDir, `${folderName}.zip`);

    console.log(`[zip] ${folderName} -> ${zipPath}`);

    const p = spawn("zip", ["-r", zipPath, folderName], {
      cwd: deployDir,
      stdio: "inherit",
    });

    p.on("exit", (code) => {
      if (code === 0) resolve();
      else reject(new Error(`zip failed for ${folderName} (exit ${code})`));
    });
  });
}

async function main() {
  const entries = fs.readdirSync(deployDir, { withFileTypes: true });

  const banners = entries
    .filter((e) => e.isDirectory())
    .map((e) => e.name)
    .filter((name) => !name.startsWith(".")); // skip hidden

  if (!banners.length) {
    console.log("[zip] no banners found in", deployDir);
    return;
  }

  console.log(`[zip] found ${banners.length} banners`);

  for (const banner of banners) {
    try {
      await zipFolder(banner);
      console.log(`✅ zipped ${banner}`);
    } catch (err) {
      console.error(`❌ ${err.message}`);
    }
  }

  console.log("🎉 all done");
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
