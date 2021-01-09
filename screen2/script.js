
let n =0
function anim(){
    document.body.background =  n + ".jpg"
    n++;
    if (n == 60) n=0;
    window.requestAnimationFrame(anim);
}

anim();
