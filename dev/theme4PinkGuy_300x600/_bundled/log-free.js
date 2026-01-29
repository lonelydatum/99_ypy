(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
'use strict';

Object.defineProperty(exports, '__esModule', {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _commonJs = require('./common.js');

var _prolineJs = require('./proline.js');

function start() {
	var xy = arguments.length <= 0 || arguments[0] === undefined ? { x: '-=' + 150, y: 0 } : arguments[0];

	var tl = (0, _commonJs.init)();
	// return

	var time = 1.3;

	tl.from(".ball", time * 1.2, _extends({}, xy), 0);
	tl.from(".player2", time, _extends({}, xy), 0);
	tl.from(".bg1b", time * .8, _extends({}, xy, { opacity: 0 }), 0);
	(0, _prolineJs.trailingFX)(time, _extends({}, xy, { opacity: 0 }));
	tl.from(".t1a", .1, { x: '-=' + _commonJs.size.w, opacity: 1 }, .6);
	tl.from(".t1b", .01, { opacity: 0 }, "+=0");

	tl.add((0, _prolineJs.frameEnd)(), "+=1.6");
}

exports.start = start;

},{"./common.js":2,"./proline.js":3}],2:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});
var banner = document.getElementById('banner');
var size = { w: banner.offsetWidth, h: banner.offsetHeight };

TweenLite.defaultEase = Power3.easeOut;

var w = size.w;
var h = size.h;

function init() {

	var tl = new TimelineMax({ onComplete: function onComplete() {} });

	tl.set(".frame1", { opacity: 1 });

	return tl;
}

exports.size = size;
exports.init = init;

},{}],3:[function(require,module,exports){
"use strict";

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _commonJs = require("./common.js");

function trailingFX() {
	var speed = arguments.length <= 0 || arguments[0] === undefined ? 1 : arguments[0];
	var obj = arguments.length <= 1 || arguments[1] === undefined ? { x: "+=50", y: "+=20" } : arguments[1];

	var tl = new TimelineMax();

	tl.add("start", 0);
	var total = 4;
	// for(let i=total; i>0;i--){
	for (var i = 1; i <= total; i++) {
		var percent = i / total * speed * .1;

		obj = _extends({}, obj, { opacity: i === total ? 1 : 0 });

		tl.from("#player" + i, .8 * speed, _extends({}, obj, { ease: Power3.easeOut }), "start+=" + percent);
	}

	// TweenLite.to(".ball", 1.2*speed, {x:0, y:0, ease:Power4.easeOut, delay:.17})
	return tl;
}

function frameEnd() {
	var tl = new TimelineMax();

	tl.set(".frame2", { opacity: 1 });
	tl.from(".bg2", .2, { opacity: 0 });

	tl.from(".phone", .3, { y: _commonJs.size.h, opacity: 1 }, "+=.3");
	tl.from(".ill", .3, { scale: 0 });

	tl.from(".t2", .01, { opacity: 0 }, "+=.5");
	tl.from(".cta1", .01, { opacity: 0 }, "+=1.5");
	tl.to(".cta1", .01, { opacity: 0 }, "+=2.5");
	tl.from(".cta2", .2, { opacity: 0 }, "+=.2");

	return tl;
}

exports.frameEnd = frameEnd;
exports.trailingFX = trailingFX;

},{"./common.js":2}],4:[function(require,module,exports){
'use strict';

var _commonJsBatterJs = require('../../_common/js/batter.js');

(0, _commonJsBatterJs.start)();

module.exports = {};

},{"../../_common/js/batter.js":1}]},{},[4])


//# sourceMappingURL=main.js.map
