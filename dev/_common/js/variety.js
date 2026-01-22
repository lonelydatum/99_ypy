import {init, olg, olg_ypy} from './common.js'


document.getElementById("legalContent").innerHTML = `
© 2023 IGT.<br/>
© 2023 Evolution. All Rights Reserved.<br/>
<br/>
Must be 19 years of age or older and a resident of Ontario, located in the province to play
online casino games. Games and screens may not appear as shown. Odds vary by game.
<br/>
Terms and conditions apply.`
const READ = {
	t1: 2.3,
	t2: 2.6
}


function rotateSetRetina(data){
	const tl = new TimelineMax()
	const {list, offsetX, offsetY, to} = data
	list.map(a=>{
		const {x, y } = to		
		tl.set(a, {transformOrigin:`${x*2}px ${y*2}px`, x:-x+offsetX, y:-y+offsetY, scale:.5, rotate:0})	
	})
	
}




function rotateDo(rotateRing=180, rotateYPY=120){
	const tl = new TimelineMax()
	// return
	tl.add("arcs-in")
	tl.from(".ring1", {rotate:rotateRing, duration:.5}, "arcs-in+=0")
	tl.from(".ring2", {rotate:-rotateRing, duration:.7}, "arcs-in+=0")
	tl.from(".ring3", {rotate:rotateRing, duration:.6}, "arcs-in+=0")
	tl.from(".ring4", {rotate:-rotateRing, duration:.5}, "arcs-in+=0")
	tl.from(".ring5", {rotate:rotateRing, duration:.7}, "arcs-in+=0")

	tl.from(".ypy-1", {opacity:0, rotate:-rotateYPY, duration:.5}, "arcs-in+=.2")
	tl.from(".ypy-2", {opacity:0, rotate:-rotateYPY, duration:.5}, "arcs-in+=.5")
	tl.from(".ypy-3", {opacity:0, rotate:-rotateYPY, duration:.5}, "arcs-in+=.7")

	tl.from(".t1", {opacity:0, duration:.5}, "arcs-in+=1")
	tl.to(".t1", {opacity:0, duration:.3}, `+=${READ.t1}`)
	tl.from(".t2", {opacity:0, duration:.3})

	tl.to(".t2", {opacity:0, duration:.3}, `+=${READ.t2}`)

	tl.add("end")
	tl.to(".devices", {y:0, x:0, scale:.5, duration:.3}, "end")
	tl.from(".url", {opacity:0, duration:.3}, "end")
	tl.to([".ypy-1", ".ypy-2", ".ypy-3"], {opacity:0, duration:.3}, "end")
	


	tl.add(olg_ypy(), "+=.3")
	return tl
}





export {  READ, rotateSetRetina, rotateDo }