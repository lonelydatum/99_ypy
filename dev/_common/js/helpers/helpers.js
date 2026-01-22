function origin(el, x, y) {
	TweenLite.set(el, {transformOrigin:`${x}px ${y}px`, x:`${-x/2}px`, y:`${-y/2}px`, scale:.5})
}

export {origin}