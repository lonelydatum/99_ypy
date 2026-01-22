import { downloadBlob, safeFilename, sizeFromType } from "./utils.js";

// draw image into canvas preserving aspect ratio
function drawContain(ctx, img, cw, ch, iw, ih) {
  const s = Math.min(cw / iw, ch / ih);
  const dw = Math.round(iw * s);
  const dh = Math.round(ih * s);
  const dx = Math.round((cw - dw) / 2);
  const dy = Math.round((ch - dh) / 2);
  ctx.clearRect(0, 0, cw, ch);
  ctx.drawImage(img, dx, dy, dw, dh);
}

async function exportJpegUnderLimit(canvas, maxKB = 50) {
  const maxBytes = maxKB * 1024;
  const toBlobQ = (q) => new Promise((r) => canvas.toBlob(r, "image/jpeg", q));

  let blob = await toBlobQ(0.95);
  if (blob && blob.size <= maxBytes) return blob;

  let lo = 0.35;
  let hi = 0.95;
  let best = null;

  for (let i = 0; i < 8; i++) {
    const mid = (lo + hi) / 2;
    const b = await toBlobQ(mid);
    if (!b) break;

    if (b.size <= maxBytes) {
      best = b;
      lo = mid;
    } else {
      hi = mid;
    }
  }

  return best || (await toBlobQ(0.35));
}

async function ensureHtml2Canvas(doc, win) {
  if (win.html2canvas) return;
  await new Promise((resolve, reject) => {
    const s = doc.createElement("script");
    s.src = "https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js";
    s.onload = resolve;
    s.onerror = reject;
    doc.head.appendChild(s);
  });
}

async function inlineSvgToPng(doc, win) {
  const svgs = Array.from(doc.querySelectorAll("svg"));
  if (!svgs.length) return;

  await Promise.all(
    svgs.map((svg) => {
      return new Promise((resolve) => {
        try {
          const rect = svg.getBoundingClientRect();
          const w = Math.max(1, Math.round(rect.width));
          const h = Math.max(1, Math.round(rect.height));
          if (w <= 1 || h <= 1) return resolve();

          const xml = new XMLSerializer().serializeToString(svg);
          const blob = new Blob([xml], { type: "image/svg+xml;charset=utf-8" });
          const url = URL.createObjectURL(blob);

          const img = new Image();
          img.onload = () => {
            try {
              const canvas = doc.createElement("canvas");
              canvas.width = w;
              canvas.height = h;
              const ctx = canvas.getContext("2d");

              let iw = w,
                ih = h;
              const vb = svg.viewBox && svg.viewBox.baseVal;
              if (vb && vb.width && vb.height) {
                iw = vb.width;
                ih = vb.height;
              }

              drawContain(ctx, img, w, h, iw, ih);

              const replacement = doc.createElement("img");
              replacement.src = canvas.toDataURL("image/png");

              const cs = win.getComputedStyle(svg);
              Object.assign(replacement.style, {
                width: cs.width,
                height: cs.height,
                position: cs.position,
                left: cs.left,
                top: cs.top,
                right: cs.right,
                bottom: cs.bottom,
                transform: cs.transform,
                transformOrigin: cs.transformOrigin,
                display: cs.display,
                zIndex: cs.zIndex,
                pointerEvents: "none",
                objectFit: "contain",
                objectPosition: "center",
              });

              svg.replaceWith(replacement);
            } catch {}
            URL.revokeObjectURL(url);
            resolve();
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

async function rasterizeSVGImages(doc) {
  const imgs = Array.from(doc.querySelectorAll("img[src$='.svg'], img[src*='.svg?']"));
  if (!imgs.length) return;

  await Promise.all(
    imgs.map((imgEl) => {
      return new Promise((resolve) => {
        try {
          const r = imgEl.getBoundingClientRect();
          const w = Math.max(1, Math.round(r.width || 100));
          const h = Math.max(1, Math.round(r.height || 100));

          const canvas = doc.createElement("canvas");
          canvas.width = w;
          canvas.height = h;
          const ctx = canvas.getContext("2d");

          const tmp = new Image();
          tmp.crossOrigin = "anonymous";
          tmp.onload = () => {
            const iw = Math.max(1, tmp.naturalWidth || w);
            const ih = Math.max(1, tmp.naturalHeight || h);
            drawContain(ctx, tmp, w, h, iw, ih);
            imgEl.src = canvas.toDataURL("image/png");
            imgEl.style.objectFit = "contain";
            imgEl.style.objectPosition = "center";
            resolve();
          };
          tmp.onerror = () => resolve();
          tmp.src = imgEl.src;
        } catch {
          resolve();
        }
      });
    }),
  );
}

export function makeScreenshotHandler({ iframe, getSelection }) {
  return async function () {
    const sel = getSelection();
    if (!sel) return;

    const { group, item } = sel;

    try {
      const doc = iframe.contentDocument;
      const win = iframe.contentWindow;
      if (!doc || !win) throw new Error("iframe not ready");

      await ensureHtml2Canvas(doc, win);

      // make image URLs absolute
      doc.querySelectorAll("img[src]").forEach((img) => {
        const raw = img.getAttribute("src");
        if (!raw || /^(data:|https?:|blob:)/i.test(raw)) return;
        img.src = new URL(raw, doc.location.href).href;
      });

      const target =
        doc.querySelector("#banner") || doc.querySelector("#ad") || doc.querySelector(".banner") || doc.body;

      await new Promise((r) => win.requestAnimationFrame(r));
      await inlineSvgToPng(doc, win);
      await rasterizeSVGImages(doc);

      const canvas = await win.html2canvas(target, {
        backgroundColor: "#00c853",
        scale: 2,
        useCORS: true,
      });

      const blob = await exportJpegUnderLimit(canvas, 48);
      if (!blob) throw new Error("encode failed");

      const { w, h } = sizeFromType(item.type);
      const name = safeFilename(item.path || group.title || "banner");
      const filename = `${name}.jpg`;

      downloadBlob(blob, filename);
    } catch (e) {
      console.error(e);
      alert("Screenshot failed — check console for details.");
    }
  };
}
