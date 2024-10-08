import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// ----- 주제: OrbitControls

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

  //controls
  const controls = new OrbitControls(camera, renderer.domElement);

  //컨트롤 이동 부드럽게
  //   controls.enableDamping = true;

  //줌 설정
  //   controls.enableZoom = false;

  //최대거리, 최소거리
  //   controls.minDistance = 5;
  //   controls.maxDistance = 10;

  //수직방향 회전각도
  //   controls.minPolarAngle = Math.PI / 4; //45도
  //   controls.maxPolarAngle = Math.PI / 2; //45도

  //회전 중심축 타겟
  //   controls.target.set(2, 2, 2);

  controls.autoRotate = true;

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  const geometry = new THREE.BoxGeometry(1, 1, 1);

  //위치 랜덤
  let mesh;
  let material;
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

    scene.add(mesh);
  }

  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);

    controls.update();

    renderer.render(scene, camera);
  }

  window.addEventListener("resize", setSize);

  draw();
}
