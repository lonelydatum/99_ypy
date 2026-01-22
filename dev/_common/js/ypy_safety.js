import {init, olg, olg_ypy, bannerSize} from './common.js'

document.getElementById("legalContent").innerHTML = `
©2024 IGT.<br/>
Must be 19 years of age or older and a resident 
of Ontario, located in the province to play online
casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply.
<br/>
*Voted most trusted Online Casino by Ontario shoppers based on the 2023 Brandspark® Canadian Trust Study.`




const READ = {
	t1: 2.2,
	t2: 2
}



function startBasic({ypy}){
	
	const isNormal = bannerSize.w/bannerSize.h < 2
	console.log(isNormal);
	const tl = init()
	// return;
	const rotate = 150
	tl.add("arcs-in")
	TweenLite.set(".ring", {opacity:1})
	const ring = {opacity:0, ease: "power2.out", duration:.4}
	tl.from(".ring1_1", {...ring, rotate:-rotate}, "arcs-in+=0")
	tl.from(".ring1_2", {...ring, rotate:rotate}, "arcs-in+=.1")
	tl.from(".ring1_3", {...ring, rotate:-rotate}, "arcs-in+=.2")
	tl.from(".ring1_4", {...ring, rotate:rotate}, "arcs-in+=.3")

	tl.from(".ypy1-1", {opacity:0, rotate:-60, duration:.4}, "arcs-in+=0.2")
	tl.from(".ypy1-2", {opacity:0, rotate:-60, duration:.4}, "arcs-in+=.4")
	tl.from(".ypy1-3", {opacity:0, rotate:-60, duration:.4}, "arcs-in+=.6")

	tl.add("shrink", "+=.3")
	if(isNormal){
		tl.to(".ring", {opacity:0, duration:.3}, "shrink")
		tl.from(".ring_all", {opacity:0, duration:.3}, "shrink")	
		tl.to(".hero", {x:0, y:0, scale:.50, duration:.3}, "shrink")	
		tl.from(".footer-bar", {y:bannerSize.h, duration:.3}, "shrink")
	}
	

	
	
	
	
	tl.from(".t1", {y:bannerSize.h, duration:.4}, "shrink")
	tl.to(".ypy1-1", {...ypy[0], duration:.3}, "shrink")
	tl.to(".ypy1-2", {...ypy[1], duration:.3}, "shrink")
	tl.to(".ypy1-3", {...ypy[2], duration:.3}, "shrink")
	



	// tl.to(".ring", {y:`-=${shiftY}`, duration:.4}, "shrink")


	tl.from([".inset"], {y:`+=30`, opacity:0, duration:.4}, "shrink+=.2")
	tl.from([".brand-logo"], {  opacity:0, duration:.4}, "shrink+=.2")




	tl.to(".t1", {opacity:0, duration:.3}, `+=${READ.t1}`)
	tl.from([".t2"], {opacity:0, duration:.3})

	const ratio = 0.002
	const time = Math.min(Math.max(bannerSize.h*ratio, .2), .6)
	

	tl.add("end", `+=${READ.t2}`)
	tl.to(".frame1", {y:`-=${bannerSize.h}`, duration:time}, "end")
	tl.set(".frame2", {opacity:1}, "end")
	tl.from(".frame2", {y:`+=${bannerSize.h}`, duration:time}, "end")

	tl.from(".url", {opacity:0, duration:.3})




	tl.add(olg_ypy(), "-=.3")

	return tl
	
}




export {startBasic, READ}