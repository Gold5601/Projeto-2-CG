//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;
var moon, trunk, branch1, branch2, skydome;
var crowns = [];
var shadingType = 'Gouraud';
var isLightingEnabled = true;
var directionalLight;
const moonLambertMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00, side: THREE.DoubleSide });
const moonPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const moonToonMaterial = new THREE.MeshToonMaterial({ color: 0xffff00 });
const trunkLambertMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
const trunkPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
const trunkToonMaterial = new THREE.MeshToonMaterial({ color: 0x8B4513 });
const crownLambertMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 });
const crownPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x006400 });
const crownToonMaterial = new THREE.MeshToonMaterial({ color: 0x006400 });
const textureLoader = new THREE.TextureLoader();
const heightmapTexture = textureLoader.load('http://web.tecnico.ulisboa.pt/ist196864/heightmap.jpg');
const terrainTexture = textureLoader.load('http://web.tecnico.ulisboa.pt/ist196864/terrainTexture.jpg');
const skydomeTexture = textureLoader.load('http://web.tecnico.ulisboa.pt/ist196864/skydomeTexture.jpg');
const terrainMaterial = new THREE.MeshPhongMaterial({ map : terrainTexture, wireframe: false, displacementMap: heightmapTexture});
const skydomeMaterial = new THREE.MeshPhongMaterial({map : skydomeTexture, wireframe: false});


/////////////////////
/* CREATE SCENE(S) */
/////////////////////
function createScene(){
    'use strict';
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x000000); // Set scene background color

    // Add ambient light
    var ambientLight = new THREE.AmbientLight(0x111111, 2);
    scene.add(ambientLight);
}

//////////////////////
/* CREATE CAMERA(S) */
//////////////////////
function createCamera() {
    'use strict';
    camera = new THREE.OrthographicCamera(-window.innerWidth / 10, window.innerWidth / 10, window.innerHeight / 10, -window.innerHeight / 10, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict';
    // Add directional light
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1); // Set light position
    directionalLight.visible = isLightingEnabled; // Set initial lighting state
    directionalLight.name = 'directionalLight'; // Set light name
    scene.add(directionalLight);
}

////////////////////////
/* CREATE OBJECT3D(S) */
////////////////////////
function createObjects() {
    'use strict';
    // Create moon geometry
    var moonGeometry = new THREE.SphereGeometry(1, 32, 32);

    // Create moon mesh
    moon = new THREE.Mesh(moonGeometry, moonLambertMaterial);

    // Set moon position
    moon.position.set(4, 4, -2);

    scene.add(moon);

    // Create trunk geometry
    var trunkGeometry = new THREE.CylinderGeometry(0.15, 0.15, 2, 16);

    // Create branch geometry
    var branchGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1, 16);

    // Create crown geometry
    var crownGeometries = [
        new THREE.SphereGeometry(0.7, 16, 16),
        new THREE.SphereGeometry(0.6, 16, 16),
        new THREE.SphereGeometry(0.5, 16, 16)
    ];

    // Create skydome geometry
    var skyGeometry = new THREE.SphereGeometry(500, 500, 1000);

    //Create terrain geometry
    var terrainGeometry = new THREE.PlaneGeometry(100, 100, 100, 100);




    // Create trunk mesh
    trunk = new THREE.Mesh(trunkGeometry, trunkLambertMaterial);
    trunk.position.y = -2;
    trunk.position.x = 3;

    // Create inclined branch mesh
    branch1 = new THREE.Mesh(branchGeometry, trunkLambertMaterial);
    branch1.position.y = -2;
    branch1.position.x = 3.3;
    branch1.rotation.z = Math.PI / 4;
    branch1.rotation.x = Math.PI / 4;

    // Create opposite-inclined branch mesh
    branch2 = new THREE.Mesh(branchGeometry, trunkLambertMaterial);
    branch2.position.y = -2;
    branch2.position.x = 3.75;
    branch2.rotation.z = -Math.PI / 4;
    branch2.rotation.x = -Math.PI / 4;


    //const textureLoader = new THREE.TextureLoader();
    //const skyTexture = textureLoader.load('path/to/sky-image.jpg');
    //const skyMaterial = new THREE.MeshBasicMaterial({
    //    map: skyTexture,
    //   side: THREE.BackSide
    //    }); 

    // Create skydome mesh
    skydome = new THREE.Mesh(skyGeometry, moonLambertMaterial);

    // Create terrain mesh
    const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrainMesh.position.y = -4;


    terrainMesh.rotation.x = -Math.PI / 2;

    // Create crown meshes
    for (var i = 0; i < 3; i++) {
        var crown = new THREE.Mesh(crownGeometries[i], crownLambertMaterial);
        crown.position.y = -0.5 + i * 0.4;
        crown.position.x = 3;
        crowns.push(crown);
    }

    // Add objects to the scene
    scene.add(trunk);
    scene.add(branch1);
    scene.add(branch2);
    scene.add(skydome);
    scene.add(terrainMesh);
    for (var i = 0; i < 3; i++) {
        scene.add(crowns[i]);
    }
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    // Update your scene and objects here
}

