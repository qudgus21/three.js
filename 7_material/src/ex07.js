import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function example() {
  //로딩 매니저 생성
  const loadingManager = new THREE.LoadingManager();
  loadingManager.onStart = () => {
    console.log("로드 시작");
  };

  loadingManager.onProgress = (img) => {
    console.log(img + "로드");
  };

  loadingManager.onLoad = () => {
    console.log("로드 완료");
  };

  loadingManager.onError = () => {
    console.log("에러");
  };

  //넣어주기
  const textureLoader = new THREE.TextureLoader(loadingManager);

  const texture1 = textureLoader.load(
    "./textures/bricks/Brick_Wall_019_basecolor.jpg"
  );
  const texture2 = textureLoader.load(
    "./textures/bricks/Brick_Wall_019_height.png"
  );
  const texture3 = textureLoader.load(
    "./textures/bricks/Brick_Wall_019_normal.jpg"
  );
  const texture4 = textureLoader.load(
    "./textures/bricks/Brick_Wall_019_roughness.jpg"
  );
  const texture5 = textureLoader.load("/textures/bricks/Material_1631.jpg");

  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);

  const scene = new THREE.Scene();
  scene.background = new THREE.Color("white");

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
  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.set(1, 1, 2);
  scene.add(ambientLight, directionalLight);

  const controls = new OrbitControls(camera, renderer.domElement);

  const geometry = new THREE.BoxGeometry(2, 2, 2);
  const material = new THREE.MeshBasicMaterial({
    map: texture1,
  });
  const mesh = new THREE.Mesh(geometry, material);
  scene.add(mesh);

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
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", setSize);

  draw();
}
