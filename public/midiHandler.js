import * as Tone from 'tone';
import * as THREE from 'three';
export function generateCubes(scene, midiData, texture) {
    let currentTime = 0;
    midiData.forEach((item) => {
        item.contents.forEach((msg) => {
            currentTime += msg.time;
            if (msg.message.includes("note_on")) {
                const note = parseInt(msg.message.split("note=")[1].split(" ")[0]);
                const nextMsg = item.contents[item.contents.indexOf(msg) + 1];
                const duration = nextMsg ? nextMsg.time : 0;
                const geometry = new THREE.BoxGeometry(duration, note, 1);
                const material = new THREE.MeshStandardMaterial({ map: texture });
                const cube = new THREE.Mesh(geometry, material);
                cube.position.set(currentTime + duration / 2, note / 2, 0);
                scene.add(cube);
            }
        });
    });
}
export function playMidi(midiData, synth) {
    let currentTime = 0;
    midiData.forEach((item) => {
        item.contents.forEach((msg) => {
            currentTime += msg.time;
            if (msg.message.includes("note_on")) {
                const note = parseInt(msg.message.split("note=")[1].split(" ")[0]);
                synth.triggerAttackRelease(Tone.Midi(note).toFrequency(), "8n", `+${currentTime}`);
            }
        });
    });
}
//# sourceMappingURL=midiHandler.js.map