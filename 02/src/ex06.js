import * as THREE from "three";

export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias: true,
  });

  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);

  const scene = new THREE.Scene();

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.z = 5;
  light.position.x = 2;

  scene.add(light);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 5;

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshStandardMaterial({
    color: "red",
  });

  const mesh = new THREE.Mesh(geometry, material);

  scene.add(mesh);

  const clock = new THREE.Clock();

  function draw() {
    // 절대 경과 시간이 아닌, draw함수의 실행 시간 간격 (elapsed랑 같이 쓰면 안됨)
    const delta = clock.getDelta();

    mesh.rotation.y += 1.5 * delta; //이렇게 하면 시간에 비례해서 올라감, 성능에 관계없이 원하는 만큼 회전 재귀함수가 실행되는 빈도는 성능에 따라 차이가 나겠지만

    mesh.position.y = mesh.position.y > 3 ? 0 : mesh.position.y + delta;

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
