// n- координата на кривой от 0 до 1. весь путь от начало до конца всех безье
// p- массив точек. 29 точек 0 1 2 3 (1 безье) 3 4 5 6 (2 безье) 6 7 8 9 (3 безье) 9 10 11 0 (4 безье)
// возвращает float значение 
function bezier10(t, p) {
    t = t % 1
    let i = 0, d= 0; // по t выбираю 4 точки для безье из 4 возможных
    if (t > 0.25) {i = 3 ; d += 0.25}
    if (t > 0.50) {i = 6 ; d += 0.25}
    if (t > 0.75) {i = 9 ; d += 0.25}
    t = (t - d) * 4 
    let iT = 1 - t;
    return iT ** 3 * p[i] + 3 * iT ** 2 * t * p[i + 1] + 3 * iT * t ** 2 * p[i + 2] + t ** 3 * p[(i + 3) % 12];
}

/** @type{CanvasRenderingContext2D} */
var ctx = cnvSeting.getContext("2d");

let  h = 100;
let arrPtX = [1, 1.47, 1.69, 1, 0.31, 0.4, 0.13, -0.18, 0.5, 0.21, -0.08, 0.53]
let arrPtY =[0.16, 0.9, 0.54, 0.98, 1.42, 2.04, 0.86, -0.32, 0.47, 0.54, 0.6, -0.58]
// созднаю точки DOM для упарвления
class createPointDOM {
    ofssetY; arrPt; arrPtDOM = []; up
    constructor(arrPt, up) {
        this.arrPt = arrPt
        this.up = up;
        this.setOffsetY()
        this.createPoint()
        this.windowResize()
        window.addEventListener("resize", this.windowResize.bind(this))
    }
    createPoint() {
        let t = this;
        for (let i = 0; i < this.arrPt.length; i++) {
            let point = document.createElement("point");
            this.arrPtDOM.push(point)
            point.ondragstart = () => false
            seting.appendChild(point);
            point.style.top = t.arrPt[i] * h + this.ofssetY - 16 + "px"
            point.style.left = i / t.arrPt.length * cnvSeting.width - 16 + "px"
            if (i % 3 == 0) point.className = "white"
            // привеязываю события
            point.onmousedown = onmousedown
            function onmousedown(e) {
                let shiftY = e.clientY - point.getBoundingClientRect().top;
                seting.style.cursor = "grabbing"
                point.style.cursor = "grabbing"

                function moveAt(e) {
                    point.style.top = e.y - shiftY + "px";
                    let oldY = t.arrPt[i];
                    t.arrPt[i] = +(e.y - t.ofssetY - shiftY + 15) / h
                    let Imin2 = (i-2)%12
                    let Iplus2 = (i+2)%12
                    if (Imin2<0) Imin2 = 12+Imin2
                    if ( i%3 ==1){ // значит спереди от главной
                        t.arrPt[Imin2] = t.arrPt[i-1] - t.arrPt[i] + t.arrPt[i-1]
                        t.arrPtDOM[Imin2].style.top = t.arrPt[Imin2]*h + t.ofssetY - 15 + "px"
                    }
                    else if( i%3 ==2){ // значит сздади от главной
                        t.arrPt[Iplus2] = t.arrPt[Iplus2-1] - t.arrPt[i] + t.arrPt[Iplus2-1]
                        t.arrPtDOM[Iplus2].style.top = t.arrPt[Iplus2]*h + t.ofssetY - 15 + "px"
                    }
                    else {
                        t.arrPt[i+1] += t.arrPt[i] - oldY
                        t.arrPt[Imin2+1] += t.arrPt[i] - oldY
                        t.arrPtDOM[Imin2+1].style.top = t.arrPt[Imin2+1]*h + t.ofssetY - 15 + "px"
                        t.arrPtDOM[i+1].style.top = t.arrPt[i+1]*h + t.ofssetY - 15 + "px"
                    }
                    t.multiBezieDraw()
                }
                function removeEvent() {
                    seting.removeEventListener("mousemove", moveAt)
                    seting.onmouseup = null
                    seting.style.cursor = "default"
                    point.style.cursor = "grab"
                }
                seting.addEventListener("mousemove", moveAt)
                seting.onmouseup = removeEvent
                seting.onmouseenter = removeEvent
            }
        }
    }

    multiBezieDraw() {
        let startYGradient, endYGradient
        ctx.lineWidth = 0.5
        if (this.up) {
            startYGradient = 0;
            endYGradient = cnvSeting.height / 2
        }
        else {
            startYGradient = cnvSeting.height / 2;
            endYGradient = cnvSeting.height
        }
        let gradient = ctx.createLinearGradient(0, startYGradient, 0, endYGradient);
        let bool = false;
        for (let i = 0; i < 1; i+= (+rings.max+10 - rings.value)/300) {
            if (bool) gradient.addColorStop(i, "#000")
            else gradient.addColorStop(i, "#555")
            bool = !bool
        }

        ctx.fillStyle = gradient
        ctx.fillRect(0, startYGradient, cnvSeting.width, endYGradient)


        ctx.strokeStyle = "green" // просто линии
        for (let i = 0; i < this.arrPt.length; i++) {
            ctx.lineTo(i / this.arrPt.length * cnvSeting.width, this.arrPt[i] * h + this.ofssetY)
            if (i == this.arrPt.length - 1) ctx.lineTo(cnvSeting.width, this.arrPt[0] * h + this.ofssetY)
        }
        ctx.stroke()
        ctx.beginPath();
        ctx.lineWidth = 2
        ctx.strokeStyle = "#fff" // просто линии
        for (let t = 0; t < 1; t += 5 / cnvSeting.width) {
            let val = bezier10(t, this.arrPt)
            ctx.lineTo(t * cnvSeting.width, val * h + this.ofssetY)
        }
        ctx.stroke()
        ctx.beginPath();
    }

    windowResize() {
        let t = this
        t.setOffsetY()
        cnvScreen.height = cnvScreen.width = window.innerHeight
        let a = window.innerWidth - cnvScreen.width
        if (cnvSeting.width != a) cnvSeting.width = a
        if (cnvSeting.height != window.innerHeight) cnvSeting.height = window.innerHeight

        seting.style.width = cnvSeting.width + "px"

        t.arrPtDOM.forEach((e, i) => {
            e.style.left = i / t.arrPt.length * cnvSeting.width - 16 + "px"
            e.style.top = t.arrPt[i] * h + t.ofssetY - 16 + "px"
        })
        t.multiBezieDraw()
    }

    setOffsetY() {
        let t = this
        if (t.up) this.ofssetY = window.innerHeight / 6 * 1
        else this.ofssetY = window.innerHeight / 6 * 4
    }
}

let pointsX = new createPointDOM(arrPtX, true);
let pointsY = new createPointDOM(arrPtY, false);
