//////////////////////
/* GLOBAL VARIABLES */
//////////////////////

var camera, scene, renderer;
var moon, skydome;
var trees = [];
var trunks = [];
var branches = [];
var crowns = [];
var body, cockpit, cylinder;
var lights = [];
var ufo;
var wall1, wall2, window1, window2, door, roof1, roof2;
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
const moonMaterials = [new THREE.MeshBasicMaterial({ color: 0xffff00 }), new THREE.MeshLambertMaterial({ color: 0xffff00 }), 
                        new THREE.MeshPhongMaterial({ color: 0xffff00 }), new THREE.MeshToonMaterial({ color: 0xffff00 })];
const trunkMaterials = [new THREE.MeshBasicMaterial({ color: 0x8B4513 }), new THREE.MeshLambertMaterial({ color: 0x8B4513 }), 
                        new THREE.MeshPhongMaterial({ color: 0x8B4513 }), new THREE.MeshToonMaterial({ color: 0x8B4513 })];
const crownMaterials = [new THREE.MeshBasicMaterial({ color: 0x006400 }), new THREE.MeshLambertMaterial({ color: 0x006400 }), 
                        new THREE.MeshPhongMaterial({ color: 0x006400 }), new THREE.MeshToonMaterial({ color: 0x006400 })];
const ufoMaterials = [new THREE.MeshBasicMaterial({ color: 0x808080 }), new THREE.MeshLambertMaterial({ color: 0x808080 }), 
                        new THREE.MeshPhongMaterial({ color: 0x808080 }), new THREE.MeshToonMaterial({ color: 0x808080 })];
const wallMaterials = [new THREE.MeshBasicMaterial({ color: 0xffffff }), new THREE.MeshLambertMaterial({ color: 0xffffff }), 
                        new THREE.MeshPhongMaterial({ color: 0xffffff }), new THREE.MeshToonMaterial({ color: 0xffffff })];
const windowMaterials = [new THREE.MeshBasicMaterial({ color: 0xadd8e6 }), new THREE.MeshLambertMaterial({ color: 0xadd8e6 }), 
                        new THREE.MeshPhongMaterial({ color: 0xadd8e6 }), new THREE.MeshToonMaterial({ color: 0xadd8e6 })]; 
const roofMaterials = [new THREE.MeshBasicMaterial({ color: 0x8b0000 }), new THREE.MeshLambertMaterial({ color: 0x8b0000 }), 
                        new THREE.MeshPhongMaterial({ color: 0x8b0000 }), new THREE.MeshToonMaterial({ color: 0x8b0000 })]; 
