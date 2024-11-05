import * as THREE from 'three';
import { addSnow, addHatWithBalls, addBalls, musicBall, createGUI, Settings } from './helpers';
import hat from './models/hatOBJ/textured.obj';
import hat2 from './models/hat2OBJ/textured.obj';
import hat3 from './models/hat3OBJ/textured.obj';

export async function initializeScene1(camera: THREE.PerspectiveCamera, renderer:THREE.WebGLRenderer, raycaster:THREE.Raycaster,audio:HTMLAudioElement| null, tempo:number, chill_or_dance:string, song_on:boolean) {
    const scene = new THREE.Scene();
    scene.background = new THREE.TextureLoader().load("./images/sky.jpeg");
    scene.background.mapping = THREE.EquirectangularReflectionMapping;
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1000, 1000);
    const texture = new THREE.TextureLoader().load("./images/floor.jpeg");
    
    const snowMat = new THREE.MeshPhongMaterial({
        color: 0x999999,
        specular: 0xffffff,
        shininess: 1,
        normalMap: new THREE.TextureLoader().load("./images/snow2.jpeg"),
    });

    const plane = new THREE.Mesh(planeGeometry, snowMat);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -5;
    scene.add(plane);

    let hat_1, hat_2, hat_3;
    try {
        hat_1 = await addHatWithBalls(hat, './models/hatOBJ/textured.mtl', camera, raycaster, scene, plane, renderer);
        let balls1 = addBalls(hat_1, plane, './songs/data.json');
        scene.add(balls1);
        musicBall(balls1, camera, renderer,raycaster,audio,tempo,chill_or_dance,song_on);
    } catch (error) {
        console.error(error);
    }

    try {
        hat_2 = await addHatWithBalls(hat2, './models/hat2OBJ/textured.mtl', camera, raycaster, scene, plane, renderer);
        hat_2.rotateY(Math.PI * 11.0 / 12.0);
        hat_2.position.set(40, 10, 20);
        let balls2 = addBalls(hat_2, plane, './songs2/data.json');
        scene.add(balls2);
        musicBall(balls2, camera, renderer, raycaster, audio,tempo,chill_or_dance,song_on);
    } catch (error) {
        console.error(error);
    }

    try {
        hat_3 = await addHatWithBalls(hat3, './models/hat3OBJ/textured.mtl', camera, raycaster, scene, plane, renderer);
        hat_3.rotateY(Math.PI * 14.0 / 12.0);
        hat_3.position.set(-40, 10, 0);
        let balls = addBalls(hat_3, plane, './songs3/data.json');
        scene.add(balls);
        musicBall(balls, camera,renderer, raycaster, audio,tempo,chill_or_dance,song_on);
    } catch (error) {
        console.error(error);
    }

    const DirectionalLight = new THREE.DirectionalLight(0x909090);
    DirectionalLight.position.set(0, 300, 50);
    DirectionalLight.castShadow = true;
    const pointLight = new THREE.PointLight(0x900050, 10, 70);
    pointLight.position.set(30, 50, 30);
    pointLight.castShadow = true;
    scene.add(DirectionalLight);
    scene.add(pointLight);

    const ambientLight = new THREE.AmbientLight(new THREE.Color(0x303030));
    scene.add(ambientLight);

    const params = new Settings();
    createGUI(params, scene);

    return {scene, plane};
}

