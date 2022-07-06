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

  //안개만들기 => 입체감 살림
  scene.fog = new THREE.Fog("black", 1, 10);

  const light = new THREE.DirectionalLight(0xffffff, 1);
  light.position.z = 10;
  light.position.x = 1;
  light.position.y = 4;

  scene.add(light);

  const camera = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  camera.position.y = 1;
  camera.position.z = 6;

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  const material = new THREE.MeshStandardMaterial({
    color: "red",
  });

  //10개 만들기
  const meshes = [];
  let mesh;
  for (let i = 0; i < 10; i++) {
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.x = Math.random() * 5 - 2.5;
    mesh.position.z = Math.random() * 5 - 2.5;
    scene.add(mesh);
    meshes.push(mesh);
  }

  renderer.render(scene, camera);

  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    meshes.forEach((item) => {
      item.rotation.y += 1.5 * delta;
    });

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
