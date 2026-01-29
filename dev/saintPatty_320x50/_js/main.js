import { olg, read } from "../../_common/js/common.js";

function init() {
  const tl = new TimelineMax({
    onComplete: () => {
      if (document.getElementById("legalBtn")) {
        TweenLite.set("#legalBtn", { display: "block" });
      }
    },
  });

  tl.set(".frame1", { opacity: 1 });

  tl.from(".ypy", { duration: 0.3, stagger: 0.3, opacity: 0, y: "-=50" }, "+=.2");

  tl.to(".ypy", { opacity: 0, duration: 0.2 }, "+=.7");
  tl.from(".t1", { opacity: 0, duration: 0.3 }, "+=.2");

  tl.to(".t1", { opacity: 0, duration: 0.2 }, `+=${read.t1}`);
  tl.from(".t2", { opacity: 0, duration: 0.3 }, "+=.3");

  tl.to(".t2", { opacity: 0, duration: 0.2 }, `+=${read.t2}`);

  tl.from([".end_txt", ".end_legal"], { opacity: 0, duration: 0.3 }, "+=.3");
  tl.from(".end_cta", { opacity: 0, duration: 0.3 }, "+=.3");
  tl.to(".logo", { duration: 0.3, opacity: 0, y: "+=50" }, `+=.3`);
  tl.add(olg());
}

init();
