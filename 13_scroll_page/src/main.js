import * as THREE from "three";
import { House } from "./House";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import gsap from "gsap";

// Renderer
const canvas = document.querySelector("#three-canvas");
const renderer = new THREE.WebGLRenderer({
  canvas,
  antialias: true,
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
// Scene
const scene = new THREE.Scene();
scene.background = new THREE.Color("white");

// Camera
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

//mesh 위치에 맞춤
camera.position.set(-5, 2, 25);
scene.add(camera);

// Light
const ambientLight = new THREE.AmbientLight("white", 0.5);
scene.add(ambientLight);

//spotLight 세팅
const spotLight = new THREE.SpotLight("white", 0.7);
spotLight.position.set(0, 150, 100);
spotLight.castShadow = true;
spotLight.shadow.mapSize.width = 1024; //그림자의 퀄리티 조정을 위해 (기본값 512)
spotLight.shadow.mapSize.height = 1024;
spotLight.shadow.camera.near = 1;
spotLight.shadow.camera.far = 200;
scene.add(spotLight);

const gltfLoader = new GLTFLoader();

// Mesh
const floorMesh = new THREE.Mesh(
  new THREE.PlaneGeometry(100, 100),
  new THREE.MeshStandardMaterial({ color: "white" })
);
floorMesh.rotation.x = -Math.PI / 2; //x축으로 돌리기
floorMesh.receiveShadow = true;
scene.add(floorMesh);

//house 배열 만들기
const houses = [];
houses.push(
  new House({
    gltfLoader,
    scene,
    modelSrc: "/models/house.glb",
    x: -5,
    z: 20,
    height: 2,
  })
);
houses.push(
  new House({
    gltfLoader,
    scene,
    modelSrc: "/models/house.glb",
    x: 7,
    z: 10,
    height: 2,
  })
);
houses.push(
  new House({
    gltfLoader,
    scene,
    modelSrc: "/models/house.glb",
    x: -10,
    z: 0,
    height: 2,
  })
);
houses.push(
  new House({
    gltfLoader,
    scene,
    modelSrc: "/models/house.glb",
    x: 10,
    z: -10,
    height: 2,
  })
);
houses.push(
  new House({
    gltfLoader,
    scene,
    modelSrc: "/models/house.glb",
    x: -5,
    z: -20,
    height: 2,
  })
);

// 그리기
const clock = new THREE.Clock();

function draw() {
  const delta = clock.getDelta();

  renderer.render(scene, camera);
  renderer.setAnimationLoop(draw);
}

let currentSection = 0;
function setSection() {
  // window.pageYOffset
  const newSection = Math.round(window.scrollY / window.innerHeight);
  //   console.log(window.scrollY, window.innerHeight);

  if (currentSection !== newSection) {
    console.log("animation!!");
    gsap.to(camera.position, {
      duration: 1,
      x: houses[newSection].x,
      z: houses[newSection].z + 5,
    });
    currentSection = newSection;
  }
}

function setSize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.render(scene, camera);
}

// 이벤트
window.addEventListener("scroll", setSection);
window.addEventListener("resize", setSize);

draw();
