import { frameEnd, frame1, read } from "../../_common/js/common.js";

function init() {
  const tl = frame1();
  tl.from(".device", { duration: 0.5, opacity: 0 });

  tl.from(".t1", { duration: 0.5, opacity: 0 }, "+=.3");
  tl.from(".t2", { duration: 0.3, opacity: 0 }, `+=1`);

  frameEnd(tl);
}
init();
