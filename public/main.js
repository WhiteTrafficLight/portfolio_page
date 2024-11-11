import { AxesHelper, BufferAttribute, Light, Mesh, MeshStandardMaterial, ObjectLoader, PositionalAudio } from 'three';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import hat from './models/hatOBJ/textured.obj';
import hat2 from './models/hat2OBJ/textured.obj';
import hat3 from './models/hat3OBJ/textured.obj';
//import tv from './tv/tv.obj';
//import car_frame from './car/Vazz.obj';
//import car_glass from './car/VazGlass.obj';
import plant from './models/Plant/textured.obj';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import * as TWEEN from '@tweenjs/tween.js';
import { addBalls } from './helper';
import { addBalls2 } from './helper';
import { addSnow } from './helper';
import { addSnow2 } from './helper';
import { addSnow3 } from './helper';
import { addHatWithBalls } from './helper';
import { FontLoader } from 'three/examples/jsm/loaders/FontLoader.js';
import { TextGeometry } from 'three/examples/jsm/geometries/TextGeometry.js';
import dat from 'dat.gui';
import { createGUI } from './helper';
import { Settings } from './helper';
import font2 from 'three/examples/fonts/helvetiker_regular.typeface.json';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
//import { Midi } from '@tonejs/midi';
import * as Tone from 'tone';
//import { performance } from 'perf_hooks';
let scene = new THREE.Scene();
let scene2 = new THREE.Scene();
let scene3 = new THREE.Scene();
let scene4 = new THREE.Scene();
async function main() {
    // Create a camera
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const camera2 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const camera3 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    const camera4 = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
    // Move the camera back so we can see the plane
    camera.position.z = 100;
    camera.position.y = 20;
    camera2.position.z = 100;
    camera2.position.y = 20;
    camera3.position.z = 100;
    camera3.position.y = 20;
    camera4.position.y = 700;
    //camera4.lookAt(0,-1,0);
    // Create a renderer
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);
    const raycaster = new THREE.Raycaster();
    const controls = new OrbitControls(camera, renderer.domElement);
    const controls2 = new OrbitControls(camera2, renderer.domElement);
    const controls3 = new OrbitControls(camera3, renderer.domElement);
    const controls4 = new OrbitControls(camera4, renderer.domElement);
    const texture = new THREE.TextureLoader().load("./images/floor.jpeg");
    const texture_building = new THREE.TextureLoader().load("./images/building.jpeg");
    const texture_building2 = new THREE.TextureLoader().load("./images/building2.jpeg");
    const texture_building3 = new THREE.TextureLoader().load("./images/building3.jpeg");
    const texture4 = new THREE.TextureLoader().load("./images/silentdisco.jpeg");
    const normal = new THREE.TextureLoader().load("./images/snow2.jpeg");
    scene.background = new THREE.TextureLoader().load("./images/sky.jpeg");
    scene.background.mapping = THREE.EquirectangularReflectionMapping;
    scene2.background = new THREE.TextureLoader().load("./images/sunny.jpeg");
    scene2.background.mapping = THREE.EquirectangularReflectionMapping;
    //const videoElement = document.getElementById('background-video') as HTMLVideoElement;
    //videoElement.play();
    //if (videoElement) {
    // Access videoElement properties or methods here
    //  const videoTexture = new THREE.VideoTexture(videoElement)
    //  scene4.background = videoTexture;
    //} else {
    // console.error("Video element not found");
    //}
    let scene_nr = 2;
    let time = 0.0;
    let mouseX = 0;
    let mouseY = 0;
    let mouseClick = 0;
    let point = new THREE.Vector3();
    let point2 = new THREE.Vector3();
    let tempo = 0.0;
    let chill_Color = new THREE.Color(0x990000);
    let dance_Color = new THREE.Color(0xffff00);
    let chill_or_dance = "not yet";
    let current_Audio = null;
    const wind_Audio = new Audio("./Audio/wind.wav");
    const Disco_Audio = new Audio("./Audio/Disco.mp3");
    const Disco_Audio2 = new Audio("./Audio/Nu Genea - Tienate.mp3");
    const step_Audio = new Audio("./Audio/step.mp3");
    const Techno_Audio = new Audio("./Audio/Siu Mata & Amor Satyr - Speed Dembow Vol.II - 03 Reggaeton Sex.mp3");
    Disco_Audio2.play();
    current_Audio = Disco_Audio2;
    let song_on = false;
    let Keys = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
    // Add another event listener to set the mouseClick variable back to 0
    renderer.domElement.addEventListener('mouseup', () => {
        mouseClick = 0;
        //time = 0.0;
    });
    // Add event listeners to update the mouseX and mouseY variables
    // Create a plane geometry
    const boxGeometry = new THREE.BoxGeometry(10, 10, 10, 100, 100, 100);
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1000, 1000);
    const sphereGeometry = new THREE.SphereGeometry(0.1, 12, 12);
    var snowGeometry = addSnow(scene);
    var cubeRenderTarget = new THREE.WebGLCubeRenderTarget(1024, {
        format: THREE.RGBFormat,
        type: THREE.FloatType
    });
    var cubeCamera = new THREE.CubeCamera(1, 1000, cubeRenderTarget);
    scene2.add(cubeCamera);
    var mirrorGeometry = new THREE.PlaneGeometry(100, 100);
    var mirrorMaterial = new THREE.MeshPhongMaterial({
        envMap: cubeRenderTarget.texture,
        side: THREE.DoubleSide
    });
    var mirrorMesh = new THREE.Mesh(mirrorGeometry, mirrorMaterial);
    mirrorMesh.position.set(0, 30, -70);
    //scene2.add(mirrorMesh);
    // Create a custom material
    const material = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: time },
            map: { value: texture },
            mouseX: { value: mouseX },
            mouseY: { value: mouseY },
            mouseClick: { value: mouseClick },
            pointX: { value: point.x },
            pointY: { value: point.y },
            pointZ: { value: point.z },
        },
        vertexShader: `
        uniform float time;
        uniform sampler2D map;
        uniform float mouseX;
        uniform int mouseClick;
        uniform float pointX;
        uniform float pointY;
        uniform float pointZ;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            vec3 newPosition = position;
            vec4 glopos4 = modelMatrix * vec4(position,1.0);
            vec3 glopos = vec3(glopos4.x, glopos4.y, glopos4.z); 
            //newPosition = position+vec3(0.0, 0.0, cos(position.x * time) * 3.0);
            if(mouseClick == 1){
                float step = 0.0;
                float dist = sqrt((pointX-glopos.x)*(pointX-glopos.x)+(pointY-glopos.y)*(pointY-glopos.y)+(pointZ-glopos.z)*(pointZ-glopos.z));
                float sstep= 10.0*time-dist;
                if(sstep>0.0) step = 1.0;
                if(dist<1.0) dist = 1.0; 
                newPosition = position + vec3(0.0,0.0,10.0*step*sin(time-dist)/dist/sqrt(dist));
            }
            gl_Position = projectionMatrix * modelViewMatrix * vec4(newPosition, 1.0);
        }
    `,
        fragmentShader: `
        uniform vec3 color;
        uniform sampler2D map;
        varying vec2 vUv;
        void main() {
            vec4 color= vec4(1.0,1.0,1.0,1.0);
            gl_FragColor = color;
        }
    `
    });
    const material3 = new THREE.ShaderMaterial({
        uniforms: {
            time: { value: time },
            map: { value: texture },
            mouseX: { value: mouseX },
            mouseY: { value: mouseY },
            mouseClick: { value: mouseClick },
            pointX: { value: point2.x },
            pointY: { value: point2.y },
            pointZ: { value: point2.z }
        },
        vertexShader: `
        uniform float time;
        uniform sampler2D map;
        uniform float mouseX;
        uniform float mouseY;
        uniform int mouseClick;
        uniform float pointX;
        uniform float pointY;
        uniform float pointZ;
        varying vec2 vUv;
        varying vec3 pos;
        varying vec3 norm;
        void main() {
            vUv = uv;
            pos = position;
            norm = normal;
            vec3 newPosition = vec3(0.0,0.0,0.0);
            newPosition = position+vec3(0.0, 0.0, cos(position.x * time) * 3.0);
            if(mouseClick == 1){
                float step = 0.0;
                float dist = sqrt((pointX-position.x)*(pointX-position.x)+(pointY-position.y)*(pointY-position.y)+(pointZ-position.z)*(pointZ-position.z));
                float sstep= 10.0*time-dist;
                if(sstep>0.0) step = 1.0;
                if(dist<1.0) dist = 1.0; 
                newPosition = position + vec3(0.0,0.0,200.0*step*sin(time-dist)/dist/dist);
            }
            gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
    `,
        fragmentShader: `
        #define PI 3.141592
    
        precision highp float;
        uniform sampler2D map;
        uniform mat4 modelMatrix;
        uniform mat4 projectionMatrix;
        uniform mat4 modelViewMatrix;
        varying vec3 pos;
        varying vec3 norm;
        varying vec2 vUv;
        void main() {
            vec4 glpos4 = modelMatrix*vec4(pos, 1.0);
            vec3 glpos = vec3(glpos4[0]/glpos4[3],glpos4[1]/glpos4[3],glpos4[2]/glpos4[3]);
            vec3 normalworld = normalize(mat3(transpose(inverse(modelMatrix)))*norm);
            vec3 r = normalize(reflect(normalize(-cameraPosition+glpos), normalworld));
            float u2 = (PI+atan(r[2],r[0]))/2.0/PI;
            float v2 = atan(sqrt(r[2]*r[2]+r[0]*r[0]),-r[1])/PI;
            vec2 environment = vec2(u2,v2);
            vec4 color= texture2D(map,environment);
            gl_FragColor = color;
        }
    `
    });
    const material2 = new THREE.MeshPhongMaterial({
        map: texture,
        shininess: 1,
        color: 0x909090,
        //normalMap: normal2
    });
    const snowMat = new THREE.MeshPhongMaterial({
        color: 0x999999,
        specular: 0xffffff,
        shininess: 1,
        normalMap: normal,
    });
    // create a point light
    const DirectionalLight = new THREE.DirectionalLight(0x909090);
    DirectionalLight.position.set(0, 300, 50);
    DirectionalLight.castShadow = true;
    const pointLight = new THREE.PointLight(0x900050, 10, 70);
    pointLight.position.set(30, 50, 30);
    pointLight.castShadow = true;
    const pointLight2 = new THREE.PointLight(0x900050, 10, 70);
    pointLight2.position.set(20, 50, -20);
    pointLight2.castShadow = true;
    const pointLight3 = new THREE.PointLight(0x900050, 10, 70);
    pointLight3.position.set(-20, 50, 40);
    pointLight3.castShadow = true;
    const DirectionalLight2 = new THREE.DirectionalLight(0xffffff);
    DirectionalLight2.position.set(50, 50, 50);
    DirectionalLight2.castShadow = true;
    scene.add(DirectionalLight);
    scene.add(pointLight);
    scene.add(pointLight2);
    scene.add(pointLight3);
    // create an ambient light
    const ambientLight = new THREE.AmbientLight(new THREE.Color(0x303030));
    const ambientLight2 = new THREE.AmbientLight(new THREE.Color(0x404040));
    // add the ambient light to the scene
    scene.add(ambientLight);
    scene2.add(DirectionalLight2);
    scene2.add(ambientLight2);
    const plane = new THREE.Mesh(planeGeometry, snowMat);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -5;
    const plane2 = new THREE.Mesh(planeGeometry, material2);
    plane2.receiveShadow = true;
    plane2.rotation.x = -0.5 * Math.PI;
    plane2.position.y = -5;
    let hat_1;
    let hat_2;
    let hat_3;
    try {
        //creating hats
        hat_1 = await addHatWithBalls(hat, './models/hatOBJ/textured.mtl', camera, raycaster, scene, plane, renderer);
        let balls1 = addBalls(hat_1, plane, './songs/data.json');
        scene.add(balls1);
        musicBall(balls1, camera);
    }
    catch (error) {
        console.error(error);
    }
    try {
        //creating hats
        hat_2 = await addHatWithBalls(hat2, './models/hat2OBJ/textured.mtl', camera, raycaster, scene, plane, renderer);
        //setting postion
        hat_2.rotateY(Math.PI * 11.0 / 12.0);
        hat_2.position.x = 40;
        hat_2.position.z = 20;
        let balls2 = addBalls(hat_2, plane, './songs2/data.json');
        scene.add(balls2);
        musicBall(balls2, camera);
    }
    catch (error) {
        console.error(error);
    }
    try {
        //creating hats
        hat_3 = await addHatWithBalls(hat3, './models/hat3OBJ/textured.mtl', camera, raycaster, scene, plane, renderer);
        //setting postion
        hat_3.rotateY(Math.PI * 14.0 / 12.0);
        hat_3.position.x = -40;
        hat_3.position.z = 0;
        hat_3.translateY(-5);
        let balls = addBalls(hat_3, plane, './songs3/data.json');
        scene.add(balls);
        musicBall(balls, camera);
    }
    catch (error) {
        console.error(error);
    }
    function musicBall(obj, camera) {
        renderer.domElement.addEventListener('mousedown', (event) => {
            let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
            let intersects = raycaster.intersectObject(obj);
            console.log(intersects[0]);
            if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
                var song = intersects[0].object.geometry.getAttribute('song').array;
                var audio = new Audio(song);
                var audio2 = new Audio("./Audio/crackle.wav");
                console.log(current_Audio);
                if (current_Audio) {
                    current_Audio.pause();
                    current_Audio.currentTime = 0;
                    Keys = [1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0, 1.0];
                }
                current_Audio = audio;
                audio2.play();
                fetch('http://localhost:8081/predict', {
                    method: 'post',
                    body: JSON.stringify({
                        song: song
                    }),
                    headers: {
                        'Content-Type': 'application/json'
                    }
                })
                    .then(response => response.json())
                    .then(data => {
                    tempo = data.tempo;
                    if (data.mood == 1) {
                        chill_or_dance = "chill";
                    }
                    if (data.mood == 0) {
                        chill_or_dance = "dance";
                    }
                    const socket = new WebSocket("ws://localhost:8765");
                    socket.onopen = function () {
                        socket.send(song);
                    };
                    socket.onmessage = function (event) {
                        if (current_Audio) {
                            const data = JSON.parse(event.data);
                            const amplitudes = data.amplitudes;
                            Keys[0] = amplitudes[0];
                            Keys[1] = amplitudes[1];
                            Keys[2] = amplitudes[2];
                            Keys[3] = amplitudes[3];
                            Keys[4] = amplitudes[4];
                            Keys[5] = amplitudes[5];
                            Keys[6] = amplitudes[6];
                            Keys[7] = amplitudes[7];
                            Keys[8] = amplitudes[8];
                            Keys[9] = amplitudes[9];
                        }
                    };
                    current_Audio = audio;
                    current_Audio.play();
                    console.log(current_Audio);
                    current_Audio.addEventListener('ended', function () {
                        current_Audio = null;
                        song_on = false;
                    });
                    song_on = true;
                });
            }
        });
        /*renderer.domElement.addEventListener('mousemove', event => {
            let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
            let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
            raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
            let intersects = raycaster.intersectObject(obj);
            if (intersects.length > 0 && intersects[0].object instanceof THREE.Mesh) {
                var song = intersects[0].object.geometry.getAttribute('songName').array as string
                const loader = new FontLoader();
                console.log("시부레")
                loader.parse(font2)
                loader.load('three/examples/fonts/helvetiker_regular.typeface.json', function (font) {

                    const geometry = new TextGeometry('Hello three.js!', {
                        font: font,
                        size: 80,
                        height: 5,
                        curveSegments: 12,
                        bevelEnabled: true,
                        bevelThickness: 10,
                        bevelSize: 8,
                        bevelOffset: 0,
                        bevelSegments: 5
                    });
                    scene.add(new THREE.Mesh(geometry))
                });

            }
        })*/
    }
    console.log(scene);
    var settings = new Settings();
    createGUI(settings, scene);
    let objLoader = new OBJLoader();
    let mtlLoader = new MTLLoader();
    mtlLoader.load('./models/Plant/textured.mtl', (materials) => {
        materials.preload();
        objLoader.setMaterials(materials);
        let mesh = objLoader.parse(plant).children[0];
        if (mesh) {
            scene2.add(mesh);
            mesh.name = "Plant";
            mesh.scale.x = 200;
            mesh.scale.y = 200;
            mesh.scale.z = 200;
            mesh.rotateY(Math.PI);
            mesh.position.y = plane.position.y + 90;
            mesh.position.x = -150;
            mesh.position.z = -60;
            mesh.castShadow = true;
            mesh.receiveShadow = true;
        }
    });
    // Add the plane to the scene
    plane.receiveShadow = true;
    scene.add(plane);
    scene2.add(plane2);
    //scene2.add(DirectionalLight);
    let store_geometry = new THREE.BoxGeometry(50, 50, 50);
    let store1 = new THREE.Mesh(store_geometry);
    store1.material = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('./images/shop.jpeg') });
    let mat1 = store1.material;
    store1.position.y = 20;
    store1.position.z = -20;
    store1.castShadow = true;
    store1.name = "store1";
    let store2 = new THREE.Mesh(store_geometry);
    store2.material = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('./images/shop2.jpeg') });
    let mat2 = store2.material;
    store2.position.y = 20;
    store2.position.x = 55;
    store2.position.z = -20;
    store2.castShadow = true;
    store2.name = "store2";
    let store3 = new THREE.Mesh(store_geometry);
    store3.material = new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('./images/shop3.jpeg') });
    let mat3 = store3.material;
    store3.position.y = 20;
    store3.position.x = -55;
    store3.position.z = -20;
    store3.castShadow = true;
    store3.name = "store3";
    //scene2.add(store1);
    //scene2.add(store2);
    //scene2.add(store3);
    let stores = new THREE.Object3D();
    stores.add(store1);
    stores.add(store2);
    stores.add(store3);
    scene2.add(stores);
    let on_store1 = false;
    let on_store2 = false;
    let on_store3 = false;
    renderer.domElement.addEventListener('mousemove', store_select);
    function store_select(event) {
        let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera2);
        let intersects = raycaster.intersectObject(store1);
        let intersects2 = raycaster.intersectObject(store2);
        let intersects3 = raycaster.intersectObject(store3);
        if (intersects.length > 0) {
            on_store1 = true;
            on_store2 = false;
            on_store3 = false;
        }
        else if (intersects2.length > 0) {
            on_store1 = false;
            on_store2 = true;
            on_store3 = false;
        }
        else if (intersects3.length > 0) {
            on_store1 = false;
            on_store2 = false;
            on_store3 = true;
        }
        else {
            on_store1 = false;
            on_store2 = false;
            on_store3 = false;
        }
    }
    renderer.domElement.addEventListener('mousedown', scene_change);
    function scene_change(event) {
        let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
        let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
        raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera2);
        let intersects1 = raycaster.intersectObject(store1);
        let intersects2 = raycaster.intersectObject(store2);
        let intersects3 = raycaster.intersectObject(store3);
        if (intersects1.length > 0) {
            if (current_Audio) {
                current_Audio.pause();
                step_Audio.play();
                step_Audio.addEventListener('ended', function () {
                    current_Audio = wind_Audio;
                    current_Audio.play();
                });
            }
            scene_nr = 1;
        }
        if (intersects2.length > 0) {
            if (current_Audio) {
                current_Audio.pause();
                step_Audio.play();
                step_Audio.addEventListener('ended', function () {
                    current_Audio = Techno_Audio;
                    current_Audio.play();
                });
            }
            scene_nr = 3;
        }
        if (intersects3.length > 0) {
            if (current_Audio) {
                current_Audio.pause();
                step_Audio.play();
                /*step_Audio.addEventListener('ended',function(){
                    current_Audio = Techno_Audio;
                    current_Audio.play();
                })*/
            }
            scene_nr = 4;
        }
    }
    //renderer.shadowMap.enabled = true;
    //renderer.shadowMap.type = THREE.PCFShadowMap;
    ///Scene3 START
    // Create the six CubeCameras and their render targets
    const wallGeometry = new THREE.PlaneGeometry(200, 200);
    //let tvLoader = new ObjectLoader();
    const test = new THREE.Mesh();
    let testGeometry = new THREE.BoxGeometry(1, 1, 1);
    let testMaterial = new THREE.MeshNormalMaterial();
    const plane3 = new THREE.Mesh(planeGeometry, material2);
    plane3.receiveShadow = true;
    plane3.rotation.x = -0.5 * Math.PI;
    plane3.position.y = -5;
    scene3.add(plane3);
    let pointLight4 = new THREE.PointLight(new THREE.Color(0x705000), 3);
    scene3.add(pointLight4);
    pointLight4.position.y = 50;
    pointLight4.position.z = 20;
    pointLight4.position.x = 20;
    let pointLight5 = new THREE.PointLight(new THREE.Color(0x507000), 3);
    scene3.add(pointLight5);
    pointLight5.position.y = 50;
    pointLight5.position.z = 20;
    pointLight5.position.x = -20;
    let pointLight6 = new THREE.PointLight(new THREE.Color(0x007050), 3);
    scene3.add(pointLight6);
    pointLight6.position.y = 50;
    pointLight6.position.z = -20;
    pointLight6.position.x = 0;
    test.geometry = testGeometry;
    test.material = testMaterial;
    //scene3.add(test);
    var backMirror = new Reflector(wallGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x303030
    });
    scene3.add(backMirror);
    backMirror.position.set(0, 0, -100);
    var frontMirror = new Reflector(wallGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x303030
    });
    scene3.add(frontMirror);
    frontMirror.rotateY(Math.PI);
    frontMirror.position.set(0, 0, 100);
    var leftMirror = new Reflector(wallGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x303030
    });
    scene3.add(leftMirror);
    leftMirror.position.set(-100, 0, 0);
    leftMirror.rotateY(Math.PI / 2);
    var rightMirror = new Reflector(wallGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x303030
    });
    scene3.add(rightMirror);
    rightMirror.position.set(100, 0, 0);
    rightMirror.rotateY(-Math.PI / 2);
    var ceilingMirror = new Reflector(wallGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x303030
    });
    //scene3.add(ceilingMirror);
    ceilingMirror.position.set(0, 100, 0);
    ceilingMirror.rotateX(Math.PI / 2);
    let mixer;
    const statueAni = new GLTFLoader();
    statueAni.load('./statue/untitled2.glb', (gltf) => {
        const mesh = gltf.scene;
        scene3.add(mesh);
        mesh.scale.set(3, 3, 3);
        mesh.rotateY(Math.PI);
        gltf.scene.traverse((o) => {
            if (o instanceof THREE.Mesh) {
                o.material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    metalness: 0.7,
                    roughness: 0.6
                });
                //let balls = addBalls2(o,plane3,'./songs3/data.json');
                //scene3.add(balls);
                //musicBall(balls,camera3);
            }
        });
        // Play the animation if there is one
        if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(mesh);
            const clip = gltf.animations[0];
            const action = mixer.clipAction(clip);
            //action.setLoop(THREE.LoopOnce,Infinity);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();
            console.log(action);
            renderer.domElement.addEventListener('mousedown', (event) => {
                let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera3);
                let intersects = raycaster.intersectObject(mesh);
                if (intersects[0])
                    action.play();
            });
        }
    });
    const clock = new THREE.Clock();
    let snowGeometry2 = addSnow2(scene3);
    let snowGeometry3 = addSnow3(scene3);
    /////////Scene3 End
    /////////Scene4 Start
    /*
    const material4 = new THREE.MeshPhongMaterial({
        map: texture4,
        shininess: 1,
        color:0x909090,
        //normalMap: normal
    
    });
    let plane4 = new THREE.Mesh(planeGeometry,material4);
    plane4.rotateX(-Math.PI/2)
    scene4.add(plane4);
    
    
    let DirectionalLight4 = new THREE.DirectionalLight(new THREE.Color(0x909090));
    scene4.add(DirectionalLight4)
    
    let pointLight4_1 = new THREE.PointLight(new THREE.Color(0x999999),3)
    scene4.add(pointLight4_1);
    pointLight4_1.position.y = 100;
    pointLight4_1.position.z = 40;
    pointLight4_1.position.x = 40;
    
    let pointLight4_2 = new THREE.PointLight(new THREE.Color(0x999999),3)
    scene4.add(pointLight4_2);
    pointLight4_2.position.y = 100;
    pointLight4_2.position.z = 40;
    pointLight4_2.position.x = -40;
    
    let pointLight4_3 = new THREE.PointLight(new THREE.Color(0x999999),3)
    scene4.add(pointLight4_3);
    pointLight4_3.position.y = 100;
    pointLight4_3.position.z = -40;
    pointLight4_3.position.x = 0;
    
    let carModel;
    
    const mtlLoader4 = new MTLLoader();
    const objLoader4 = new OBJLoader();
    const carGroup = new THREE.Group();
    const wheels: THREE.Mesh[] = [];
    
    function findWheels(object: THREE.Object3D, wheels: THREE.Mesh[]) {
        if (object.name.startsWith("Wheel_")) {
          wheels.push(object as THREE.Mesh);
        }
        for (const child of object.children) {
          findWheels(child, wheels);
        }
      }
    
    // Load CAR materials
    mtlLoader4.load('car/Vazz.mtl', (materials) => {
        materials.preload();
        //objLoader4.setMaterials(materials);
      
        // Load VAZZ OBJ
        let car_frame_obj = objLoader4.parse(car_frame);
        findWheels(car_frame_obj,wheels);
        console.log(wheels);
        carGroup.add(car_frame_obj);
    
    })
    // Load VAZZGLASS materials
    mtlLoader4.load('car/VazGlass.mtl', (materials) => {
      materials.preload();
      //objLoader4.setMaterials(materials);
    
      // Load VAZZGLASS OBJ
      let carGlass = objLoader4.parse(car_glass);
      console.log(carGlass);
      carGroup.add(carGlass);
      scene4.add(carGroup);
    
    });
    
    carGroup.scale.set(0.2,0.2,0.2);
    carGroup.rotateY(Math.PI/2);
    
    
    
    
    interface MidiData {
        track: number;
        contents: {
          message: string;
          time: number;
        }[];
      }
      
      const cubesWithMidiData: { cube: THREE.Mesh; duration2 : number; midiMessage: string }[] = [];
      const drumsWithMidiData: { cube: THREE.Mesh; duration2 : number; midiMessage: string }[] = [];
      
    // Function to generate cubes based on MIDI data
    function generateCubes(midiData: MidiData[]) {
        let currentTime = 0;
    
        let minNote = Infinity;
        let maxNote = -Infinity;
    
        midiData.forEach((item) => {
          item.contents.forEach((msg) => {
            if (msg.message.includes("note_on")) {
            const note = parseInt(msg.message.split("note=")[1].split(" ")[0]);
            minNote = Math.min(minNote, note);
            maxNote = Math.max(maxNote, note);
            }
            });
        });
    
      
        midiData.forEach((item, trackIndex) => {
          item.contents.forEach((msg, msgIndex) => {
            currentTime += msg.time;
      
            // Check if the message is a note_on event
            if (msg.message.includes("note_on")) {
              const note = parseInt(msg.message.split("note=")[1].split(" ")[0]);
              const nextMsg = item.contents[msgIndex + 1];
              const duration = nextMsg ? nextMsg.time : 0;
    
              // Normalize the note value to the range [0, 1]
              const normalizedNote = (note - minNote) / (maxNote - minNote);
    
              // Scale the normalized note value to the desired range
              const x_scale = 1/50
              const z_scale = 500;
              const zPosition = - normalizedNote * z_scale + 400;
              const r = normalizedNote;
              const g = normalizedNote;
              const b = normalizedNote;
      
              const geometry = new THREE.BoxGeometry(duration*x_scale, note, 1); // Adjust size according to note value
              const material = new THREE.MeshStandardMaterial({ map:texture_building,color: new THREE.Color(r,g,b), metalness: 0.3, roughness: 0.3,});
              const cube = new THREE.Mesh(geometry, material);
              
              const startPositionX = (currentTime + duration / 2)*x_scale - 200 ;
              cube.position.set(startPositionX, note / 2, zPosition); // Adjust position based on track and message index
              //console.log("startPosition", startPositionX, "note", note,"duration",duration);
              const duration2 = duration*x_scale
              scene4.add(cube);
              cubesWithMidiData.push({ cube, duration2, midiMessage: msg.message });
            }
          });
        });
      }
    
      function generateDrums(midiData: MidiData[]) {
        let currentTime = 0;
    
        let minNote = Infinity;
        let maxNote = -Infinity;
    
        midiData.forEach((item) => {
          item.contents.forEach((msg) => {
            if (msg.message.includes("note_on")) {
            const note = parseInt(msg.message.split("note=")[1].split(" ")[0]);
            minNote = Math.min(minNote, note);
            maxNote = Math.max(maxNote, note);
            }
            });
        });
    
      
        midiData.forEach((item, trackIndex) => {
          item.contents.forEach((msg, msgIndex) => {
            currentTime += msg.time;
      
            // Check if the message is a note_on event
            if (msg.message.includes("note_on")) {
              const note = parseInt(msg.message.split("note=")[1].split(" ")[0]);
              const nextMsg = item.contents[msgIndex + 1];
              const duration = nextMsg ? nextMsg.time : 0;
    
              // Normalize the note value to the range [0, 1]
              const normalizedNote = (note - minNote) / (maxNote - minNote);
    
              // Scale the normalized note value to the desired range
              const x_scale = 1/50
              const z_scale = 500;
              const zPosition = - normalizedNote * z_scale + 300;
              const r = normalizedNote;
              const g = normalizedNote;
              const b = normalizedNote;
      
              const geometry = new THREE.SphereGeometry(note/5); // Adjust size according to note value
              const material = new THREE.MeshStandardMaterial({ map:texture_building,color: new THREE.Color(r,g,b), metalness: 0.0, roughness: 0.3});
              const cube = new THREE.Mesh(geometry, material);
              
              const startPositionX = (currentTime + duration / 2)*x_scale - 200 ;
              cube.position.set(startPositionX, note / 2, zPosition); // Adjust position based on track and message index
              //console.log("startPosition", startPositionX, "note", note,"duration",duration);
              const duration2 = duration*x_scale
              scene4.add(cube);
              drumsWithMidiData.push({ cube, duration2,midiMessage: msg.message });
            }
          });
        });
      }
      let deltaTime = 0;
      let lastTime = performance.now();
      const cameraSpeed = 1;
    
      const synth = new Tone.PolySynth().toDestination();
      const MetalSynth = new Tone.FMSynth().toDestination();
      let whatsynth = 0;
      
      fetch("./midi_data.json")
        .then((response) => response.json())
        .then((midiData: MidiData[]) => {
          generateCubes(midiData);
        })
        .catch((error) => console.error("Error fetching MIDI data:", error));
      /*fetch("./midi_data2.json")
        .then((response) => response.json())
        .then((midiData: MidiData[]) => {
          generateDrums(midiData);
        })
        .catch((error) => console.error("Error fetching MIDI data:", error));
    let animateWheels =false;
        window.addEventListener('keydown', (event) => {
            if (event.key === 'e') {
              // Move the camera to the front of the first cube and look at it
              const firstCube = cubesWithMidiData[0].cube;
              camera4.position.set(firstCube.position.x, 10, firstCube.position.z + 150);
              camera4.lookAt(camera4.position.x, 10, camera4.position.z-10);
              carGroup.position.set(camera4.position.x,0,camera4.position.z-50)
              if(current_Audio) current_Audio.pause();
              //current_Audio = Disco_Audio2;
              //current_Audio.play();
            } else if (event.key === 'ArrowRight') {
              // Move the camera to the right along the x-axis
              camera4.position.x += deltaTime*100;
              carGroup.position.x += deltaTime*100;
              animateWheels = true;
            }
            else if (event.key === 'ArrowLeft') {
                // Move the camera to the right along the x-axis
                camera4.position.x -= 60;
                carGroup.position.x -= 60;
                //camera4.lookAt(camera4.position.x,camera4.position.y,camera.position.z-1)
            }
            
    
        
          });
    
          window.addEventListener("keyup", (event) => {
            if (event.key === "ArrowRight") {
              animateWheels = false;
            }
            else if (event.key === 'm') {
    
                  whatsynth = 1;
                  cubesWithMidiData.forEach(element => {
                      element.cube.material = new THREE.MeshStandardMaterial({ map: texture_building2, metalness: 0.3, roughness: 0.3, });
    
    
    
                  })
            }
              else if (event.key === 'n') {
    
                whatsynth = 2;
                cubesWithMidiData.forEach(element => {
                    element.cube.material = new THREE.MeshStandardMaterial({ map: texture_building3, metalness: 0.3, roughness: 0.3, });
    
    
    
                })
            }
            else if (event.key === 'b') {
    
                whatsynth = 0;
                cubesWithMidiData.forEach(element => {
                    element.cube.material = new THREE.MeshStandardMaterial({ map: texture_building, metalness: 0.3, roughness: 0.3, });
    
    
    
                })
            };
        })
    
          const sampler = new Tone.Sampler(
            {
              D5: './SoundSamples/MYSTRO_sample_pack_MYSTRO_tonal_MYSTRO_100_melody_loop_afro_vijor_Dmin.wav',
              // ... add paths to the rest of the samples you want to use
            },
            {
              onload: () => {
                console.log('Samples loaded');
              },
            }
          ).toDestination();
    
          const sampler2 = new Tone.Sampler(
            {
              B5: './SoundSamples/Origin_Sound_-_she_-_rnb_love_songs_loops_music_loops_chords_OS_SHE_120_synth_chords_gated_Bm.wav',
              // ... add paths to the rest of the samples you want to use
            },
            {
              onload: () => {
                console.log('Samples loaded');
              },
            }
          ).toDestination();
    
          const drums = new Tone.Sampler(
            {
             "G#-1" : './SoundSamples/Drums/Kick.wav',
             "C-1":'./SoundSamples/Drums/Hihat.wav',
             "E-1":'./SoundSamples/Drums/snare.wav',
             C0:'./SoundSamples/Drums/Hihat2.wav'
            // ... add paths to the rest of the samples you want to use
          },
          {
            onload: () => {
              console.log('Samples loaded');
            },
          }
        ).toDestination();
    
    
    
          function midiNumberToNoteName(midiNumber: number) {
            const octave = Math.floor(midiNumber / 12) - 1;
            const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
            const noteName = noteNames[midiNumber % 12];
            return noteName + octave;
          }
        
          
    
          const playingNotes = new Set<number>();
          const playingDrums = new Set<number>();
    
          
    
    
          
           
    */
    ////////Scene4 End
    let angle = 0;
    scene.traverse(function (obj) {
        if (obj instanceof THREE.Mesh)
            obj.castShadow = true;
    });
    const animate = () => {
        requestAnimationFrame(animate);
        if (scene_nr == 1) {
            camera3.lookAt(0, 0, 10000);
            camera2.lookAt(0, 1000, 1000);
            camera4.lookAt(0, 0, 10000);
            TWEEN.update();
            material.uniforms.mouseX.value = mouseX;
            material.uniforms.mouseY.value = mouseY;
            material.uniforms.mouseClick.value = mouseClick;
            material.uniforms.pointX.value = point.x;
            material.uniforms.pointY.value = point.y;
            material.uniforms.pointZ.value = point.z;
            if (texture.image) {
                time += 0.05;
                material.uniforms.time.value = time;
            }
            controls.update();
            if (current_Audio && song_on) {
                angle += tempo * tempo * 0.000001;
                var radius = 100;
                var x = radius * Math.sin(angle);
                var z = radius * Math.cos(angle);
                camera.position.set(x, 10 + 10 * Math.sin(tempo * tempo * current_Audio.currentTime / 10000.0), z);
                camera.lookAt(new THREE.Vector3(0, 0, 0));
                scene.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
                //scene.position.y = -2050;
                const hat = scene.getObjectByName("hat");
                const b = 0.3;
                /*hat_1.scale.x = (Math.pow(200,Keys[0]+b));
                hat_1.scale.y = (Math.pow(200,Keys[0]+b));
                hat_1.scale.z = (Math.pow(200,Keys[0]+b));
                hat_2.scale.x = (Math.pow(200,Keys[5]+b));
                hat_2.scale.y = (Math.pow(200,Keys[5]+b));
                hat_2.scale.z = (Math.pow(200,Keys[5]+b));
                hat_3.scale.y = (Math.pow(200,Keys[9]+b));
                hat_3.scale.y = (Math.pow(200,Keys[9]+b));
                hat_3.scale.y = (Math.pow(200,Keys[9]+b));*/
                if (chill_or_dance == "chill") {
                    pointLight.color = chill_Color;
                    pointLight2.color = chill_Color;
                    pointLight3.color = chill_Color;
                    //DirectionalLight.position.y = 0
                    //DirectionalLight.position.z = 50 
                }
                else if (chill_or_dance == "dance") {
                    pointLight.color = dance_Color;
                    pointLight2.color = dance_Color;
                    pointLight3.color = dance_Color;
                    //DirectionalLight.position.y = -500
                    //DirectionalLight.position.z = 50
                }
                pointLight.intensity = 10 * Math.abs(Math.round(Math.sin((time - 1) * tempo / 200)));
                pointLight2.intensity = 10 * Math.abs(Math.round(Math.sin(time * tempo / 200)));
                pointLight3.intensity = 10 * Math.abs(Math.round(Math.sin((time + 1) * tempo / 200)));
                scene.traverse(function (obj) {
                    if (obj.name == "ball" && obj instanceof THREE.Mesh) {
                        let material = obj.material;
                        material.emissive = new THREE.Color(0.5, 0, 0.7);
                        material.emissiveIntensity = 0.3 * Math.sin(tempo * time / 200);
                    }
                });
            }
            //pointLight.position.set(camera.position.x,camera.position.y,camera.position.z);
            //console.log(snowGeometry.attributes.position.array)
            for (let i = 0; i < 10000; i++) {
                snowGeometry.attributes.position.setY(i, snowGeometry.attributes.position.getY(i) - 1.0);
                if (snowGeometry.attributes.position.getY(i) < -1)
                    snowGeometry.attributes.position.setY(i, Math.random() * 2000);
            }
            snowGeometry.attributes.position.needsUpdate = true;
            renderer.render(scene, camera);
        }
        else if (scene_nr == 2) {
            controls2.update();
            time += 0.02;
            const blinkColor = new THREE.Color(0.2, 0.2, 0.2);
            const nblinkColor = new THREE.Color(0, 0, 0);
            angle += 0.008;
            var radius = 120;
            var x = radius * Math.sin(angle);
            var z = radius * Math.cos(angle);
            camera2.position.set(x, camera2.position.y, z);
            camera2.lookAt(new THREE.Vector3(0, 0, 0));
            scene2.setRotationFromAxisAngle(new THREE.Vector3(0, 1, 0), angle);
            let bump = 0.15 * Math.abs(Math.sin(2 * time)) + 0.85;
            if (on_store1) {
                mat1.emissive = blinkColor;
                mat1.emissiveIntensity = Math.abs(Math.sin(time));
                mat2.emissive = nblinkColor;
                mat3.emissive = nblinkColor;
                store1.scale.set(bump, bump, bump);
            }
            else if (on_store2) {
                mat2.emissive = blinkColor;
                mat2.emissiveIntensity = Math.abs(Math.sin(time));
                mat1.emissive = nblinkColor;
                mat3.emissive = nblinkColor;
                store2.scale.set(bump, bump, bump);
            }
            else if (on_store3) {
                mat3.emissive = blinkColor;
                mat3.emissiveIntensity = Math.abs(Math.sin(time));
                mat1.emissive = nblinkColor;
                mat2.emissive = nblinkColor;
                store3.scale.set(bump, bump, bump);
            }
            else {
                mat1.emissive = nblinkColor;
                mat1.emissive = nblinkColor;
                mat1.emissive = nblinkColor;
                store1.scale.set(1, 1, 1);
                store2.scale.set(1, 1, 1);
                store3.scale.set(1, 1, 1);
            }
            renderer.render(scene2, camera2);
        }
        else if (scene_nr == 3) {
            controls3.update();
            camera.lookAt(0, 0, 90000);
            camera2.lookAt(0, 0, 90000);
            camera4.lookAt(0, 0, 90000);
            mixer?.update(clock.getDelta());
            for (let i = 0; i < 1000; i++) {
                snowGeometry2.attributes.position.setZ(i, snowGeometry2.attributes.position.getZ(i) - 10.0);
                if (snowGeometry2.attributes.position.getZ(i) < -101)
                    snowGeometry2.attributes.position.setZ(i, Math.random() * 200);
            }
            snowGeometry2.attributes.position.needsUpdate = true;
            for (let i = 0; i < 1000; i++) {
                snowGeometry3.attributes.position.setZ(i, snowGeometry3.attributes.position.getZ(i) - 10.0);
                if (snowGeometry3.attributes.position.getZ(i) < -101)
                    snowGeometry3.attributes.position.setZ(i, Math.random() * 200);
            }
            snowGeometry3.attributes.position.needsUpdate = true;
            renderer.render(scene3, camera3);
        }
        /*else {
            //controls4.update();
            camera.lookAt(0, 0, 90000);
            camera2.lookAt(0, 0, 90000);
            camera3.lookAt(0, 0, 90000);
            camera4.updateMatrixWorld();
            camera4.updateProjectionMatrix();
            const currentTime = performance.now();
            deltaTime = (currentTime - lastTime) / 1000; // Convert to seconds
            lastTime = currentTime;
            console.log(deltaTime);
            
                    cubesWithMidiData.forEach(({ cube, duration2, midiMessage },index) => {
                        const note = parseInt(midiMessage.split("note=")[1].split(" ")[0]);
                        const cubeStartX = cube.position.x - duration2 / 2;
                        const cubeEndX = cube.position.x + duration2 / 2;
                    
                        if (camera4.position.x >= cubeStartX && camera4.position.x <= cubeEndX) {
                          if (!playingNotes.has(index)) {
                           
                                if(whatsynth == 0) synth.triggerAttack(midiNumberToNoteName(note),Tone.now());
                                else if(whatsynth == 1) sampler.triggerAttack(midiNumberToNoteName(note),Tone.now());
                                else if(whatsynth == 2) sampler2.triggerAttack(midiNumberToNoteName(note),Tone.now());
                                console.log("note in:",note);
                                console.log(playingNotes);
                                playingNotes.add(index);
                           
                          }
                        }
                        else {
                          if (playingNotes.has(index)) {
                            playingNotes.delete(index);
                            if(whatsynth == 0) synth.triggerRelease(midiNumberToNoteName(note),Tone.now());
                            else if(whatsynth == 1) sampler.triggerRelease(midiNumberToNoteName(note),Tone.now());
                            else if(whatsynth == 2) sampler2.triggerRelease(midiNumberToNoteName(note),Tone.now());
                            console.log("note end:",note);
                            console.log(playingNotes);
                          }
                        }

                      });

                      drumsWithMidiData.forEach(({ cube, duration2, midiMessage },index) => {
                        const note = parseInt(midiMessage.split("note=")[1].split(" ")[0]);
                        const cubeStartX = cube.position.x - duration2 / 2;
                        const cubeEndX = cube.position.x + duration2 / 2;
                    
                        if (camera4.position.x >= cubeStartX && camera4.position.x <= cubeEndX) {
                          if (!playingDrums.has(index)) {
                           
                                drums.triggerAttack(midiNumberToNoteName(note),Tone.now());
                                playingDrums.add(index);
                           
                          }
                        }
                        else {
                          if (playingDrums.has(index)) {
                            playingDrums.delete(index);
                            
                          }
                        }

                      });
                    




            renderer.render(scene4, camera4);
        }*/
    };
    animate();
}
main();
//# sourceMappingURL=main.js.map