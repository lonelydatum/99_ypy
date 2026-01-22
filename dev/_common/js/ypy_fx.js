function initYPY(){
	const tl = new TimelineMax()
	// tl.set(".ypy-all", {opacity:0})
	for(let i=1;i<11;i++){
		tl.set(`.ypy-all .ypy_all_${i} img`, {y:-220})	
	}
}
function ypyScroll(){
	const tl = new TimelineMax()
	
	
// tl.set(".ypy-all", {opacity:0})
	tl.add("spin")
	tl.set(".hide-until", {visibility:"visible"}, "spin")
	for(let i=1;i<11;i++){
		const y = i*20
		const duration = i/11 * 1.6
		
		tl.to(`.ypy-all .ypy_all_${i} img`, {ease:"back.inOut", y:((i-1)*-20)-2, duration}, "spin")	
	}
	return tl	
}

initYPY()

export {initYPY, ypyScroll}