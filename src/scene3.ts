import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import { addSnow2, addSnow3 } from './helpers';

export async function initializeScene3(camera: THREE.PerspectiveCamera,renderer: THREE.WebGLRenderer) {
    const scene = new THREE.Scene();
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1000, 1000);
    const texture = new THREE.TextureLoader().load("./images/floor.jpeg");
    const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 1, color: 0x909090 });

    const plane = new THREE.Mesh(planeGeometry, material);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    plane.position.y = -5;
    scene.add(plane);

    const DirectionalLight = new THREE.DirectionalLight(0x909090);
    DirectionalLight.position.set(0, 300, 50);
    DirectionalLight.castShadow = true;
    scene.add(DirectionalLight);

    const ambientLight = new THREE.AmbientLight(new THREE.Color(0x303030));
    scene.add(ambientLight);

    const wallGeometry = new THREE.PlaneGeometry(200, 200);
    const backMirror = new Reflector(wallGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x303030
    });
    scene.add(backMirror);
    backMirror.position.set(0, 0, -100);

    const frontMirror = new Reflector(wallGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x303030
    });
    scene.add(frontMirror);
    frontMirror.rotateY(Math.PI);
    frontMirror.position.set(0, 0, 100);

    const leftMirror = new Reflector(wallGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x303030
    });
    scene.add(leftMirror);
    leftMirror.position.set(-100, 0, 0);
    leftMirror.rotateY(Math.PI / 2);

    const rightMirror = new Reflector(wallGeometry, {
        clipBias: 0.003,
        textureWidth: window.innerWidth * window.devicePixelRatio,
        textureHeight: window.innerHeight * window.devicePixelRatio,
        color: 0x303030
    });
    scene.add(rightMirror);
    rightMirror.position.set(100, 0, 0);
    rightMirror.rotateY(-Math.PI / 2);

    const clock = new THREE.Clock();

    const snowGeometry2 = addSnow2(scene);
    const snowGeometry3 = addSnow3(scene);

    const statueAni = new GLTFLoader();
    let mixer: THREE.AnimationMixer | null = null;
    statueAni.load('./statue/untitled2.glb', (gltf) => {
        const mesh = gltf.scene;
        scene.add(mesh);
        mesh.scale.set(3, 3, 3);
        mesh.rotateY(Math.PI);

        gltf.scene.traverse((o) => {
            if (o instanceof THREE.Mesh) {
                o.material = new THREE.MeshStandardMaterial({
                    color: 0xffffff,
                    metalness: 0.7,
                    roughness: 0.6
                });
            }
        });

        if (gltf.animations && gltf.animations.length) {
            mixer = new THREE.AnimationMixer(mesh);
            const clip = gltf.animations[0];
            const action = mixer.clipAction(clip);
            action.setLoop(THREE.LoopRepeat, Infinity);
            action.play();

            const raycaster = new THREE.Raycaster();
            const renderer = new THREE.WebGLRenderer();
            renderer.domElement.addEventListener('mousedown', (event) => {
                let mouseX = (event.clientX / window.innerWidth) * 2 - 1;
                let mouseY = -(event.clientY / window.innerHeight) * 2 + 1;
                raycaster.setFromCamera({ x: mouseX, y: mouseY }, camera);
                let intersects = raycaster.intersectObject(mesh);
                if (intersects[0]) action.play();
            });
        }
    });

    function animate() {
        requestAnimationFrame(animate);
        if (mixer) {
            mixer.update(clock.getDelta());
        }
        renderer.render(scene, camera);
    }

    animate();

    return { scene, snowGeometry2, snowGeometry3 };
}

