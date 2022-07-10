import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";

export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  renderer.shadowMap.enabled = true;

  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

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

  const controls = new OrbitControls(camera, renderer.domElement);

  const geometry1 = new THREE.BoxGeometry(1, 1, 1);
  const geometry2 = new THREE.PlaneGeometry(10, 10);
  const geometry3 = new THREE.SphereGeometry(0.7, 16, 16);

  const material1 = new THREE.MeshStandardMaterial({
    color: "gold",
  });

  const material2 = new THREE.MeshStandardMaterial({
    color: "white",
  });

  const material3 = new THREE.MeshStandardMaterial({
    color: "royalblue",
  });

  const mesh1 = new THREE.Mesh(geometry1, material1); //영향을 줌
  const mesh2 = new THREE.Mesh(geometry2, material2); //영향을 받음 (발판)
  const mesh3 = new THREE.Mesh(geometry3, material3); //영향을 줌

  mesh2.receiveShadow = true;
  mesh1.castShadow = true;
  mesh3.castShadow = true;

  mesh1.position.set(1, 1, 0);
  mesh2.rotation.x -= THREE.MathUtils.degToRad(90);
  mesh3.position.set(-1, 1, 0);

  scene.add(mesh1, mesh2, mesh3);

  const ambientLight = new THREE.AmbientLight("white", 0.3);

  //spotlight 한지점에서 퍼지는
  const light = new THREE.SpotLight("tomato", 1, 100, Math.PI / 6);
  light.position.y = 3;
  scene.add(light);

  light.castShadow = true;
  light.shadow.mapSize.width = 1024;
  light.shadow.mapSize.height = 1024;
  light.shadow.radius = 5;
  light.shadow.camera.near = 1;
  light.shadow.camera.far = 10;

  scene.add(ambientLight);

  const lightHelper = new THREE.SpotLightHelper(light);
  scene.add(lightHelper);

  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  const gui = new dat.GUI();
  gui.add(light.position, "x", -5, 5, 0.1).name("빛 X");
  gui.add(light.position, "y", -5, 5, 0.1).name("빛 Y");
  gui.add(light.position, "z", 2, 10, 0.1).name("빛 Z");

  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

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
