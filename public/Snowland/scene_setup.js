import { AxesHelper, BufferAttribute, Light, Mesh, MeshStandardMaterial, ObjectLoader, PositionalAudio } from 'three';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader';
import { MTLLoader } from 'three/examples/jsm/loaders/MTLLoader';
import { objectFlip } from '../lib/utils';
import * as utils from '../lib/utils';
import dat from 'dat.gui';
import * as TWEEN from '@tweenjs/tween.js';
import OpenAI from 'openai';
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 2000);
camera.position.z = 100;
camera.position.y = 20;
//# sourceMappingURL=scene_setup.js.map