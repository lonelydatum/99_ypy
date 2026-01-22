import {init, olg, bannerSize, olg_ypy} from './common.js'



document.getElementById("legalContent").innerHTML = `
©2024 Evolution. </br>
All rights reserved.</br>
Must be 19 years of age or older and a resident of Ontario, located in the province to play online casino games. 
Games may not appear as shown. Odds vary by game. Terms and conditions apply.
`

const READ = {
	t1: 3.5,
	
}

TweenLite.set("#banner", {backgroundColor:"#ff375f"})

function toNormal(tl, el, frame){
	tl.to(el, {scale:.5, x:0, y:0, duration:.4}, frame)
}

function centerScale(el, x, y){
	TweenLite.set(el, {transformOrigin:"50% 50%", x:0, y:0})
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

function start(devices){
	centerScale(".all_1")
	
	const tl = init()
	
	// return

	const isNormal = bannerSize.w/bannerSize.h < 2
	

	tl.add("frame1")
	tl.from(".all_1", {ease:"power3.out", scale:3, duration:1, opacity:0, rotate:30, y:0}, "frame1")
	

	tl.from(".ypy-1", {duration:.3, ease:"back.out", opacity:0, y:-100}, "frame1")
	tl.from(".ypy-2", {duration:.3, ease:"back.out", opacity:0, y:-100}, "frame1+=.2")
	tl.from(".ypy-3", {duration:.5, ease:"back.out", opacity:0, y:-100}, "frame1+=.4")


	tl.add("frame2", "+=.2")
	
	
	
	tl.add("frame2")
	if(devices){
		devices.map((a, i)=>{
			tl.to(`.devices_${i+1}`, {...a}, "frame2")
		})	
	}
	
	
	toNormal(tl, ".ypy", "frame2")
	
	
	tl.from(".t1", { duration:.3, opacity:0})

	tl.add('frame3', `+=${READ.t1}`)
	tl.to(".t1", { duration:.3, opacity:0}, "frame3")
	tl.to(".ypy", {opacity:0, duration:.3}, "frame3")
	
	
	toNormal(tl, ".devices", "frame3")

	tl.from(".url", {opacity:0, duration:.3}, "+=.3")




	tl.add(olg_ypy(), "-=.3")

	// tl.to(".all_2", {duration:.3, opacity:0}, "+=1")
}



export { start,  init, bannerSize, READ, olg_ypy }