import { read, frame1, olg } from "../../_common/js/common.js";

function init() {
  const tl = frame1();

  tl.from(".ypy", { duration: 0.3, opacity: 0 }, "+=.2");
  tl.from(".t1", { duration: 0.3, opacity: 0 });
  tl.to(".t1", { opacity: 0, duration: 0.2 }, `+=2`);
  tl.from(".t2", { opacity: 0, duration: 0.3 }, "+=.3");

  tl.to(".t2", { opacity: 0, duration: 0.2 }, `+=3.3`);

  tl.from(".end_txt", { duration: 0.3, opacity: 0 }, `+=.3`);
  tl.from(".end_cta", { duration: 0.3, opacity: 0 }, `+=.3`);

  tl.to(".logo", { duration: 0.3, opacity: 0, y: "+=50" }, `+=.3`);
  tl.add(olg());
}

init();