const skydomePhongMaterial = new THREE.MeshPhongMaterial({ color: 0x000000, side: THREE.DoubleSide });  
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
    camera.position.set(0, 5, 15);
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
    moon = new THREE.Mesh(moonGeometry, moonMaterials[0]);

    // Set moon position
    moon.position.set(4, 8, -2);

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


    for (var i = 0; i < 3; i++){
        var tree = new THREE.Object3D();
        // Create trunk mesh
        var trunk = new THREE.Mesh(trunkGeometry, trunkMaterials[0]);
        trunk.position.y = -2;
        trunk.position.x = 3 + 2 * i;
        trunks.push(trunk);
        tree.add(trunk);

        // Create inclined branch mesh
        var branch1 = new THREE.Mesh(branchGeometry, trunkMaterials[0]);
        branch1.position.y = -2;
        branch1.position.x = 3.3 + 2 * i;
        branch1.rotation.z = Math.PI / 4;
        branch1.rotation.x = Math.PI / 4;
        branches.push(branch1);
        tree.add(branch1);

        // Create opposite-inclined branch mesh
        var branch2 = new THREE.Mesh(branchGeometry, trunkMaterials[0]);
        branch2.position.y = -2;
        branch2.position.x = 3.75 + 2 * i;
        branch2.rotation.z = -Math.PI / 4;
        branch2.rotation.x = -Math.PI / 4;
        branches.push(branch2);
        tree.add(branch2);

        // Create crown meshes
        for (var ii = 0; ii < 3; ii++) {
            var crown = new THREE.Mesh(crownGeometries[i], crownMaterials[0]);
            crown.position.y = -0.5 + ii * 0.4;
            crown.position.x = 3 + 2 * i;
            crowns.push(crown);
            tree.add(crown);
        }

        // Set initial scale of the tree
        var initialScale = 1.0;
        tree.scale.set(initialScale, initialScale, initialScale);

        // Add the tree to the scene
        scene.add(tree);

        // Randomly modify the size of the tree
        var randomScale = Math.random() * (1.5 - 0.5) + 0.5; // Generate a random scale factor between 0.5 and 1.5

        // Apply the random scale to the tree
        tree.scale.set(randomScale, randomScale, randomScale);
    }

    // Create skydome mesh
    skydome = new THREE.Mesh(skyGeometry, skydomePhongMaterial);

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
    body = new THREE.Mesh(bodyGeometry, ufoMaterials[0]);

    var cockpitGeometry = new THREE.SphereGeometry(cockpitRadius, 8, 8);
    cockpitGeometry.applyMatrix4(new THREE.Matrix4().makeScale(2, 0.2, 2)); // Flatten the sphere
    cockpit = new THREE.Mesh(cockpitGeometry, ufoMaterials[0]);

    var cylinderGeometry = new THREE.CylinderGeometry(cylinderRadiusTop, cylinderRadiusBottom, cylinderHeight, 32);
    cylinder = new THREE.Mesh(cylinderGeometry, ufoMaterials[0]);
    cylinder.position.y = -0.1;
    var spotLight = new THREE.SpotLight(0xffffff, 1);
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
        var light = new THREE.Mesh(lightGeometry, moonMaterials[0]);
        light.position.set(lightX, -0.1, lightZ);
        lights.push(light);

        var spotlight = new THREE.PointLight(0xffffff, 1, 1);
        light.add(spotlight);
    }

    ufo = new THREE.Object3D();
    ufo.add(body, cockpit, cylinder, ...lights);
    ufo.position.y = 5; 

    // Add objects to the scene
    scene.add(skydome);
    scene.add(terrainMesh);
    scene.add(ufo);

    let vertices1 = new Float32Array([
        -5, 0, 3, // Vertex O
        -5, 3, 3, // Vertex 1
        -4.5, 2, 3, // vertex 2
        -4.5, 1, 3, // Vertex 3
        -3.5, 1, 3, // Vertex 4
        -3, 0, 3, // Vertex 5
        0, 3, 3, // Vertex 6
        -3, 2, 3, // Vertex 7
        -3.5, 2, 3, // Vertex 8
        -0.5, 2, 3, // Vertex 9
        -2, 2, 3, // Vertex 10
        -1.5, 2, 3, // Vertex 11
        -2, 0, 3, // Vertex 12
        -1.5, 1, 3, // Vertex 13
        -0.5, 1, 3, // Vertex 14
        0, 0, 3 // Vertex 15
    ]);
    
    let indices1 = [
        0, 2, 1,
        0, 3, 2,
        0, 4, 3,
        0, 5, 4,
        1, 2, 6,
        5, 7, 4,
        4, 7, 8,
        2, 9, 6,
        10, 12, 11,
        11, 12, 13,
        12, 14, 13,
        12, 15, 14,
        6, 9, 14,
        6, 14, 15
    ];

    let wall1Geometry = new THREE.BufferGeometry();
    wall1Geometry.setAttribute('position', new THREE.BufferAttribute(vertices1, 3));
    wall1Geometry.setIndex(indices1);
    wall1Geometry.computeVertexNormals();
    wall1 = new THREE.Mesh(wall1Geometry, wallMaterials[0]);


    let vertices2 = new Float32Array([
        0, 0, 3, // Vertex O
        0, 3, 3, // Vertex 1
        1, 0, 0, // vertex 2
        1, 3, 0, // Vertex 3
    ]);
    
    let indices2 = [
        0, 2, 1,
        2, 3, 1
    ];

    let wall2Geometry = new THREE.BufferGeometry();
    wall2Geometry.setAttribute('position', new THREE.BufferAttribute(vertices2, 3));
    wall2Geometry.setIndex(indices2);
    wall2Geometry.computeVertexNormals();
    wall2 = new THREE.Mesh(wall2Geometry, wallMaterials[0]);

    let vertices3 = new Float32Array([
        -4.5, 1, 3, // Vertex O
        -3.5, 1, 3, // Vertex 1
        -4.5, 2, 3, // vertex 2
        -3.5, 2, 3, // Vertex 3
    ]);
    
    let indices3 = [
        0, 1, 2,
        1, 3, 2
    ];

    let window1Geometry = new THREE.BufferGeometry();
    window1Geometry.setAttribute('position', new THREE.BufferAttribute(vertices3, 3));
    window1Geometry.setIndex(indices3);
    window1Geometry.computeVertexNormals();
    window1 = new THREE.Mesh(window1Geometry, windowMaterials[0]);

    let vertices4 = new Float32Array([
        -1.5, 1, 3, // Vertex O
        -0.5, 1, 3, // Vertex 1
        -1.5, 2, 3, // vertex 2
        -0.5, 2, 0, // Vertex 3
    ]);
    
    let indices4 = [
        0, 1, 2,
        1, 3, 2
    ];

    let window2Geometry = new THREE.BufferGeometry();
    window2Geometry.setAttribute('position', new THREE.BufferAttribute(vertices4, 3));
    window2Geometry.setIndex(indices4);
    window2Geometry.computeVertexNormals();
    window2 = new THREE.Mesh(window2Geometry, windowMaterials[0]);

    let vertices5 = new Float32Array([
        -3, 0, 3, // Vertex O
        -2, 0, 3, // Vertex 1
        -3, 2, 3, // vertex 2
        -2, 2, 0, // Vertex 3
    ]);
    
    let indices5 = [
        0, 1, 2,
        1, 3, 2
    ];

    let doorGeometry = new THREE.BufferGeometry();
    doorGeometry.setAttribute('position', new THREE.BufferAttribute(vertices5, 3));
    doorGeometry.setIndex(indices5);
    doorGeometry.computeVertexNormals();
    door = new THREE.Mesh(doorGeometry, trunkMaterials[0]);

    let vertices6 = new Float32Array([
        -0.5, 4.5, 1.5, // Vertex O
        -4.5, 4.5, 1.5, // Vertex 1
        0, 3, 3, // vertex 2
        -5, 3, 3, // Vertex 3
    ]);
    
    let indices6 = [
        0, 1, 2,
        1, 3, 2
    ];

    let roof1Geometry = new THREE.BufferGeometry();
    roof1Geometry.setAttribute('position', new THREE.BufferAttribute(vertices6, 3));
    roof1Geometry.setIndex(indices6);
    roof1Geometry.computeVertexNormals();
    roof1 = new THREE.Mesh(roof1Geometry, roofMaterials[0]);

    let vertices7 = new Float32Array([
        -0.5, 4.5, 1.5, // Vertex O
        1, 3, 0, // Vertex 1
        0, 3, 3, // vertex 2
    ]);
    
    let indices7 = [
        0, 2, 1
    ];

    let roof2Geometry = new THREE.BufferGeometry();
    roof2Geometry.setAttribute('position', new THREE.BufferAttribute(vertices7, 3));
    roof2Geometry.setIndex(indices7);
    roof2Geometry.computeVertexNormals();
    roof2 = new THREE.Mesh(roof2Geometry, roofMaterials[0]);

    scene.add(wall1);
    scene.add(wall2);
    scene.add(window1);
    scene.add(window2);
    scene.add(door);
    scene.add(roof1);
    scene.add(roof2);
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
            moon.material = moonMaterials[1];
            for(var i = 0; i < 3; i++){
                trunks[i].material = trunkMaterials[1];
                branches[2 * i].material = trunkMaterials[1];
                branches[2 * i + 1].material = trunkMaterials[1];
                for (var ii = 0; ii < 3; ii++) {
                    crowns[i + ii * 3].material = crownMaterials[1];
                }
            }
            body.material = ufoMaterials[1];
            cockpit.material = ufoMaterials[1];
            cylinder.material = ufoMaterials[1];
            for (var i = 0; i < 8; i++) {
                lights[i].material = moonMaterials[1];
            }
            wall1.material = wallMaterials[1];
            wall2.material = wallMaterials[1];
            window1.material = windowMaterials[1];
            window2.material = windowMaterials[1];
            door.material = trunkMaterials[1];
            roof1.material = roofMaterials[1];
            roof2.material = roofMaterials[1];
            break;
        case 'Phong':
            moon.material = moonMaterials[2];
            for(var i = 0; i < 3; i++){
                trunks[i].material = trunkMaterials[2];
                branches[2 * i].material = trunkMaterials[2];
                branches[2 * i + 1].material = trunkMaterials[2];
                for (var ii = 0; ii < 3; ii++) {
                    crowns[i + ii * 3].material = crownMaterials[2];
                }
            }
            body.material = ufoMaterials[2];
            cockpit.material = ufoMaterials[2];
            cylinder.material = ufoMaterials[2];
            for (var i = 0; i < 8; i++) {
                lights[i].material = moonMaterials[2];
            }
            wall1.material = wallMaterials[2];
            wall2.material = wallMaterials[2];
            window1.material = windowMaterials[2];
            window2.material = windowMaterials[2];
            door.material = trunkMaterials[2];
            roof1.material = roofMaterials[2];
            roof2.material = roofMaterials[2];
            break;
        case 'Toon':
            moon.material = moonMaterials[3];
            for(var i = 0; i < 3; i++){
                trunks[i].material = trunkMaterials[3];
                branches[2 * i].material = trunkMaterials[3];
                branches[2 * i + 1].material = trunkMaterials[3];
                for (var ii = 0; ii < 3; ii++) {
                    crowns[i + ii * 3].material = crownMaterials[3];
                }
            }
            body.material = ufoMaterials[3];
            cockpit.material = ufoMaterials[3];
            cylinder.material = ufoMaterials[3];
            for (var i = 0; i < 8; i++) {
                lights[i].material = moonMaterials[3];
            }
            wall1.material = wallMaterials[3];
            wall2.material = wallMaterials[3];
            window1.material = windowMaterials[3];
            window2.material = windowMaterials[3];
            door.material = trunkMaterials[3];
            roof1.material = roofMaterials[3];
            roof2.material = roofMaterials[3];
            break;
        case 'Basic':
            moon.material = moonMaterials[0];
            for(var i = 0; i < 3; i++){
                trunks[i].material = trunkMaterials[0];
                branches[2 * i].material = trunkMaterials[0];
                branches[2 * i + 1].material = trunkMaterials[0];
                for (var ii = 0; ii < 3; ii++) {
                    crowns[i + ii * 3].material = crownMaterials[0];
                }
            }
            body.material = ufoMaterials[0];
            cockpit.material = ufoMaterials[0];
            cylinder.material = ufoMaterials[0];
            for (var i = 0; i < 8; i++) {
                lights[i].material = moonMaterials[0];
            }
            wall1.material = wallMaterials[0];
            wall2.material = wallMaterials[0];
            window1.material = windowMaterials[0];
            window2.material = windowMaterials[0];
            door.material = trunkMaterials[0];
            roof1.material = roofMaterials[0];
            roof2.material = roofMaterials[0];
            break;
    }
    
}
