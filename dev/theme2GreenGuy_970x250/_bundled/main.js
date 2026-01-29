(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _flipJs = require("./flip.js");

var _prolineJs = require("./proline.js");

// import {initYPY, ypyScroll} from './ypy_fx.js'
var banner = document.getElementById("banner");
var bannerSize = { w: banner.offsetWidth, h: banner.offsetHeight };

gsap.defaults({
  ease: "power3.out"
});

var READ_SUPERBOWL = { t1: 3, t2: 2 };

var READ_ALL = { superbowl: READ_SUPERBOWL };

var read = READ_ALL[universalBanner.name];
var w = bannerSize.w;
var h = bannerSize.h;

function init() {
  var tl = gsap.timeline({
    onComplete: function onComplete() {
      if (document.getElementById("legalBtn")) {
        gsap.set("#legalBtn", { display: "block" });
      }
    }
  });

  tl.set(".frame1", { opacity: 1 });

  tl.from(".ypy", { duration: 0.3, stagger: 0.3, opacity: 0, y: "-=100" }, "+=.2");
  tl.from(".hero2", { duration: 0.5, opacity: 0 }, "+=1");

  tl.from(".t1", { duration: 0.5, opacity: 0 }, "+=.3");
  tl.to(".t1", { duration: 0.3, opacity: 0 }, "+=" + read.t1);
  tl.from(".t2", { duration: 0.3, opacity: 0 });

  tl.from([".bg", ".end_legal"], { duration: 0.3, opacity: 0 }, "+=" + read.t2);
  tl.from(".end_device", { duration: 0.3, opacity: 0 }, "+=.3");
  tl.from(".end_txt", { duration: 0.3, opacity: 0 }, "+=.3");
  tl.from(".end_cta", { duration: 0.3, opacity: 0 }, "+=.3");

  tl.to(".logo", { duration: 0.3, opacity: 0, y: "+=50" }, "+=.3");
  tl.add((0, _prolineJs.olg)());
}

// return tl

exports.init = init;
exports.olg = _prolineJs.olg;
exports.bannerSize = bannerSize;
exports.read = read;

},{"./flip.js":2,"./proline.js":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function flipByElement(name) {
  var _gsap$fromTo2;

  var opts = arguments.length <= 1 || arguments[1] === undefined ? {} : arguments[1];

  var rootEl = document.querySelector(name);
  var pos = rootEl.querySelector(".pos");
  var front = rootEl.querySelector("img.front");
  if (!pos || !front) return null;

  var _opts$left = opts.left;
  var left = _opts$left === undefined ? 0 : _opts$left;
  var _opts$top = opts.top;
  var top = _opts$top === undefined ? 0 : _opts$top;
  var _opts$perspective = opts.perspective;
  var perspective = _opts$perspective === undefined ? 1000 : _opts$perspective;
  var _opts$drop = opts.drop;
  var drop = _opts$drop === undefined ? 160 : _opts$drop;
  var _opts$dur = opts.dur;
  var dur = _opts$dur === undefined ? 1.2 : _opts$dur;
  var _opts$spins = opts.spins;
  var spins = _opts$spins === undefined ? 4 : _opts$spins;
  var _opts$axis = opts.axis;
  var axis = _opts$axis === undefined ? "X" : _opts$axis;
  var _opts$backface = opts.backface;
  var // "X" or "Y"
  backface = _opts$backface === undefined ? "visible" : _opts$backface;
  var _opts$ease = opts.ease;
  var // "visible" or "hidden"
  ease = _opts$ease === undefined ? "power3.out" : _opts$ease;

  var w = front.naturalWidth || front.width;
  var h = front.naturalHeight || front.height;

  // Make sure the wrapper can provide perspective
  gsap.set(rootEl, {
    position: "absolute",
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    perspective: perspective
  });

  // Layout position
  gsap.set(pos, { position: "absolute", left: left, top: top });

  // Ensure the image has a real box
  gsap.set(front, {
    display: "block",
    width: w,
    height: h,
    transformStyle: "preserve-3d",
    transformPerspective: perspective,
    transformOrigin: "50% 0%",
    backfaceVisibility: backface,
    force3D: true
  });

  var rotProp = axis === "Y" ? "rotationY" : "rotationX";

  // One tween (no overwrite fights)
  return gsap.fromTo(front, _defineProperty({ y: "-=100", opacity: 0 }, rotProp, 0), (_gsap$fromTo2 = { y: 0, opacity: 1 }, _defineProperty(_gsap$fromTo2, rotProp, 360 * spins), _defineProperty(_gsap$fromTo2, "duration", dur), _defineProperty(_gsap$fromTo2, "ease", ease), _gsap$fromTo2));

  return null;
}

exports.flipByElement = flipByElement;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
    value: true
});

