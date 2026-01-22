import { read, olg } from "../../_common/js/common.js";

function init() {
  const tl = gsap.timeline({
    onComplete: () => {
      if (document.getElementById("legalBtn")) {
        gsap.set("#legalBtn", { display: "block" });
      }
    },
  });

  tl.set(".frame1", { opacity: 1 });

  tl.from(".ypy", { duration: 0.3, stagger: 0.3, opacity: 0, y: "-=100" }, "+=.2");

  tl.to(".t1", { duration: 0.3, opacity: 0 }, `+=${read.t1 + 1}`);
  tl.from(".t2", { duration: 0.3, opacity: 0 }, "+=.3");
  tl.to([".t2", ".device"], { duration: 0.3, opacity: 0 }, `+=${read.t2}`);
  tl.from([".bg", ".end_legal"], { duration: 0.3, opacity: 0 });
  tl.from(".end_device", { duration: 0.3, opacity: 0 }, `+=.5`);
  tl.from(".end_txt", { duration: 0.3, opacity: 0 }, `+=.3`);
  tl.from(".end_cta", { duration: 0.3, opacity: 0 }, `+=.3`);

  tl.to(".logo", { duration: 0.3, opacity: 0, y: "+=50" }, `+=.3`);
  tl.add(olg());
}

init();
