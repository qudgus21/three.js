import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
  camera.position.z = 15;
  scene.add(camera);

  const controls = new OrbitControls(camera, renderer.domElement);

  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  const geometry = new THREE.SphereGeometry(5, 64, 64);
  const material = new THREE.MeshStandardMaterial({
    color: "orangered",
    side: THREE.DoubleSide,
    //울퉁불퉁하게 선표시 (세그먼트 라인 표시)
    flatShading: true,
  });

  //세그먼트의 x,y,z 좌표들이 한 배열에 들어가 있음
  const positionArray = geometry.attributes.position.array;

  const randomArray = [];
  for (let i = 0; i < positionArray.length; i += 3) {
    positionArray[i] = positionArray[i] + (Math.random() - 0.5) * 0.2;
    positionArray[i + 1] = positionArray[i + 1] + (Math.random() - 0.5) * 0.2;
    positionArray[i + 2] = positionArray[i + 2] + (Math.random() - 0.5) * 0.2;

    randomArray[i] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 1] = (Math.random() - 0.5) * 0.2;
    randomArray[i + 2] = (Math.random() - 0.5) * 0.2;
  }

  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

  scene.add(mesh);

  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();
    const elapsed = clock.getElapsedTime() * 3;

    //position업데이트
    for (let i = 0; i < positionArray.length; i += 3) {
      positionArray[i] += Math.sin(elapsed + randomArray[i] * 200) * 0.002;
      positionArray[i + 1] += Math.sin(elapsed + randomArray[i] * 200) * 0.002;
      positionArray[i + 2] += Math.sin(elapsed + randomArray[i] * 200) * 0.002;
    }

    geometry.attributes.position.needsUpdate = true;

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
