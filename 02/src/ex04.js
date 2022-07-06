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

  //빛 생성, 빛의 위치 변경, 두번쨰 인자는 빛의 세기
  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.z = 5;
  light.position.x = 2;

  //빛도 여러개 만들어서 넣을수 있음, 성능상의 문제가 생길수도..?
  scene.add(light);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.z = 5;
  camera.position.y = 2;
  camera.position.x = 2;

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  //이 material은 빛의 영향을 안받음
  // const material = new THREE.MeshBasicMaterial({
  //   color: "#ff0000",
  // });

  //빛에 따라
  const material = new THREE.MeshStandardMaterial({
    color: "red",
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