/////////////
/* DISPLAY */
/////////////
function render() {
    'use strict';
    // Render your scene here
    renderer.render(scene, camera);
}

////////////////////////////////
/* INITIALIZE ANIMATION CYCLE */
////////////////////////////////
function init() {
    'use strict';
    // Create WebGL renderer
    renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    createScene();
    createCamera();
    createLights();
    createObjects();

    // Add event listener for window resize
    window.addEventListener('resize', onResize, false);

    // Add event listeners for keyboard input
    document.addEventListener('keydown', onKeyDown, false);
    document.addEventListener('keyup', onKeyUp, false);
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
    if (e.keyCode === 49) { // '1' key
        switchCamera();
    }
    if (e.keyCode === 68) { // 'D' key
        toggleDirectionalLight();
    }
    if (e.keyCode === 81 || e.keyCode === 113) { // 'Q' or 'q' key
        shadingType = 'Gouraud';
        setShadingType();
    } else if (e.keyCode === 87 || e.keyCode === 119) { // 'W' or 'w' key
        shadingType = 'Phong';
        setShadingType();
    } else if (e.keyCode === 69 || e.keyCode === 101) { // 'E' or 'e' key
        shadingType = 'Toon';
        setShadingType();
    } else if (e.keyCode === 82 || e.keyCode === 114) { // 'R' or 'r' key
        isLightingEnabled = !isLightingEnabled;
        toggleLighting();
    }
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
}

////////////////////////////
/* SWITCH CAMERA FUNCTION */
////////////////////////////
function switchCamera() {
    'use strict';
    if (camera instanceof THREE.OrthographicCamera) {
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        camera.position.set(0, 0, 5);
        camera.lookAt(0, 0, 0);
    }
    onResize(); // Update camera aspect ratio
}

//////////////////////////////
/* TOGGLE DIRECTIONAL LIGHT */
//////////////////////////////
function toggleDirectionalLight() {
    'use strict';
    directionalLight = scene.getObjectByName('directionalLight');

    if (directionalLight.intensity === 0) {
        directionalLight.intensity = 1;
    } else {
        directionalLight.intensity = 0;
    }
}

//////////////////////////
/* SET SHADING TYPE */
//////////////////////////
function setShadingType() {
    'use strict';

    switch (shadingType) {
        case 'Gouraud':
            moon.material = moonLambertMaterial;
            trunk.material = trunkLambertMaterial;
            branch1.material = trunkLambertMaterial;
            branch2.material = trunkLambertMaterial;
            for (var i = 0; i < 3; i++) {
                crowns[i].material = crownLambertMaterial;
            }
            break;
        case 'Phong':
            moon.material = moonPhongMaterial;
            trunk.material = trunkPhongMaterial;
            branch1.material = trunkPhongMaterial;
            branch2.material = trunkPhongMaterial;
            for (var i = 0; i < 3; i++) {
                crowns[i].material = crownPhongMaterial;
            }
            break;
        case 'Toon':
            moon.material = moonToonMaterial;
            trunk.material = trunkToonMaterial;
            branch1.material = trunkToonMaterial;
            branch2.material = trunkToonMaterial;
            for (var i = 0; i < 3; i++) {
                crowns[i].material = crownToonMaterial;
            }
            break;
    }
    
}

//////////////////////////
/* TOGGLE LIGHTING */
//////////////////////////
function toggleLighting() {
    'use strict';
    if (directionalLight) {
        directionalLight.visible = isLightingEnabled;
        render();
    }
}
