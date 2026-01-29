export function rewriteHtmlForCleanOutput(html) {
  let out = html;

  // CSS/JS
  out = out.replaceAll("./_styles/css/main.css", "main.css");
  out = out.replaceAll("./main.css", "main.css"); // normalize
  out = out.replaceAll("_bundled/main.js", "main.js");

  // If any legacy common image path remains:
  // ../_common/images/300x250/nfl/phone_1.png -> 300x250/nfl/phone_1.png
  out = out.replaceAll("../_common/images/", "");

  // Flatten any remaining nested src/href asset paths to just basenames:
  // src="300x250/nfl/phone_1.png" -> src="phone_1.png"
  out = out.replace(/(\bsrc\s*=\s*["'])([^"']+)(["'])/gi, (m, pre, url, post) => {
    if (url.startsWith("http") || url.startsWith("data:")) return m;
    const clean = url.replace(/^\.\//, "");
    const base = clean.split("/").pop();
    return `${pre}${base}${post}`;
  });

  return out;
}
