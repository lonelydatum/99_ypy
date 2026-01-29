import { read, frame1, olg } from "../../_common/js/common.js";

function init() {
  const tl = frame1();
  tl.from(".device", { duration: 0.5, opacity: 0 });

  tl.from(".t1", { duration: 0.5, opacity: 0 }, "+=.3");
  tl.to(".t1", { duration: 0.3, opacity: 0 }, `+=${read.t1}`);

  tl.from([".bg", ".end_legal"], { duration: 0.3, opacity: 0 });
  tl.from(".end_device", { duration: 0.3, opacity: 0 }, `+=.3`);
  tl.from(".end_txt", { duration: 0.3, opacity: 0 }, `+=.3`);
  tl.from(".end_cta", { duration: 0.3, opacity: 0 }, `+=.3`);

  tl.to(".logo", { duration: 0.3, opacity: 0, y: "+=50" }, `+=.3`);
  tl.add(olg());
}

init();
