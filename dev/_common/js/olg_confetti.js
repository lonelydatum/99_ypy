
CustomEase.create("custom", "M0,0 C0.14,0 0.234,0.438 0.264,0.561 0.305,0.728 0.4,1.172 0.55,1.172 0.652,1.172 0.722,1.102 0.77,1.024 0.834,0.93 0.89,0.946 0.916,0.946 0.952,0.946 1,1 1,1 ")

function olg(){
    const time = 1
    const tl_olg = new TimelineMax()

    // tl_olg.set("#svg_move", {opacity:1} )
    tl_olg.to("#svg_idle", {duration:.3, ease:"custom", y:"+=100", opacity:0})
    
    tl_olg.from("#svg_move #olg_bg", {transformOrigin:"0% 100%", duration:.6, ease:"custom", scale:0}, .3)    
    tl_olg.from("#svg_move .svg_logo", {duration:.4, opacity:0, y:"+=50"}, .5)
    tl_olg.from("#svg_move .con", {stagger:.06, duration:.8, rotation:"+=300", ease:"custom", x:"-=200", y:"+=200", opacity:0}, .2)
    return tl_olg
}

const banner = document.getElementById('banner')
const bannerSize = {w:banner.offsetWidth, h:banner.offsetHeight}

gsap.defaults({
  ease: "power2.out"
});

const {w, h} = bannerSize

export {olg}