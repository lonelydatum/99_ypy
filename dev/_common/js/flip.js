function flipByElement(name, opts = {}) {
  const rootEl = document.querySelector(name);
  const pos = rootEl.querySelector(".pos");
  const front = rootEl.querySelector("img.front");
  if (!pos || !front) return null;

  const {
    left = 0,
    top = 0,
    perspective = 1000,
    drop = 160,
    dur = 1.2,
    spins = 4,
    axis = "X", // "X" or "Y"
    backface = "visible", // "visible" or "hidden"
    ease = "power3.out",
  } = opts;

  const w = front.naturalWidth || front.width;
  const h = front.naturalHeight || front.height;

  // Make sure the wrapper can provide perspective
  gsap.set(rootEl, {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    perspective,
  });

  // Layout position
  gsap.set(pos, { position: "absolute", left, top });

  // Ensure the image has a real box
  gsap.set(front, {
    display: "block",
    width: w,
    height: h,
    transformStyle: "preserve-3d",
    transformPerspective: perspective,
    transformOrigin: "50% 0%",
    backfaceVisibility: backface,
    force3D: true,
  });

  const rotProp = axis === "Y" ? "rotationY" : "rotationX";

  // One tween (no overwrite fights)
  return gsap.fromTo(
    front,
    { y: "-=100", opacity: 0, [rotProp]: 0 },
    { y: 0, opacity: 1, [rotProp]: 360 * spins, duration: dur, ease },
  );

  return null;
}

export { flipByElement };
