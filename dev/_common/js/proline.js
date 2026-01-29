CustomEase.create(
  "custom",
  "M0,0 C0.14,0 0.234,0.438 0.264,0.561 0.305,0.728 0.4,1.172 0.55,1.172 0.652,1.172 0.722,1.102 0.77,1.024 0.834,0.93 0.89,0.946 0.916,0.946 0.952,0.946 1,1 1,1 ",
);

function olg() {
  TweenLite.set("#olg", { opacity: 1 });

  const tlMain = new TimelineMax({});

  const tlChild = new TimelineMax({});

  tlChild.to("#bluewedge1", { duration: 0.5, ease: "power1.inOut", scaleY: 1, scale: 1, x: 0, y: 0 }, 0);
  tlChild
    .to("#redwedge1", { duration: 0.8, ease: "power1.inOut", scaleY: 1, scale: 1, x: 0, y: 0 }, 0)

    .from("#group-o", { duration: 1, y: 200, ease: "custom" }, 0)
    .from("#group-l", { duration: 1, y: 200, ease: "custom" }, 0.1)
    .from("#group-g", { duration: 1, y: 200, ease: "custom" }, 0.2)

    .from("#group-o", { duration: 0.8, scale: 0.4, ease: "power1.out" }, 0.3)
    .from("#group-l", { duration: 0.8, scale: 0.4, ease: "power1.out" }, 0.4)
    .from("#group-g", { duration: 0.8, scale: 0.4, ease: "power1.out" }, 0.5)

    .from("#letter-o", { duration: 0.25, scale: 0, ease: "back.out(2)", svgOrigin: "28pt 75pt" }, 0.9)
    .from("#letter-l", { duration: 0.25, scale: 0, ease: "back.out(2)", svgOrigin: "55pt 75pt" }, 1)
    .from("#letter-g", { duration: 0.25, scale: 0, ease: "back.out(2)", svgOrigin: "80pt 75pt" }, 1.1);

  if (document.getElementById("logo_static")) {
    tlMain.to("#logo_static", { duration: 0.3, opacity: 0, y: "+=50" }, `+=.3`);
  }
  tlMain.add(tlChild);

  return tlMain;
}

export { olg };
