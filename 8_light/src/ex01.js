import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import dat from "dat.gui";
import { Light } from "three";

export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  //렌더러에서 그림자 표현할 수 있도록
  renderer.shadowMap.enabled = true;

  //타입지정 - 기본값
  //   renderer.shadowMap.type = THREE.PCFShadowMap;

  //타입지정 - 픽셀처럼..
  //   renderer.shadowMap.type = THREE.BasicShadowMap;

  //타입지정 - 기본값과 유사하지만 조금 더 부드럽게
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

  //geo
  const geometry1 = new THREE.BoxGeometry(1, 1, 1);
  const geometry2 = new THREE.PlaneGeometry(10, 10);
  const geometry3 = new THREE.SphereGeometry(0.7, 16, 16);

  //mat
  const material1 = new THREE.MeshStandardMaterial({
    color: "gold",
  });

  const material2 = new THREE.MeshStandardMaterial({
    color: "white",
  });

  const material3 = new THREE.MeshStandardMaterial({
    color: "royalblue",
  });

  //mesh
  const mesh1 = new THREE.Mesh(geometry1, material1); //영향을 줌
  const mesh2 = new THREE.Mesh(geometry2, material2); //영향을 받음 (발판)
  const mesh3 = new THREE.Mesh(geometry3, material3); //영향을 줌

  //mesh에 shadow 설정 (cast: 영향을 줌 , receive: 영향을 받음)
  mesh2.receiveShadow = true;
  mesh1.castShadow = true;
  mesh3.castShadow = true;

  mesh1.position.set(1, 1, 0);
  mesh2.rotation.x -= THREE.MathUtils.degToRad(90);
  mesh3.position.set(-1, 1, 0);

  scene.add(mesh1, mesh2, mesh3);

  //light - 전체 빛
  const ambientLight = new THREE.AmbientLight("white", 0.3);

  //태양같은 빛 - 방향가지고 쏨
  const directionalLight = new THREE.DirectionalLight("tomato", 1);
  directionalLight.position.y = 3;
  scene.add(directionalLight);

  //그림자를 만들 수 있는 빛이 되도록
  directionalLight.castShadow = true;
  //그림자 퀄리티
  directionalLight.shadow.mapSize.width = 1024;
  directionalLight.shadow.mapSize.height = 1024;
  //그림자 퍼지게 - pcfsoft일때는 적용안됨
  directionalLight.shadow.radius = 5;
  //그림자가 보이는 범위
  directionalLight.shadow.camera.near = 1;
  directionalLight.shadow.camera.far = 10;

  scene.add(ambientLight);

  //빛 위치 보이게 헬퍼 넣기
  const lightHelper = new THREE.DirectionalLightHelper(directionalLight);
  scene.add(lightHelper);

  const axesHelper = new THREE.AxesHelper(3);
  scene.add(axesHelper);

  //빛 위치 gui 헬퍼
  const gui = new dat.GUI();
  gui.add(directionalLight.position, "x", -5, 5, 0.1).name("빛 X");
  gui.add(directionalLight.position, "y", -5, 5, 0.1).name("빛 Y");
  gui.add(directionalLight.position, "z", 2, 10, 0.1).name("빛 Z");

  const clock = new THREE.Clock();

  function draw() {
    const time = clock.getElapsedTime();

    //원운동 시키기
    directionalLight.position.x = Math.cos(time) * 5; //cos: x좌표
    directionalLight.position.z = Math.sin(time) * 5; //sin: z좌표

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
