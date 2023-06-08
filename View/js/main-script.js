//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;
var moon, trunk, branch1, branch2, skydome;
var crowns = [];
var body, cockpit, cylinder;
var lights = [];
var ufo;
var spotlight;
var areSpotlightsEnabled = true;
var isSpotlightEnabled = true;
var shadingType = 'Gouraud';
var previousShadingType = 'Gouraud';
var directionalLight;
var keys = Array(256).fill(0);
var angularVelocity = 0.5; // Constant angular velocity in radians per frame
var linearVelocity = 1; // Constant linear velocity in units per frame
var clock = new THREE.Clock();
clock.start(); // Start the clock
const moonLambertMaterial = new THREE.MeshLambertMaterial({ color: 0xffff00, side: THREE.DoubleSide });
const moonPhongMaterial = new THREE.MeshPhongMaterial({ color: 0xffff00 });
const moonToonMaterial = new THREE.MeshToonMaterial({ color: 0xffff00 });
const moonBasicMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
const trunkLambertMaterial = new THREE.MeshLambertMaterial({ color: 0x8B4513 });
const trunkPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x8B4513 });
const trunkToonMaterial = new THREE.MeshToonMaterial({ color: 0x8B4513 });
const trunkBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x8B4513 });
const crownLambertMaterial = new THREE.MeshLambertMaterial({ color: 0x006400 });
const crownPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x006400 });
const crownToonMaterial = new THREE.MeshToonMaterial({ color: 0x006400 });
const crownBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x006400 });
const ufoLambertMaterial = new THREE.MeshLambertMaterial({ color: 0x808080 });
const ufoPhongMaterial = new THREE.MeshPhongMaterial({ color: 0x808080 });
const ufoToonMaterial = new THREE.MeshToonMaterial({ color: 0x808080 });
const ufoBasicMaterial = new THREE.MeshBasicMaterial({ color: 0x808080 });
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
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.set(0, 0, 5);
    camera.lookAt(0, 0, 0);

    // onResize();
}

/////////////////////
/* CREATE LIGHT(S) */
/////////////////////
function createLights() {
    'use strict';
    // Add directional light
    directionalLight = new THREE.DirectionalLight(0xffffff, 1);
    directionalLight.position.set(1, 1, 1); // Set light position
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
    trunk = new THREE.Mesh(trunkGeometry, trunkBasicMaterial);
    trunk.position.y = -2;
    trunk.position.x = 3;

    // Create inclined branch mesh
    branch1 = new THREE.Mesh(branchGeometry, trunkBasicMaterial);
    branch1.position.y = -2;
    branch1.position.x = 3.3;
    branch1.rotation.z = Math.PI / 4;
    branch1.rotation.x = Math.PI / 4;

    // Create opposite-inclined branch mesh
    branch2 = new THREE.Mesh(branchGeometry, trunkBasicMaterial);
    branch2.position.y = -2;
    branch2.position.x = 3.75;
    branch2.rotation.z = -Math.PI / 4;
    branch2.rotation.x = -Math.PI / 4;

    // Create crown meshes
    for (var i = 0; i < 3; i++) {
        var crown = new THREE.Mesh(crownGeometries[i], crownBasicMaterial);
        crown.position.y = -0.5 + i * 0.4;
        crown.position.x = 3;
        crowns.push(crown);
    }

    // Create skydome mesh
    skydome = new THREE.Mesh(skyGeometry, moonLambertMaterial);

    // Create terrain mesh
    const terrainMesh = new THREE.Mesh(terrainGeometry, terrainMaterial);
    terrainMesh.position.y = -4;


    terrainMesh.rotation.x = -Math.PI / 2;

    var bodyRadius = 0.6;
    var cockpitRadius = 0.4;
    var cylinderRadiusTop = 0.2;
    var cylinderRadiusBottom = 0.2;
    var cylinderHeight = 0.05;
    var lightRadius = 0.03;

    var bodyGeometry = new THREE.SphereGeometry(bodyRadius, 8, 8, 0, Math.PI * 2, 0, Math.PI / 2);
    body = new THREE.Mesh(bodyGeometry, ufoBasicMaterial);

    var cockpitGeometry = new THREE.SphereGeometry(cockpitRadius, 8, 8);
    cockpitGeometry.applyMatrix4(new THREE.Matrix4().makeScale(2, 0.2, 2)); // Flatten the sphere
    cockpit = new THREE.Mesh(cockpitGeometry, ufoBasicMaterial);

    var cylinderGeometry = new THREE.CylinderGeometry(cylinderRadiusTop, cylinderRadiusBottom, cylinderHeight, 32);
    cylinder = new THREE.Mesh(cylinderGeometry, ufoBasicMaterial);
    cylinder.position.y = -0.1;
    var spotLight = new THREE.SpotLight(0xffffff, 2);
    spotLight.position.set(0, -0.1, 0); 
    var target = new THREE.Object3D();
    target.position.set(0, -1, 0); 
    spotLight.target = target;
    cylinder.add(spotLight);
    cylinder.add(target);

    var numLights = 8;
    var lightAngleIncrement = (Math.PI * 2) / numLights;

    lights = [];
    for (var i = 0; i < numLights; i++) {
        var angle = i * lightAngleIncrement;
        var lightX = Math.cos(angle) * (bodyRadius - lightRadius * 1.5);
        var lightZ = Math.sin(angle) * (bodyRadius - lightRadius * 1.5);

        var lightGeometry = new THREE.SphereGeometry(lightRadius, 8, 8);
        var light = new THREE.Mesh(lightGeometry, moonBasicMaterial);
        light.position.set(lightX, -0.1, lightZ);
        lights.push(light);

        var spotlight = new THREE.PointLight(0xffffff, 1, 1);
        light.add(spotlight);
    }

    ufo = new THREE.Object3D();
    ufo.add(body, cockpit, cylinder, ...lights);
    ufo.position.y = 1; 

    // Add objects to the scene
    scene.add(trunk);
    scene.add(branch1);
    scene.add(branch2);
    scene.add(skydome);
    scene.add(terrainMesh);
    for (var i = 0; i < 3; i++) {
        scene.add(crowns[i]);
    }
    scene.add(ufo);
}

