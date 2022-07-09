import * as THREE from "three";
import { DragControls } from "three/examples/jsm/controls/DragControls";

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

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  let mesh;
  let material;
  let meshes = [];
  for (let i = 0; i < 20; i++) {
    material = new THREE.MeshStandardMaterial({
      color: `rgb(
				${50 + Math.floor(Math.random() * 205)},
			 	${50 + Math.floor(Math.random() * 205)},
			 	${50 + Math.floor(Math.random() * 205)}
			)`,
    });
    mesh = new THREE.Mesh(geometry, material);
    mesh.position.set(
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5,
      (Math.random() - 0.5) * 5
    );
    meshes.push(mesh);
    //name설정
    mesh.name = `box-${i}`;
    scene.add(mesh);
  }

  //DragControl, mesh필요 (이걸 게시물 등으로 사용..)
  const controls = new DragControls(meshes, camera, renderer.domElement);

  controls.addEventListener("dragstart", (e) => {
    console.log(e.object.name);
  });

  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    // controls.update(delta);

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
