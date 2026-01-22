// /docs/app.js

// ---- DATA ----
const SS = { type: "SS", title: "160x600" };
const BB = { type: "BB", title: "300x250" };
const DBB = { type: "DBB", title: "300x600" };
const M320 = { type: { w: 320, h: 50 }, title: "320x50" };
const LB = { type: "LB", title: "728x90" };
const M970x250 = { type: { w: 970, h: 250 }, title: "970x250" };

const data = {
  title: "PROLINE KAMBI",
  banners: [
    {
      title: "Same Game Parlay",
      list: [
        { ...SS, path: "" },
        { ...BB, path: "" },
        { ...DBB, path: "" },
        { ...M320, path: "" },
        { ...LB, path: "" },
        { ...M970x250, path: "" },
      ],
    },
    {
      title: "Early Payouts",
      list: [
        { ...SS, path: "" },
        { ...BB, path: "" },
        { ...DBB, path: "" },
        { ...M320, path: "" },
        { ...LB, path: "" },
        { ...M970x250, path: "" },
      ],
    },
    {
      title: "Plus Betting Easier",
      list: [
        { ...SS, path: "plusBettingEasier_160x600" },
        { ...BB, path: "plusBettingEasier_300x250" },
        { ...DBB, path: "plusBettingEasier_300x600" },
        { ...M320, path: "plusBettingEasier_320x50" },
        { ...LB, path: "plusBettingEasier_728x90" },
        { ...M970x250, path: "plusBettingEasier_970x250" },
      ],
    },
    {
      title: "Play In Store",
      list: [
        { ...SS, path: "playInStore_160x600" },
        { ...BB, path: "playInStore_300x250" },
        { ...DBB, path: "playInStore_300x600" },
        { ...M320, path: "playInStore_320x50" },
        // NOTE: these two look like copy/paste bugs in your data (still pointing to plusBettingEasier)
        { ...LB, path: "plusBettingEasier_728x90" },
        { ...M970x250, path: "plusBettingEasier_970x250" },
      ],
    },
  ],
};

// ---- CONFIG ----
const DEPLOY_DIR = "deploy";

// ---- HELPERS ----

function downloadBlob(blob, filename) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function safeFilename(s) {
  return String(s || "")
    .trim()
    .replace(/[^\w\-]+/g, "_")
    .replace(/_+/g, "_")
    .replace(/^_+|_+$/g, "");
}

function sizeFromType(type) {
  if (type && typeof type === "object" && Number.isFinite(type.w) && Number.isFinite(type.h)) {
    return { w: type.w, h: type.h };
  }
  switch (type) {
    case "SS":
      return { w: 160, h: 600 };
    case "BB":
      return { w: 300, h: 250 };
    case "DBB":
      return { w: 300, h: 600 };
    case "LB":
      return { w: 728, h: 90 };
    default:
      return { w: 300, h: 250 };
  }
}

function clampIndex(n, max) {
  if (!Number.isFinite(n)) return 0;
  if (n < 0) return 0;
  if (n > max) return max;
  return n;
}

