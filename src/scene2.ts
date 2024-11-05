import * as THREE from 'three';
import { addSnow, createGUI, Settings } from './helpers';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import plant from './models/Plant/textured.obj';

export async function initializeScene2(camera: THREE.PerspectiveCamera) {
    const scene = new THREE.Scene();
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1000, 1000);
    const texture = new THREE.TextureLoader().load("./images/floor.jpeg");
    const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 1, color: 0x909090 });

    const plane = new THREE.Mesh(planeGeometry, material);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -5;
    scene.add(plane);

    const DirectionalLight = new THREE.DirectionalLight(0xffffff);
    DirectionalLight.position.set(50, 50, 50);
    DirectionalLight.castShadow = true;
    const ambientLight = new THREE.AmbientLight(new THREE.Color(0x404040));
    scene.add(DirectionalLight);
    scene.add(ambientLight);

    const objLoader = new OBJLoader();
    let mesh = objLoader.parse(plant).children[0] as THREE.Mesh;
    if (mesh) {
        scene.add(mesh);
        mesh.name = "Plant";
        mesh.scale.set(200, 200, 200);
        mesh.rotateY(Math.PI);
        mesh.position.set(-150, 90, -60);
        mesh.castShadow = true;
        mesh.receiveShadow = true;
    }

    const storeGeometry = new THREE.BoxGeometry(50, 50, 50);
    const store1 = new THREE.Mesh(storeGeometry, new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('./images/shop.jpeg') }));
    const store2 = new THREE.Mesh(storeGeometry, new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('./images/shop2.jpeg') }));
    const store3 = new THREE.Mesh(storeGeometry, new THREE.MeshPhongMaterial({ map: new THREE.TextureLoader().load('./images/shop3.jpeg') }));

    store1.position.set(0, 20, -20);
    store2.position.set(55, 20, -20);
    store3.position.set(-55, 20, -20);

    const stores = new THREE.Object3D();
    stores.add(store1);
    stores.add(store2);
    stores.add(store3);
    scene.add(stores);

    const params = new Settings();
    createGUI(params, scene);

    return { scene, stores };
}

