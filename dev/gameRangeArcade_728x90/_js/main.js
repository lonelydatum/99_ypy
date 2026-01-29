import { read, frame1, frameEnd } from "../../_common/js/common.js";

function init() {
  const tl = frame1();

  tl.to(".t1", { duration: 0.3, opacity: 0 }, `+=${read.t1 + 1}`);
  tl.from(".t2", { duration: 0.3, opacity: 0 }, "+=.3");

  frameEnd(tl);
}

init();
