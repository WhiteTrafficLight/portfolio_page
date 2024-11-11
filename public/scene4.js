import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { generateCubes, playMidi } from './midiHandler';
import { Reflector } from 'three/examples/jsm/objects/Reflector';
import * as Tone from 'tone';
export async function initializeScene4(camera, renderer) {
    const scene = new THREE.Scene();
    const planeGeometry = new THREE.PlaneGeometry(1000, 1000, 1000, 1000);
    const texture = new THREE.TextureLoader().load("./images/silentdisco.jpeg");
    const material = new THREE.MeshPhongMaterial({ map: texture, shininess: 1, color: 0x909090 });
    const plane = new THREE.Mesh(planeGeometry, material);
    plane.receiveShadow = true;
    plane.rotation.x = -0.5 * Math.PI;
    scene.add(plane);
    const pointLight1 = new THREE.PointLight(0x999999, 3);
    pointLight1.position.set(40, 100, 40);
    scene.add(pointLight1);
    const pointLight2 = new THREE.PointLight(0x999999, 3);
    pointLight2.position.set(-40, 100, 40);
    scene.add(pointLight2);
    const pointLight3 = new THREE.PointLight(0x999999, 3);
    pointLight3.position.set(0, 100, -40);
    scene.add(pointLight3);
    const carGroup = new THREE.Group();
    const mtlLoader = new MTLLoader();
    const objLoader = new OBJLoader();
    const loadCarModel = (carFramePath, carGlassPath) => {
        mtlLoader.load('car/Vazz.mtl', (materials) => {
            materials.preload();
            let carFrame = objLoader.parse(carFramePath);
            carGroup.add(carFrame);
        });
        mtlLoader.load('car/VazGlass.mtl', (materials) => {
            materials.preload();
            let carGlass = objLoader.parse(carGlassPath);
            carGroup.add(carGlass);
            scene.add(carGroup);
        });
    };
    loadCarModel('./car/Vazz.obj', './car/VazGlass.obj');
    carGroup.scale.set(0.2, 0.2, 0.2);
    carGroup.rotateY(Math.PI / 2);
    const synth = new Tone.PolySynth().toDestination();
    fetch("./midi_data.json")
        .then((response) => response.json())
        .then((midiData) => {
        const textureBuilding = new THREE.TextureLoader().load('./images/building.jpeg');
        generateCubes(scene, midiData, textureBuilding);
        playMidi(midiData, synth);
    });
    const sampler = new Tone.Sampler({
        D5: './SoundSamples/MYSTRO_sample_pack_MYSTRO_tonal_MYSTRO_100_melody_loop_afro_vijor_Dmin.wav',
    }, {
        onload: () => console.log('Samples loaded'),
    }).toDestination();
    const sampler2 = new Tone.Sampler({
        B5: './SoundSamples/Origin_Sound_-_she_-_rnb_love_songs_loops_music_loops_chords_OS_SHE_120_synth_chords_gated_Bm.wav',
    }, {
        onload: () => console.log('Samples loaded'),
    }).toDestination();
    const drums = new Tone.Sampler({
        "G#-1": './SoundSamples/Drums/Kick.wav',
        "C-1": './SoundSamples/Drums/Hihat.wav',
        "E-1": './SoundSamples/Drums/snare.wav',
        C0: './SoundSamples/Drums/Hihat2.wav'
    }, {
        onload: () => console.log('Samples loaded'),
    }).toDestination();
    function midiNumberToNoteName(midiNumber) {
        const octave = Math.floor(midiNumber / 12) - 1;
        const noteNames = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B'];
        const noteName = noteNames[midiNumber % 12];
        return noteName + octave;
    }
    const playingNotes = new Set();
    const playingDrums = new Set();
    return {
        scene,
        carGroup,
        synth,
        sampler,
        sampler2,
        drums,
        playingNotes,
        playingDrums,
        midiNumberToNoteName
    };
}
//# sourceMappingURL=scene4.js.map