// hash format: #/<bannerGroupIndex>/<sizeIndex>
function parseHash() {
  const raw = (location.hash || "").replace(/^#/, "");
  const parts = raw.split("/").filter(Boolean);
  const bannerGroupIndex = parts.length >= 1 ? parseInt(parts[0], 10) : 0;
  const sizeIndex = parts.length >= 2 ? parseInt(parts[1], 10) : 0;
  return { bannerGroupIndex, sizeIndex };
}

function setHash(bannerGroupIndex, sizeIndex) {
  location.hash = `#/${bannerGroupIndex}/${sizeIndex}`;
}

function bannerSrc(path) {
  const safe = String(path || "").replace(/^\//, "");
  if (!safe) return null; // empty path => don't iframe it
  return `${DEPLOY_DIR}/${safe}/index.html`;
}

function zipSrc(path) {
  const safe = String(path || "").replace(/^\//, "");
  if (!safe) return null;
  return `zip/${safe}.zip`;
}

// ---- RENDER ----
function mount() {
  const root = document.getElementById("app");
  root.innerHTML = "";

  const app = document.createElement("div");
  app.className = "app";

  const sidebar = document.createElement("aside");
  sidebar.className = "sidebar";

  const title = document.createElement("h1");
  title.className = "title";
  title.textContent = data.title || "BANNERS";
  sidebar.appendChild(title);

  const preview = document.createElement("main");
  preview.className = "preview";

  const previewMeta = document.createElement("div");
  previewMeta.className = "meta";
  preview.appendChild(previewMeta);

  const previewInner = document.createElement("div");
  previewInner.className = "preview-inner";
  preview.appendChild(previewInner);

  const frameWrap = document.createElement("div");
  frameWrap.className = "frame-wrap";
  previewInner.appendChild(frameWrap);

  const iframe = document.createElement("iframe");
  iframe.setAttribute("loading", "lazy");
  iframe.setAttribute("referrerpolicy", "no-referrer");
  frameWrap.appendChild(iframe);

  const below = document.createElement("div");
  below.className = "below";
  previewInner.appendChild(below);

  // NEW: screenshot button (above zip link)
  const btnShot = document.createElement("button");
  btnShot.textContent = "download screenshot";
  btnShot.type = "button";
  btnShot.style.fontSize = "20px";
  btnShot.style.padding = "8px 12px";
  btnShot.style.borderRadius = "10px";
  btnShot.style.border = "1px solid #111";
  btnShot.style.background = "#fff";
  btnShot.style.cursor = "pointer";
  btnShot.style.display = "inline-block";
  btnShot.style.marginRight = "14px";
  below.appendChild(btnShot);

  btnShot.addEventListener("click", async () => {
    if (!currentGroup || !currentItem) return;

    async function exportJpegUnderLimit(canvas, maxKB = 50) {
      const maxBytes = maxKB * 1024;

      // quick helper
      const toBlobQ = (q) => new Promise((resolve) => canvas.toBlob(resolve, "image/jpeg", q));

      // If even very high quality fits, just use it
      let blob = await toBlobQ(0.95);
      if (blob && blob.size <= maxBytes) return blob;

      // If even low quality doesn't fit, fall back to lowest we'll try
      const minQ = 0.35;
      const maxQ = 0.95;

      let lo = minQ;
      let hi = maxQ;

      // We'll keep the best blob found that fits.
      let bestBlob = null;
      let bestQ = lo;

      // Binary search ~8 iterations is plenty
      for (let i = 0; i < 8; i++) {
        const mid = (lo + hi) / 2;
        const b = await toBlobQ(mid);
        if (!b) break;

        if (b.size <= maxBytes) {
          bestBlob = b;
          bestQ = mid;
          lo = mid; // try higher quality
        } else {
          hi = mid; // too big, lower quality
        }
      }

      // If we never found a fit, return the lowest quality blob
      if (!bestBlob) {
        bestBlob = await toBlobQ(minQ);
      }

      // optional debug
      // console.log("jpeg q", bestQ.toFixed(3), "sizeKB", (bestBlob.size/1024).toFixed(1));

      return bestBlob;
    }

    // must have a loaded banner
    try {
      const doc = iframe.contentDocument;
      const win = iframe.contentWindow;
      if (!doc || !win) throw new Error("iframe not ready");

      // inject html2canvas into iframe if missing
      if (!win.html2canvas) {
        await new Promise((resolve, reject) => {
          const s = doc.createElement("script");
          s.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
          s.onload = resolve;
          s.onerror = () => reject(new Error("Failed to load html2canvas"));
          doc.head.appendChild(s);
        });
      }

      doc.querySelectorAll("img[src]").forEach((img) => {
        const raw = img.getAttribute("src");
        if (!raw) return;
        // already absolute or data:
        if (/^(data:|https?:|blob:)/i.test(raw)) return;

        img.src = new URL(raw, doc.location.href).href;
      });

      // choose what to capture:
      // 1) common banner root ids/classes if you have them
      // 2) fallback to body
      const target =
        doc.querySelector("#banner") || doc.querySelector("#ad") || doc.querySelector(".banner") || doc.body;

      // wait one frame (helps if animation just started)
      await new Promise((r) => win.requestAnimationFrame(r));

      async function inlineSvgToPng(doc) {
        const svgs = Array.from(doc.querySelectorAll("svg"));
        if (!svgs.length) return;

        await Promise.all(
          svgs.map((svg) => {
            return new Promise((resolve) => {
              try {
                const rect = svg.getBoundingClientRect();
                const w = Math.max(1, Math.round(rect.width));
                const h = Math.max(1, Math.round(rect.height));

                // if it's not visible, skip
                if (w <= 1 || h <= 1) return resolve();

                const xml = new XMLSerializer().serializeToString(svg);

                const svgBlob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
                const url = URL.createObjectURL(svgBlob);

                const img = new Image();
                img.onload = () => {
                  try {
                    const canvas = doc.createElement("canvas");
                    canvas.width = w;
                    canvas.height = h;
                    const ctx = canvas.getContext("2d");

                    // Try to get SVG intrinsic size from viewBox/attrs
                    let iw = w,
                      ih = h;
                    try {
                      const vb = svg.viewBox && svg.viewBox.baseVal;
                      if (vb && vb.width && vb.height) {
                        iw = vb.width;
                        ih = vb.height;
                      } else {
                        const aw = parseFloat(svg.getAttribute("width"));
                        const ah = parseFloat(svg.getAttribute("height"));
                        if (Number.isFinite(aw) && Number.isFinite(ah)) {
                          iw = aw;
                          ih = ah;
                        }
                      }
                    } catch {}

                    // IMPORTANT: draw with aspect preserved
                    drawContain(ctx, img, w, h, iw, ih);

                    const png = canvas.toDataURL("image/png");

                    const replacement = doc.createElement("img");
                    replacement.src = png;

                    const cs = win.getComputedStyle(svg);
                    replacement.style.width = cs.width;
                    replacement.style.height = cs.height;
                    replacement.style.position = cs.position;
                    replacement.style.left = cs.left;
                    replacement.style.top = cs.top;
                    replacement.style.right = cs.right;
                    replacement.style.bottom = cs.bottom;
                    replacement.style.transform = cs.transform;
                    replacement.style.transformOrigin = cs.transformOrigin;
                    replacement.style.display = cs.display;
                    replacement.style.zIndex = cs.zIndex;
                    replacement.style.pointerEvents = "none";

                    // prevent any further distortion
                    replacement.style.objectFit = "contain";
                    replacement.style.objectPosition = "center";

                    svg.replaceWith(replacement);
                  } catch (e) {
                    // ignore
                  } finally {
                    URL.revokeObjectURL(url);
                    resolve();
                  }
                };

                img.onerror = () => {
                  URL.revokeObjectURL(url);
                  resolve();
                };

                img.src = url;
              } catch {
                resolve();
              }
            });
          }),
        );
      }

      // Rasterize <img src="*.svg"> into <img src="data:image/png"> so html2canvas can render it
      // Draw an image into a canvas using "contain" (preserve aspect ratio)
      function drawContain(ctx, img, cw, ch, iw, ih) {
        const s = Math.min(cw / iw, ch / ih);
        const dw = Math.round(iw * s);
        const dh = Math.round(ih * s);
        const dx = Math.round((cw - dw) / 2);
        const dy = Math.round((ch - dh) / 2);
        ctx.clearRect(0, 0, cw, ch);
        ctx.drawImage(img, dx, dy, dw, dh);
      }

      // Rasterize <img src="*.svg"> into <img src="data:image/png"> WITHOUT squishing
      async function rasterizeSVGImages(doc) {
        const imgs = Array.from(doc.querySelectorAll("img[src$='.svg'], img[src*='.svg?']"));
        if (!imgs.length) return;

        await Promise.all(
          imgs.map((imgEl) => {
            return new Promise((resolve) => {
              try {
                const url = imgEl.src;

                // Use *rendered box* size (SVG often has no naturalWidth/Height)
                const r = imgEl.getBoundingClientRect();
                const w = Math.max(1, Math.round(r.width || imgEl.width || 100));
                const h = Math.max(1, Math.round(r.height || imgEl.height || 100));

                const canvas = doc.createElement("canvas");
                canvas.width = w;
                canvas.height = h;
                const ctx = canvas.getContext("2d");

                const tmp = new Image();
                tmp.crossOrigin = "anonymous";

                tmp.onload = () => {
                  try {
                    // Use intrinsic size if available; fall back to rendered size
                    const iw = Math.max(1, tmp.naturalWidth || w);
                    const ih = Math.max(1, tmp.naturalHeight || h);

                    // IMPORTANT: contain (no distortion)
                    drawContain(ctx, tmp, w, h, iw, ih);

                    imgEl.src = canvas.toDataURL("image/png");

                    // Prevent layout stretching by CSS rules
                    imgEl.style.objectFit = "contain";
                    imgEl.style.objectPosition = "center";
                  } catch {
                    // ignore
                  }
                  resolve();
                };

                tmp.onerror = () => resolve();
                tmp.src = url;
              } catch {
                resolve();
              }
            });
          }),
        );
      }

      await new Promise((r) => win.requestAnimationFrame(r));
      await inlineSvgToPng(doc); // <-- wait for replacements
      await rasterizeSVGImages(doc);

      const canvas = await win.html2canvas(target, {
        backgroundColor: null, // keep transparency if any
        scale: 1, // 1 = exact pixels; increase if you want retina output
        useCORS: true,
      });

      const blob = await exportJpegUnderLimit(canvas, 50);

      if (!blob) throw new Error("Failed to encode PNG");

      const { w, h } = sizeFromType(currentItem.type);
      const name = safeFilename(currentItem.path || currentGroup.title || "banner");
      console.log(name);

      const filename = `${name}.jpg`;
      downloadBlob(blob, filename);
    } catch (err) {
      console.error(err);
      alert(
        "Screenshot failed.\n\nCommon causes:\n- iframe not loaded yet\n- cross-origin content inside the banner\n- CSP blocks loading html2canvas CDN\n\nCheck console for details.",
      );
    }
  });

  const dl = document.createElement("a");
  dl.textContent = "download zip file";
  dl.href = "#";
  dl.target = "_blank";
  dl.rel = "noopener";
  below.appendChild(dl);

  //   const note = document.createElement("div");
  //   note.className = "note";
  //   note.textContent = "Hash routing: #/<bannerGroupIndex>/<sizeIndex>. Example: #/2/1";
  //   preview.appendChild(note);

  // Sidebar sections
  const sections = [];
  data.banners.forEach((bannerGroup, gi) => {
    const section = document.createElement("section");
    section.className = "section";

    const head = document.createElement("div");
    head.className = "section-head";

    const h3 = document.createElement("h3");
    h3.textContent = bannerGroup.title || `Banner ${gi + 1}`;
    head.appendChild(h3);

    const toggle = document.createElement("span");
    toggle.className = "toggle";
    toggle.textContent = "(expand)";
    head.appendChild(toggle);

    section.appendChild(head);

    const ul = document.createElement("ul");
    ul.className = "sizes";

    bannerGroup.list.forEach((item, si) => {
      const li = document.createElement("li");
      li.className = "size-item";
      li.textContent = item.title || `Size ${si + 1}`;
      li.addEventListener("click", (e) => {
        e.stopPropagation(); // prevent collapsing/expanding when clicking size
        setHash(gi, si);
      });
      ul.appendChild(li);
    });

    section.appendChild(ul);

    head.addEventListener("click", () => {
      const isOpen = section.classList.toggle("open");
      toggle.textContent = isOpen ? "(collapse)" : "(expand)";
    });

    sidebar.appendChild(section);
    sections.push({ section, toggle, ul });
  });

  app.appendChild(sidebar);
  app.appendChild(preview);
  root.appendChild(app);

  function renderSelection() {
    const parsed = parseHash();
    const gi = clampIndex(parsed.bannerGroupIndex, data.banners.length - 1);
    const group = data.banners[gi] || data.banners[0];

    const si = clampIndex(parsed.sizeIndex, (group.list || []).length - 1);
    const item = (group.list || [])[si] || (group.list || [])[0];

    currentGroup = group;
    currentItem = item;

    // open the selected section and highlight selected size
    sections.forEach((s, idx) => {
      const shouldOpen = idx === gi;
      s.section.classList.toggle("open", shouldOpen);
      s.toggle.textContent = shouldOpen ? "(collapse)" : "(expand)";

      Array.from(s.ul.children).forEach((li, liIdx) => {
        li.classList.toggle("active", idx === gi && liIdx === si);
      });
    });

    const { w, h } = sizeFromType(item.type);
    iframe.style.width = `${w}px`;
    iframe.style.height = `${h}px`;

    const src = bannerSrc(item.path);
    if (!src) {
      iframe.removeAttribute("src");
      dl.style.display = "none";
      previewMeta.innerHTML = `<b>${group.title || ""}</b> — ${item.title || ""} — <span style="color:#b00">Missing path</span>`;
      return;
    }

    btnShot.style.display = "";

    previewMeta.innerHTML = `<b>${group.title || ""}</b>  — <span>${w}×${h}</span> `;

    // zip link
    const z = zipSrc(item.path);

    if (z) {
      dl.style.display = "";
      dl.href = z;
    } else {
      dl.style.display = "none";
    }

    // cache bust
    iframe.src = `${src}?cb=${Date.now()}`;
  }

  let currentGroup = null;
  let currentItem = null;

  window.addEventListener("hashchange", renderSelection);

  if (!location.hash || location.hash === "#") setHash(0, 0);
  else renderSelection();
}

document.addEventListener("DOMContentLoaded", mount);
