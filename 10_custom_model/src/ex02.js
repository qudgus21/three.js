import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

// ----- 주제: glb 파일 불러오기

export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  const controls = new OrbitControls(camera, renderer.domElement);
  //mixer
  let mixer;
  const loader = new GLTFLoader();
  loader.load("/models/character.glb", (gltf) => {
    const characterMesh = gltf.scene.children[0];

    characterMesh.rotation.y = THREE.MathUtils.degToRad(180);
    scene.add(characterMesh);

    //mixer
    mixer = new THREE.AnimationMixer(characterMesh);
    const actions = [];
    actions[0] = mixer.clipAction(gltf.animations[1]); //default
    actions[1] = mixer.clipAction(gltf.animations[2]); //jump
    // actions[0].repetitions = 1; //반복 횟수
    actions[0].clampWhenFinished = true; //끝난 상태에서 가만히, 부자연스럽게 뚝 끊기지 않음
    actions[0].play();
  });

  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    //update mixer
    if (mixer) {
      mixer.update(delta);
    }

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", setSize);

  draw();
}
