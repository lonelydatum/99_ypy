import path from "node:path";
import fse from "fs-extra";
import * as sass from "sass";

export async function buildCssText({ devDir, bannerName }) {
  const scssEntry = path.join(devDir, bannerName, "_styles", "scss", "main.scss");
  if (!(await fse.pathExists(scssEntry))) return "";

  const result = sass.compile(scssEntry, {
    loadPaths: [path.join(devDir, bannerName, "_styles", "scss"), path.join(devDir, "_common", "styles")],
    style: "compressed",
    sourceMap: false,
    silenceDeprecations: ["import"],
  });

  return result.css || "";
}
