import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { initializeScene1 } from './scene1';
import { initializeScene2 } from './scene2';
import { initializeScene3 } from './scene3';
import { initializeScene4 } from './scene4';
import { addEventListeners } from './eventHandlers';
import * as TWEEN from '@tweenjs/tween.js';

let currentScene = 1;
const scenes = [initializeScene1, initializeScene2, initializeScene3, initializeScene4];
let current_Audio: HTMLAudioElement | null = null;
const wind_Audio = new Audio("./Audio/wind.wav");
current_Audio = wind_Audio;
let tempo = 0.0;  
let chill_or_dance = "not yet"
let song_on = false;
let audioInfo = {current_Audio,tempo,chill_or_dance,song_on}
const chill_Color = new THREE.Color(0x990000);
const dance_Color = new THREE.Color(0xffff00);

async function main() {
    const renderer = new THREE.WebGLRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    document.body.appendChild(renderer.domElement);

    const raycaster = new THREE.Raycaster();
    

    const cameras = [
        new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000),
        new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000),
        //new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000),
        //new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000)
    ];

    cameras[0].position.set(0, 10, 60);
    cameras[1].position.set(0, 20, 100);
    //cameras[2].position.set(0, 20, 100);
    //cameras[3].position.set(0, 700, 0);

    const controls = [
        new OrbitControls(cameras[0], renderer.domElement),
        new OrbitControls(cameras[1], renderer.domElement),
        //new OrbitControls(cameras[2], renderer.domElement),
        //new OrbitControls(cameras[3], renderer.domElement),
    ];

    const scene1 = await initializeScene1(cameras[0], renderer, raycaster, current_Audio, tempo, chill_or_dance, song_on);
    const scene2 = await initializeScene2(cameras[1]);
    //const scene3 = await initializeScene3(cameras[2], renderer, raycaster, current_Audio);
    //const scene4 = await initializeScene4(cameras[3], renderer, raycaster, current_Audio);
    
    const scenesArray = [scene1,scene2];//, scene2, scene3, scene4];

    addEventListeners(renderer, scenesArray, cameras);
    current_Audio?.play()

    function animate() {
        requestAnimationFrame(animate);
        TWEEN.update()
        scenesArray.forEach((sceneObj, index) => {
            if (currentScene === index + 1) {
                controls[index].update();
                renderer.render(sceneObj.scene, cameras[index]);
            }
        });

        
    }

    animate();
}

main();


