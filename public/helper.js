import * as THREE from 'three';
import { OrbitControls } from 'OrbitControls';
import { OBJLoader } from 'OBJLoader';
import { MTLLoader } from 'MTLLoader';
import { GLTFLoader } from 'GLTFLoader';
import dat from 'dat.gui';
import * as TWEEN from '@tweenjs/tween.js';

//import OpenAI from 'openai';
export class Settings extends utils.Callbackable {
    "Please send me to" = "";
}
export function createGUI(params, scene) {
    // we are using dat.GUI (https://github.com/dataarts/dat.gui)
    var gui = new dat.GUI({ width: 400 });
    gui.add(params, 'Please send me to', "").onFinishChange(async function (value) {
        fetch('http://localhost:3000/generate-image', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ prompt: value }), // Sending the prompt in the request body
        })
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
            .then(data => {
            // Use the backend to fetch the image, avoiding CORS issues
            const proxyUrl = `http://localhost:3000/fetch-image?url=${encodeURIComponent(data.imageUrl)}`;
            return fetch(proxyUrl);
        })
            .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.blob();
        })
            .then(blob => {
            var image = new Image();
            image.src = URL.createObjectURL(blob);
            document.body.appendChild(image);
            // If necessary, update your scene's background here
            const texture = new THREE.TextureLoader().load(image.src);
            texture.mapping = THREE.EquirectangularReflectionMapping;
            scene.background = texture;
        })
            .catch(error => {
            console.error('Error fetching image through backend:', error);
        });
    });
    return gui;
}
export function setupLight(scene) {
    // add two point lights and a basic ambient light
    // https://threejs.org/docs/#api/lights/PointLight
    var light = new THREE.PointLight(0xffffcc, 1, 100);
    light.position.set(10, 30, 15);
    light.matrixAutoUpdate = true;
    scene.add(light);
    var light2 = new THREE.PointLight(0xffffcc, 1, 100);
    light2.position.set(10, -30, -15);
    light2.matrixAutoUpdate = true;
    scene.add(light2);
    //https://threejs.org/docs/#api/en/lights/AmbientLight
    scene.add(new THREE.AmbientLight(0x999999));
    return scene;
}
;
// define camera that looks into scene
export function setupCamera(camera, scene) {
    // https://threejs.org/docs/#api/cameras/PerspectiveCamera
    camera.near = 0.01;
    camera.far = 10;
    camera.fov = 70;
    camera.position.z = 1;
    camera.lookAt(scene.position);
    camera.updateProjectionMatrix();
    camera.matrixAutoUpdate = true;
    return camera;
}
// define controls (mouse interaction with the renderer)
export function setupControls(controls) {
    // https://threejs.org/docs/#examples/en/controls/OrbitControls
    controls.rotateSpeed = 1.0;
    controls.zoomSpeed = 1.2;
    controls.enableZoom = true;
    controls.enableKeys = false;
    controls.minDistance = 0.1;
    controls.maxDistance = 5;
    return controls;
}
;
function lightMaterial(coverPath) {
    const texture = new THREE.TextureLoader().load(coverPath);
    texture.needsUpdate = true;
    const material = new THREE.MeshPhongMaterial();
    material.map = texture;
    material.transparent = true;
    material.opacity = 1.0;
    material.shininess = 100;
    return material;
}
export function addBalls(hat, plane, json_path) {
    var balls = new THREE.Object3D();
    fetch(json_path, {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((data) => {
        for (var i = 0; i < data.FileCount; i++) {
            const ballGeo = new THREE.SphereGeometry(1.0);
            const songPath = data.Songs[i].path;
            const songName = data.Songs[i].name;
            const coverPath = data.Songs[i].cover;
            ballGeo.addAttribute("song", songPath);
            ballGeo.addAttribute("songName", songName);
            const ballMat = lightMaterial(coverPath);
            let ball = new THREE.Mesh(ballGeo, ballMat);
            ball.name = "ball";
            ball.castShadow = true;
            balls.add(ball);
            balls.name = "balls";
            var intersects = true;
            while (intersects) {
                ball.position.x = hat.position.x + (Math.random() * 2 - 1) * 10;
                ball.position.z = hat.position.z + (Math.random() * 2 - 1) * 10;
                ball.position.y = plane.position.y + 1.0;
                intersects = false;
                for (var j = 0; j < i; j++) {
                    var otherBall = balls.children[j];
                    var distance = ball.position.distanceTo(otherBall.position);
                    if (distance < 2 * ball.geometry.parameters.radius) {
                        intersects = true;
                        break;
                    }
                }
            }
        }
    });
    return balls;
}
export function addSnow(scene) {
    // Create a snow texture
    const snowTexture = new THREE.TextureLoader().load('./snow.jpeg');
    // Create a snow material
    const snowMaterial = new THREE.PointsMaterial({
        size: 2.0,
        map: snowTexture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: false
    });
    // Create a new buffer geometry
    const snowGeometry = new THREE.BufferGeometry();
    // Create the position attribute
    const positionArray = new Float32Array(10000 * 3);
    const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
    // Add the position attribute to the geometry
    snowGeometry.addAttribute('position', positionAttribute);
    // Add snowflake positions to the position attribute
    for (let i = 0; i < 10000; i++) {
        positionArray[i * 3] = Math.random() * 2000 - 1000;
        positionArray[i * 3 + 1] = Math.random() * 2000 - 1000;
        positionArray[i * 3 + 2] = Math.random() * 2000 - 1000;
    }
    // Create a new particle system
    const particleSystem = new THREE.Points(snowGeometry, snowMaterial);
    // Add the particle system to the scene
    scene.add(particleSystem);
    return snowGeometry;
}
export function addSnow2(scene) {
    // Create a snow texture
    const snowTexture = new THREE.TextureLoader().load('./snow.jpeg');
    // Create a snow material
    const snowMaterial = new THREE.PointsMaterial({
        size: 3.0,
        map: snowTexture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: false,
        color: "red"
    });
    // Create a new buffer geometry
    const snowGeometry = new THREE.BufferGeometry();
    // Create the position attribute
    const positionArray = new Float32Array(1000 * 3);
    const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
    // Add the position attribute to the geometry
    snowGeometry.addAttribute('position', positionAttribute);
    // Add snowflake positions to the position attribute
    for (let i = 0; i < 1000; i++) {
        positionArray[i * 3] = Math.random() * 200 - 100;
        positionArray[i * 3 + 1] = Math.random() * 200 - 100;
        positionArray[i * 3 + 2] = Math.random() * 200 - 100;
    }
    // Create a new particle system
    const particleSystem = new THREE.Points(snowGeometry, snowMaterial);
    // Add the particle system to the scene
    scene.add(particleSystem);
    return snowGeometry;
}
export function addSnow3(scene) {
    // Create a snow texture
    const snowTexture = new THREE.TextureLoader().load('./snow.jpeg');
    // Create a snow material
    const snowMaterial = new THREE.PointsMaterial({
        size: 3.0,
        map: snowTexture,
        blending: THREE.AdditiveBlending,
        depthTest: false,
        transparent: false,
        color: "green"
    });
    // Create a new buffer geometry
    const snowGeometry = new THREE.BufferGeometry();
    // Create the position attribute
    const positionArray = new Float32Array(1000 * 3);
    const positionAttribute = new THREE.BufferAttribute(positionArray, 3);
    // Add the position attribute to the geometry
    snowGeometry.addAttribute('position', positionAttribute);
    // Add snowflake positions to the position attribute
    for (let i = 0; i < 1000; i++) {
        positionArray[i * 3] = Math.random() * 200 - 100;
        positionArray[i * 3 + 1] = Math.random() * 200 - 100;
        positionArray[i * 3 + 2] = Math.random() * 200 - 100;
    }
    // Create a new particle system
    const particleSystem = new THREE.Points(snowGeometry, snowMaterial);
    // Add the particle system to the scene
    scene.add(particleSystem);
    return snowGeometry;
}
export function rain(cloud, rainDrop, material) {
    const a = cloud.geometry.getAttribute('position').array;
    var i = Math.floor(Math.random() * a.length * 5);
    const x = a[3 * i];
    const y = a[3 * i + 1];
    const z = a[3 * i + 2];
    var gl = cloud.getWorldPosition(new THREE.Vector3(x, y, z));
    const rain = new THREE.Mesh(rainDrop, material);
    rain.name = 'rain';
    rain.position.x = x;
    rain.position.y = y;
    rain.position.z = z;
    rain.translateX(gl.x);
    rain.translateY(gl.y);
    rain.translateZ(gl.z);
    //scene.add(rain);
    return rain;
}
export function addHatWithBalls(objFile, mtlFile, camera, raycaster, scene, plane, renderer) {
    const objLoader = new OBJLoader();
    const mtlLoader = new MTLLoader();
    let mesh;
    return new Promise((resolve, reject) => {
        mtlLoader.load(mtlFile, (materials) => {
            materials.preload();
            objLoader.setMaterials(materials);
            mesh = objLoader.parse(objFile).children[0];
            if (mesh) {
                scene.add(mesh);
                mesh.name = "hat";
                mesh.scale.x = 200;
                mesh.scale.y = 200;
                mesh.scale.z = 200;
                mesh.rotateY(Math.PI);
                mesh.position.y = plane.position.y + 3.5 * 4;
                mesh.castShadow = true;
                mesh.receiveShadow = true;
                let material = mesh.material;
                material.emissive = new THREE.Color('0x0000ff');
                material.emissiveIntensity = 0.1;
                renderer.domElement.addEventListener('mousedown', (event) => {
                    let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                    let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
                    raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
                    const intersects = raycaster.intersectObject(mesh);
                    var starting = mesh.position.y;
                    if (intersects.length > 0) {
                        const jumpTween = new TWEEN.Tween(mesh.position).to({ y: mesh.position.y + 30 }, 1000).easing(TWEEN.Easing.Quadratic.Out)
                            .onComplete(() => {
                            const landingTween = new TWEEN.Tween(mesh.position)
                                .to({ y: mesh.position.y }, 1000)
                                .easing(TWEEN.Easing.Quadratic.In)
                                .start();
                        })
                            .start();
                    }
                });
                resolve(mesh);
            }
            else {
                reject("Failed to load mesh.");
            }
        });
    });
}
export function addBalls2(statue, plane, json_path) {
    var balls = new THREE.Object3D();
    fetch(json_path, {
        method: 'GET'
    }).then((response) => {
        return response.json();
    }).then((data) => {
        for (var i = 0; i < data.FileCount; i++) {
            const ballGeo = new THREE.SphereGeometry(1.0);
            const songPath = data.Songs[i].path;
            const songName = data.Songs[i].name;
            const coverPath = data.Songs[i].cover;
            ballGeo.addAttribute("song", songPath);
            ballGeo.addAttribute("songName", songName);
            const ballMat = lightMaterial(coverPath);
            let ball = new THREE.Mesh(ballGeo, ballMat);
            ball.name = "ball";
            ball.castShadow = true;
            balls.add(ball);
            balls.name = "balls";
            var intersects = true;
            while (intersects) {
                ball.position.x = statue.position.x + (Math.random() * 2 - 1) * 10;
                ball.position.z = statue.position.z + (Math.random() * 2 - 1) * 10;
                ball.position.y = plane.position.y + 1.0;
                intersects = false;
                for (var j = 0; j < i; j++) {
                    var otherBall = balls.children[j];
                    var distance = ball.position.distanceTo(otherBall.position);
                    if (distance < 2 * ball.geometry.parameters.radius) {
                        intersects = true;
                        break;
                    }
                }
            }
        }
    });
    return balls;
}
//# sourceMappingURL=helper.js.map