import * as THREE from "three";
import { Vector2 } from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { PreventDragClick } from "./preventDragClick";

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
  camera.position.x = 2;
  camera.position.y = 1.5;
  camera.position.z = 4;
  scene.add(camera);

  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  scene.add(directionalLight);

  //가운데 맞추기
  const controls = new OrbitControls(camera, renderer.domElement);

  //맞을 놈들을 만들어보자

  const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
  const boxMaterial = new THREE.MeshStandardMaterial({ color: "plum" });
  const boxMesh = new THREE.Mesh(boxGeometry, boxMaterial);
  boxMesh.name = "box";

  //반지름 ,두께, 세그먼트
  const torusGeometry = new THREE.TorusGeometry(2, 0.5, 16, 100);
  const torusMaterial = new THREE.MeshStandardMaterial({ color: "lime" });
  const torusMesh = new THREE.Mesh(torusGeometry, torusMaterial);
  torusMesh.name = "torus";

  scene.add(boxMesh, torusMesh);

  const meshes = [boxMesh, torusMesh];

  const clock = new THREE.Clock();

  const raycaster = new THREE.Raycaster();

  //마우스
  const mouse = new THREE.Vector2();

  console.log(mouse);

  function draw() {
    const time = clock.getElapsedTime();

    boxMesh.position.y = Math.sin(time) * 2;
    torusMesh.position.y = Math.sin(time) * 2;
    // boxMesh.material.color.set("plum");
    // torusMesh.material.color.set("lime");

    renderer.render(scene, camera);
    renderer.setAnimationLoop(draw);
  }

  //함수 생성
  function checkIntersects() {
    if (preventDragClick.mouseMoved) return;
    //origin이 카메라라고 생각...카메라 시점에서 광선을 쏘았다고 가정
    //마우스 클릭한 지점으로 광선을 쏜다
    raycaster.setFromCamera(mouse, camera);
    const intersects = raycaster.intersectObjects(meshes);

    for (const item of intersects) {
      console.log(item.object.name);
      item.object.material.color.set("red");
      //한개만 체크하기 위해서
      break;
    }

    //또는
    // console.log(intersects[0].object.name);
  }

  function setSize() {
    camera.aspect = window.innerWidth / window.innerHeight;
    camera.updateProjectionMatrix();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.render(scene, camera);
  }

  window.addEventListener("resize", setSize);

  //이벤트 생성
  canvas.addEventListener("click", (e) => {
    //범위 -1~1 만들기
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);
    // console.log(mouse);
    checkIntersects();
  });

  //드래그한 클릭은 포함안하게함
  let preventDragClick = new PreventDragClick(canvas);

  draw();
}