////////////
/* UPDATE */
////////////
function update(){
    'use strict';
    // Calculate time delta for consistent motion
    var delta = clock.getDelta();

    var angularRotation = angularVelocity * delta;
    ufo.rotation.y += angularRotation;

    // Update UFO translation
    if(keys[39] || keys[38] || keys[37] || keys[40]){
        var linearTranslation = linearVelocity * delta;
        var translationVector = new THREE.Vector3(keys[39] - keys[37], 0, keys[40] - keys[38])
            .normalize()
            .multiplyScalar(linearTranslation);
        ufo.position.add(translationVector);
    }
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
    'use strict';
    if (e.keyCode === 68) { // 'D' key
        toggleDirectionalLight();
    }
    if (e.keyCode === 81 || e.keyCode === 113) { // 'Q' or 'q' key
        shadingType = 'Gouraud';
        previousShadingType = 'Gouraud';
        setShadingType();
    } else if (e.keyCode === 87 || e.keyCode === 119) { // 'W' or 'w' key
        shadingType = 'Phong';
        previousShadingType = 'Phong';
        setShadingType();
    } else if (e.keyCode === 69 || e.keyCode === 101) { // 'E' or 'e' key
        shadingType = 'Toon';
        previousShadingType = 'Toon';
        setShadingType();
    } else if (e.keyCode === 82 || e.keyCode === 114) { // 'R' or 'r' key
        if (shadingType === 'Basic'){
            shadingType = previousShadingType;
        } else {
            shadingType = 'Basic';
        }
        setShadingType();
    } else if (e.keyCode === 80 || e.keyCode === 112) { // 'P' or 'p' key
        toggleSpotlights();
    } else if (e.keyCode === 83 || e.keyCode === 115) { // 'S' or 's' key
        toggleSpotlight();
    }

    keys[e.keyCode] = 1;
}

///////////////////////
/* KEY UP CALLBACK */
///////////////////////
function onKeyUp(e){
    'use strict';
    keys[e.keyCode] = 0;
}

//////////////////////////////
/* TOGGLE DIRECTIONAL LIGHT */
//////////////////////////////
function toggleDirectionalLight() {
    'use strict';
    directionalLight = scene.getObjectByName('directionalLight');

    if (directionalLight.intensity === 0) {
        directionalLight.intensity = 1;
        directionalLight.visible = true;
    } else {
        directionalLight.intensity = 0;
        directionalLight.visible = false;
    }
}

//////////////////////////
/* TOGGLE SPOTLIGHTS */
//////////////////////////
function toggleSpotlights() {
    'use strict';
    areSpotlightsEnabled = !areSpotlightsEnabled;
    
    // Toggle the visibility of point lights inside the crown spheres
    lights.forEach(function (light) {
        var pointLight = light.children[0]; // Assuming the point light is the first child
        pointLight.visible = areSpotlightsEnabled;
    });
}

//////////////////////////
/* TOGGLE SPOTLIGHT */
//////////////////////////
function toggleSpotlight() {
    'use strict';
    isSpotlightEnabled = !isSpotlightEnabled;
    
    cylinder.children[0].visible = isSpotlightEnabled;
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
            body.material = ufoLambertMaterial;
            cockpit.material = ufoLambertMaterial;
            cylinder.material = ufoLambertMaterial;
            for (var i = 0; i < 8; i++) {
                lights[i].material = moonLambertMaterial;
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
            body.material = ufoPhongMaterial;
            cockpit.material = ufoPhongMaterial;
            cylinder.material = ufoPhongMaterial;
            for (var i = 0; i < 8; i++) {
                lights[i].material = moonPhongMaterial;
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
            body.material = ufoToonMaterial;
            cockpit.material = ufoToonMaterial;
            cylinder.material = ufoToonMaterial;
            for (var i = 0; i < 8; i++) {
                lights[i].material = moonToonMaterial;
            }
            break;
        case 'Basic':
            moon.material = moonBasicMaterial;
            trunk.material = trunkBasicMaterial;
            branch1.material = trunkBasicMaterial;
            branch2.material = trunkBasicMaterial;
            for (var i = 0; i < 3; i++) {
                crowns[i].material = crownBasicMaterial;
            }
            body.material = ufoBasicMaterial;
            cockpit.material = ufoBasicMaterial;
            cylinder.material = ufoBasicMaterial;
            for (var i = 0; i < 8; i++) {
                lights[i].material = moonBasicMaterial;
            }
            break;
    }
    
}
