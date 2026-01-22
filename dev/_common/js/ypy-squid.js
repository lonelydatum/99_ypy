import {init, olg, olg_ypy, bannerSize} from './common.js'
document.getElementById("legalContent").innerHTML = `
©2024 AGS. All rights reserved. </br>
©2024 Light & Wonder. All rights reserved.</br>
Must be 19 years of age or older and a resident 
of Ontario, located in the province to play online 
casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply. 
*Voted most trusted Online Casino by Ontario shoppers based on the 2023 Brandspark® 
Canadian Trust Study.
`

const READ = {
	t1: 1.8,
	t2: 2.2
}

function toNormal(tl, el, time=""){
	tl.to(el, {y:0, x:0, scale:.5, rotate:0, duration:.4}, time)
}

TweenLite.set("#banner", {backgroundColor:"#ff52ee"})

function start(heroScale){	
	const tl = init()	
	// return
	
	const isNormal = bannerSize.w/bannerSize.h < 2

	tl.add("bars")
	
	tl.from(".frame1 .top.b1", {y:-bannerSize.h, duration:.5}, "bars+=.3")
	tl.from(".frame1 .bottom.b2", {y:bannerSize.h, duration:.5}, "bars+=.3")
	tl.from(".frame1 .bottom.b3", {y:bannerSize.h, duration:.5}, "bars+=.6")
	tl.from(".frame1 .top.b4", {y:-bannerSize.h, duration:.5}, "bars+=.9")
	tl.from(".frame1 .bottom.b5", {y:bannerSize.h, duration:.5}, "bars+=.2")
	

	tl.from(".ypy-you1", {y:-bannerSize.h, duration:.4}, "bars+=.5")
	tl.from(".ypy-play", {y:-bannerSize.h, duration:.4}, "bars+=.8")
	tl.from(".ypy-you2", {y:-bannerSize.h, duration:.4}, "bars+=1")

	

	tl.add("scale", "+=.3")
	
	
	tl.to(".hero-all", {x:0, y:0, scale:.5, duration:.4}, "scale")
	if(isNormal){
		tl.to(".frame1 .bar", {opacity:0, duration:.4}, "scale")		
	}
	
	tl.from(".frame1 .b0", {opacity:0, duration:.4}, "scale")
	toNormal(tl, ".ypy", "scale")
	
	tl.from(".inset", {ease:"power1.out", opacity:0, y:80 , duration:.3}, "scale")
	tl.from(".logo", {ease:"power1.out", opacity:0,  duration:.3}, "scale")
	
	tl.from(".t1", {ease:"power1.out", opacity:0, y:30 , duration:.3}, "+=.2")
	tl.to(".t1", {ease:"power1.out", opacity:0,  duration:.3}, `+=${READ.t1}`)

	tl.from(".t2", {ease:"power1.out", opacity:0, y:30 , duration:.3})



	tl.add("end", `+=${READ.t2}`)
	tl.set(".frame2", {opacity:1}, "end")
	tl.to(".frame1", { y:-bannerSize.h, duration:.5}, "end")
	
	tl.from(".frame2", { y:bannerSize.h, duration:.5}, "end")

	tl.from(".devices", { y:bannerSize.h, opacity:0, duration:.8}, "end")
	
	

	tl.add("scroller", "-=.5")
	tl.from(".url", {opacity:0, duration:.3}, "scroller")
	
	tl.add(olg_ypy(), "+=.3")



	return tl
}

export { start, READ, olg_ypy }