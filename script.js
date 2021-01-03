let canvas = document.getElementById("c");
canvas.height = innerHeight
canvas.width = innerWidth
let ctx = canvas.getContext("2d");

const SIZE = 10
const WIDTH = 136;
const HEIGHT = 76;

let n = 1

anim()

function anim() {
    let hue
    n += 0.005
    for (let y = 0; y < HEIGHT; y++) {
        for (let x = 0; x < WIDTH; x++) {

            hue = Math.sin((x * scale.value) / WIDTH + n * 0.3) * 180 +
                Math.cos((y * scale.value) / WIDTH + n) * 180 - n * 300

            ctx.fillStyle = "hsl(" + hue + ", 100%,50%)";
            draw(x, y);
        }
    }
    window.requestAnimationFrame(anim)
}

function draw(x, y) {
    ctx.fillRect(x * SIZE, y * SIZE, SIZE, SIZE);
}