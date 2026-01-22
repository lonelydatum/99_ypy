import { flipByElement } from "./flip.js";
import { olg } from "./proline.js";

// import {initYPY, ypyScroll} from './ypy_fx.js'
const banner = document.getElementById("banner");
const bannerSize = { w: banner.offsetWidth, h: banner.offsetHeight };

gsap.defaults({
  ease: "power3.out",
});

const READ_SUPERBOWL = { t1: 3, t2: 2 };

const READ_ALL = { superbowl: READ_SUPERBOWL };

const read = READ_ALL[universalBanner.name];
const { w, h } = bannerSize;

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

function init() {
  const tl = frame1();

  tl.from(".t1", { duration: 0.5, opacity: 0 }, "+=.3");
  tl.to(".t1", { duration: 0.3, opacity: 0 }, `+=${read.t1}`);
  tl.from(".t2", { duration: 0.3, opacity: 0 });

  tl.from([".bg", ".end_legal"], { duration: 0.3, opacity: 0 }, `+=${read.t2}`);
  tl.from(".end_device", { duration: 0.3, opacity: 0 }, `+=.3`);
  tl.from(".end_txt", { duration: 0.3, opacity: 0 }, `+=.3`);
  tl.from(".end_cta", { duration: 0.3, opacity: 0 }, `+=.3`);

  tl.to(".logo", { duration: 0.3, opacity: 0, y: "+=50" }, `+=.3`);
  tl.add(olg());
}

// return tl

export { init, olg, bannerSize, read, frame1 };
