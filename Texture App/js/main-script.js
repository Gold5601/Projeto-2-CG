//////////////////////
/* GLOBAL VARIABLES */
//////////////////////
var camera, scene, renderer;
var keys = Array(256).fill(0);
var isKeyBeingPressed = false;

const colorStart = new THREE.Color(0x0000FF); // Blue
const colorEnd = new THREE.Color(0x800080); // Purple

//Degrade from blue to purple
function generateGradientTexture(color1, color2) {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;

  const context = canvas.getContext('2d');
  context.rect(0, 0, canvas.width, canvas.height);

  const gradient = context.createLinearGradient(0, 0, canvas.width, canvas.height);
  gradient.addColorStop(0, color1.getStyle());
  gradient.addColorStop(1, color2.getStyle());

  context.fillStyle = gradient;
  context.fill();

  return canvas.toDataURL();
}

/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';

    scene = new THREE.Scene();
    scene.background = new THREE.Color(0xffffff);
}


//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera(){
    // create frontal view
    camera = new THREE.OrthographicCamera(-window.innerWidth / 8, window.innerWidth / 8, window.innerHeight / 8, -window.innerHeight / 8, 1, 1000);
    camera.position.set(0, 0, 100);
    camera.lookAt(scene.position);
    scene.add(camera);
}


////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////


////////////
/* UPDATE */
////////////
function update(){
    'use strict';

}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    renderer.render(scene, camera);
}

let yellow = new THREE.MeshBasicMaterial({ color: 0xffff00 });
let white = new THREE.MeshBasicMaterial({ color: 0xffffff });
let purple = new THREE.MeshBasicMaterial({ color: 0xff00ff });

let colors = [yellow, white, purple];

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';

    createScene();
    createCamera();

    let geometry = new THREE.CircleGeometry(1, 16);

    scene.background = new THREE.Color(0x009900);

    for(var i = 0; i < 300; i++){
        var circleMesh = new THREE.Mesh(geometry, colors[Math.floor(Math.random() * colors.length)]);
        circleMesh.position.set(Math.random() * 500 - 100, Math.random() * 200 - 100, 0);
        scene.add(circleMesh);
    }

    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    window.document.body.appendChild(renderer.domElement);

    window.addEventListener("resize", onResize);
    window.addEventListener("keyup", onKeyUp);
    window.addEventListener("keydown", onKeyDown);

    render();
    animate();
}

/////////////////////
/* ANIMATION CYCLE */
/////////////////////
function animate() {
    'use strict';

    requestAnimationFrame(animate);
    update();
    render();
}

////////////////////////////
/* RESIZE WINDOW CALLBACK */
////////////////////////////
function onResize() { 
    'use strict';

    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
}


///////////////////////
/* KEY DOWN CALLBACK */
///////////////////////
function onKeyDown(e) {
    'use strict';

    switch(e.keyCode){
        case 49: //1
            yellow.color = new THREE.Color(0xffffff);
            white.color = new THREE.Color(0xffffff);
            purple.color = new THREE.Color(0xffffff);
            const gradientTexture = new THREE.TextureLoader().load(generateGradientTexture(colorStart, colorEnd));
            scene.background = gradientTexture;
            break;
        case 50: //2
            yellow.color = new THREE.Color(0xffff00);
            white.color = new THREE.Color(0xffffff);
            purple.color = new THREE.Color(0xff00ff);
            scene.background = new THREE.Color(0x009900);
            break;
        }
    
    keys[e.keyCode] = 1;

}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';

    keys[e.keyCode] = 0;
    isKeyBeingPressed = false;

}
