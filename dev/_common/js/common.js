import { olg } from "./proline.js";

const banner = document.getElementById("banner");
const bannerSize = { w: banner.offsetWidth, h: banner.offsetHeight };

gsap.defaults({
  ease: "power3.out",
});

const READ_ALL = {
  superbowl: { t1: 3, t2: 2 },
  theme1Beanie: {
    t1: 1.8,
    t2: 2.8,
    legal:
      "© 2026 IGT. All rights reserved. Must be 19 years of age or older and a resident of Ontario, located in the province to play online casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply.",
  },
  theme2GreenGuy: {
    t1: 2.6,
    t2: 2,
    legal:
      "©2026 Light & Wonder. All rights reserved. Must be 19 years of age or older and a resident of Ontario, located in the province to play online casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply.",
  },
  theme3Tattoo: {
    t1: 2.6,
    t2: 2,
    legal:
      "©2026 Evolution. All rights reserved. Must be 19 years of age or older and a resident of Ontario, located in the province to play online casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply.",
  },
  theme4PinkGuy: {
    t1: 2.4,
    t2: 2.6,
    legal:
      "© 2026 IGT. Must be 19 years of age or older and a resident of Ontario, located in the province to play online casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply.",
  },
  gameRangeArcade: {
    t1: 3,
    t2: 2,
    legal:
      "©2026 Light & Wonder. All rights reserved. Must be 19 years of age or older and a resident of Ontario, located in the province to play online casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply.",
  },
  gameRangeCat: {
    t1: 3,
    t2: 2,
    legal:
      "©2026 Evolution. All rights reserved. Must be 19 years of age or older and a resident of Ontario, located in the province to play online casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply.",
  },
  supportSafety: {
    t1: 2,
    t2: 2,
    legal:
      "© 2026 IGT. Must be 19 years of age or older and a resident of Ontario, located in the province to play online casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply. *Voted most trusted Online Casino brand by Ontario shoppers based on the 2026 Brandspark® Canadian Trust Study.",
  },
  exclusive: {
    t1: 5,
    legal:
      "©2026 Blueprint. All rights reserved. Must be 19 years of age or older and a resident of Ontario, located in the province to play online casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply.",
  },
  saintPatty: {
    t1: 3,
    t2: 2,
    legal:
      "©2026 Light & Wonder. All rights reserved. Must be 19 years of age or older and a resident of Ontario, located in the province to play online casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply.",
  },
};
const read = READ_ALL[universalBanner.name];

if (read.legal) {
  document.getElementById("legalContent").innerHTML = read.legal;
}

function frame1() {
  const tl = new TimelineMax({
    onComplete: () => {
      if (document.getElementById("legalBtn")) {
        TweenLite.set("#legalBtn", { display: "block" });
      }
    },
  });

  tl.set(".frame1", { opacity: 1 });

  tl.from(".ypy", { duration: 0.3, stagger: 0.3, opacity: 0, y: "-=100" }, "+=.2");

  if (document.querySelector(".hero2")) {
    tl.from(".hero2", { duration: 0.5, opacity: 0 }, "+=1");
  }

  return tl;
}

function frameEnd(tl) {
  tl.from([".bg", ".end_legal"], { duration: 0.3, opacity: 0 }, `+=${read.t2}`);
  tl.from(".end_device", { duration: 0.3, opacity: 0 }, `+=.3`);
  tl.from(".end_txt", { duration: 0.3, opacity: 0 }, `+=.3`);
  tl.from(".end_cta", { duration: 0.3, opacity: 0 }, `+=.3`);

  tl.to(".logo", { duration: 0.3, opacity: 0, y: "+=50" }, `+=.3`);
  tl.add(olg());
}

function init() {
  const tl = frame1();
  tl.from(".device", { duration: 0.5, opacity: 0 });

  tl.from(".t1", { duration: 0.5, opacity: 0 }, "+=.3");
  tl.to(".t1", { duration: 0.3, opacity: 0 }, `+=${read.t1}`);
  tl.from(".t2", { duration: 0.3, opacity: 0 });

  frameEnd(tl);
}

// return tl

export { init, olg, bannerSize, read, frame1, frameEnd };
