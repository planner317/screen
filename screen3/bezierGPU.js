var scene, camera, renderer, material, mesh1;

scene = new THREE.Scene();
camera = new THREE.PerspectiveCamera(75, 1, 0.1, 10);
camera.position.z = 1
renderer = new THREE.WebGLRenderer();
cnvScreen.appendChild(renderer.domElement)
//renderer.domElement.style.width = "100vh"

zoom.value = window.innerHeight
var uniforms = {};
uniforms.time = { type: "f", value: 0 }
uniforms.zoom = { type: "f", value: zoom.value }
uniforms.rings = { type: "f", value: rings.value }
uniforms.colorMode = { type: "b", value: colorMode.checked }
uniforms.px = { type: "fv1", value: pointsX.arrPt }
uniforms.py = { type: "fv1", value: pointsY.arrPt }

renderer.setSize(cnvScreen.width, cnvScreen.width);

fetch("http://127.0.0.1:5500/bezie.frag").then((r) => {
    r.text().then((shaderCode) => {
        material = new THREE.ShaderMaterial({ uniforms: uniforms, fragmentShader: shaderCode })
        mesh1 = new THREE.Mesh(new THREE.PlaneBufferGeometry(10, 10), material);
        scene.add(mesh1);
        render();
    })
})

//Render everything!
let start = Date.now();
function render() {
    uniforms.time.value = ((Date.now() - start) / 1000 * speed.value)
    requestAnimationFrame(render);
    renderer.render(scene, camera);
}

window.onresize = resize
function resize(){
    renderer.setSize(cnvScreen.height*high.value, cnvScreen.height*high.value);
    renderer.domElement.style.width = "100vh"
    renderer.domElement.style.height = "100vh"
    setZoom()
}
zoom.oninput = setZoom
function setZoom(){
    uniforms.zoom.value = zoom.value * high.value
}
high.oninput = () => {
    resize()
}
rings.oninput = () => {
    uniforms.rings.value = rings.value
    pointsX.multiBezieDraw()
    pointsY.multiBezieDraw()
}
colorMode.oninput = () => {
    uniforms.colorMode.value = colorMode.checked
}
fullscreen.onclick = ()=>{
     seting.hidden=true
     renderer.setSize(window.innerWidth,window.innerHeight)
}
cnvScreen.onclick = ()=>{
    seting.hidden=false
    renderer.setSize(window.innerHeight,window.innerHeight)
}