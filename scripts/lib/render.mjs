import path from "node:path";
import fse from "fs-extra";
import ejs from "ejs";

export async function renderBannerHtml({ devDir, bannerName, context }) {
  const bannerDir = path.join(devDir, bannerName);
  const entry = path.join(bannerDir, "index.ejs");

  if (!(await fse.pathExists(entry))) {
    throw new Error(`[${bannerName}] Missing index.ejs: ${entry}`);
  }

  const commonTemplates = path.join(devDir, "_common", "templates");

  // views makes include("_head") work
  return await ejs.renderFile(entry, context, {
    // async: true,  <-- REMOVE THIS
    filename: entry,
    views: [bannerDir, commonTemplates],
  });
}
