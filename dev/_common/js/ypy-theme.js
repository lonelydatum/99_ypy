import {init, olg, bannerSize, olg_ypy} from './common.js'



document.getElementById("legalContent").innerHTML = `
©2024 Games Global. All rights reserved. </br>
©2024 Pragmatic Play. All rights reserved.</br>
Must be 19 years of age or older and a resident
of Ontario, located in the province to play online 
casino games. Games may not appear as shown. Odds vary by game. Terms and conditions apply.
`

const READ = {
	t1: 2.3,
	t2: 2.6
}

TweenLite.set("#banner", {backgroundColor:"#ffe600"})

function toNormal(tl, el, frame){
	tl.to(el, {scale:.5, x:0, y:0, duration:.4}, frame)
}

function centerScale(el, x, y){
	TweenLite.set(el, {transformOrigin:"50% 50%", x:-bannerSize.w/2, y:-bannerSize.h/2})
}

function listIn(tl, list, frameLabel){
	tl.add(frameLabel)
	const xy = 50
	list.map((a, i)=>{
		tl.from(a[0], {duration:.3, opacity:0, x:a[1]*xy, y:a[2]*xy}, `${frameLabel}+=${i*.1}`)
	})
}


function listOut(tl, list, frameLabel){
	
	const xy = 50
	list.map((a, i)=>{
		tl.to(a[0], {duration:.2, opacity:0, x:a[1]*xy, y:a[2]*xy}, frameLabel)
	})
}

function start({coins=8, skew, y=3}){
	centerScale(".all_2")
	centerScale(".all_1")
	const tl = init()
	// return

	const isNormal = bannerSize.w/bannerSize.h < 2
	

	tl.add("frame1")
	tl.from(".all_1", {ease:"power3.out", scale:2, duration:.8, opacity:0, rotate:30, y:99}, "frame1")
	

	tl.from(".ypy-1", {duration:.3, ease:"back.out", opacity:0, y:-100}, "frame1")
	tl.from(".ypy-2", {duration:.3, ease:"back.out", opacity:0, y:-100}, "frame1+=.2")
	tl.from(".ypy-3", {duration:.5, ease:"back.out", opacity:0, y:-100}, "frame1+=.4")


	tl.add("frame2", "+=.2")
	tl.from(".cover", {duration:.5, opacity:0}, "frame2")
	if(isNormal){		
		tl.to(".all_1", {scale:2, opacity:0, duration:.3}, "frame2")
	}
	
	
	if(universalBanner.size==="300x250"){		
		tl.to(".hero", {scale:.5, x:0, y:-12, duration:.4}, "frame2")
	}else if(universalBanner.size==="1600x600"){		
		tl.to(".hero", {scale:.5, x:0, y:-20, duration:.4}, "frame2")
	}else{
		toNormal(tl, ".hero", "frame2")	
	}
	
	toNormal(tl, ".ypy", "frame2")
	// tl.to(".hero", {scale:2, duration:.3}, "frame2")

	tl.from(".inset", { duration:.3, opacity:0, y:22})

	tl.from(".all_2", {scale:2, duration:.8, opacity:0, rotate:-50, y:99}, "frame2")
	tl.from(".t1", { duration:.3, opacity:0})
	tl.to(".t1", { duration:.3, opacity:0}, `+=${READ.t1}`)
	tl.from(".t2", { duration:.3, opacity:0})

	tl.add("end", `+=${READ.t2}`)
	tl.to(".frame1", { duration:.6, y:-bannerSize.h}, `end`)
	tl.set(".frame2", {opacity:1}, "end")
	tl.from(".frame2", { duration:.6, y:bannerSize.h}, `end`)


	tl.from(".url", {opacity:0, duration:.3}, "+=.3")




	tl.add(olg_ypy(), "-=.3")

	// tl.to(".all_2", {duration:.3, opacity:0}, "+=1")
}



export { start,  init, bannerSize, READ, olg_ypy }