CustomEase.create("custom", "M0,0 C0.14,0 0.234,0.438 0.264,0.561 0.305,0.728 0.4,1.172 0.55,1.172 0.652,1.172 0.722,1.102 0.77,1.024 0.834,0.93 0.89,0.946 0.916,0.946 0.952,0.946 1,1 1,1 ");

function olg() {
    TweenLite.set("#olg", { opacity: 1 });

    var tl = new TimelineMax({ onStart: function onStart() {
            TweenLite.set(".olg-static", { opacity: 0 });
        } });

    tl.to("#bluewedge1", { duration: .5, ease: 'power1.inOut', scaleY: 1, scale: 1, x: 0, y: 0 }, 0);
    tl.to("#redwedge1", { duration: .8, ease: 'power1.inOut', scaleY: 1, scale: 1, x: 0, y: 0 }, 0).from('#group-o', { duration: 1, y: 200, ease: "custom" }, 0).from('#group-l', { duration: 1, y: 200, ease: "custom" }, .1).from('#group-g', { duration: 1, y: 200, ease: "custom" }, .2).from('#group-o', { duration: .8, scale: .4, ease: "power1.out" }, .3).from('#group-l', { duration: .8, scale: .4, ease: "power1.out" }, .4).from('#group-g', { duration: .8, scale: .4, ease: "power1.out" }, .5).from('#letter-o', { duration: .25, scale: 0, ease: 'back.out(2)', svgOrigin: '28pt 75pt' }, .9).from('#letter-l', { duration: .25, scale: 0, ease: 'back.out(2)', svgOrigin: '55pt 75pt' }, 1).from('#letter-g', { duration: .25, scale: 0, ease: 'back.out(2)', svgOrigin: '80pt 75pt' }, 1.1);

    // tl.timeScale(2)

    return tl;
}

exports.olg = olg;

},{}],4:[function(require,module,exports){
"use strict";

var _commonJsCommonJs = require("../../_common/js/common.js");

function init() {
  var tl = gsap.timeline({
    onComplete: function onComplete() {
      if (document.getElementById("legalBtn")) {
        gsap.set("#legalBtn", { display: "block" });
      }
    }
  });

  tl.set(".frame1", { opacity: 1 });

  tl.from(".ypy", { duration: 0.3, stagger: 0.3, opacity: 0, y: "-=100" }, "+=.2");

  tl.to(".t1", { duration: 0.3, opacity: 0 }, "+=" + (_commonJsCommonJs.read.t1 + 1));
  tl.from(".t2", { duration: 0.3, opacity: 0 }, "+=.3");
  tl.to([".t2", ".device"], { duration: 0.3, opacity: 0 }, "+=" + _commonJsCommonJs.read.t2);
  tl.from([".bg", ".end_legal"], { duration: 0.3, opacity: 0 });
  tl.from(".end_device", { duration: 0.3, opacity: 0 }, "+=.5");
  tl.from(".end_txt", { duration: 0.3, opacity: 0 }, "+=.3");
  tl.from(".end_cta", { duration: 0.3, opacity: 0 }, "+=.3");

  tl.to(".logo", { duration: 0.3, opacity: 0, y: "+=50" }, "+=.3");
  tl.add((0, _commonJsCommonJs.olg)());
}

init();

},{"../../_common/js/common.js":1}]},{},[4])


//# sourceMappingURL=main.js.map
