import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

export default function example() {
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

  const textureLoader = new THREE.TextureLoader(loadingManager);

  const textureRight = textureLoader.load("./textures/mcstyle/right.png");
  const textureLeft = textureLoader.load("./textures/mcstyle/left.png");
  const textureTop = textureLoader.load("./textures/mcstyle/top.png");
  const textureBottom = textureLoader.load("./textures/mcstyle/bottom.png");
  const textureFront = textureLoader.load("./textures/mcstyle/front.png");
  const textureBack = textureLoader.load("./textures/mcstyle/back.png");

  //배열
  const materials = [
    new THREE.MeshBasicMaterial({ map: textureRight }),
    new THREE.MeshBasicMaterial({ map: textureLeft }),
    new THREE.MeshBasicMaterial({ map: textureTop }),
    new THREE.MeshBasicMaterial({ map: textureBottom }),
    new THREE.MeshBasicMaterial({ map: textureFront }),
    new THREE.MeshBasicMaterial({ map: textureBack }),
  ];

  //픽셀 살려서 보이게끔
  textureRight.magFilter = THREE.NearestFilter;
  textureLeft.magFilter = THREE.NearestFilter;
  textureTop.magFilter = THREE.NearestFilter;
  textureBottom.magFilter = THREE.NearestFilter;
  textureFront.magFilter = THREE.NearestFilter;
  textureBack.magFilter = THREE.NearestFilter;

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

  //배열을 넣음
  const mesh = new THREE.Mesh(geometry, materials);
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
