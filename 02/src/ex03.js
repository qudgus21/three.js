import * as THREE from "three";

export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias: true,
    alpha: true, //배경 깜장색 아니게
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   renderer.setClearColor("#00ff00"); //background color 설정
  //   renderer.setClearAlpha(0.5); //background opacity 설정

  const scene = new THREE.Scene();

  //scene에 background 넣으면 renderer무시됨
  scene.background = new THREE.Color("#00ff00");

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 5;
  camera.position.y = 1;
  camera.position.x = 1;

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshBasicMaterial({
    color: "#ff0000",
  });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  renderer.render(scene, camera);

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", setSize);
}
