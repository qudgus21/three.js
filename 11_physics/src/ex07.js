import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import * as CANNON from "cannon-es";
import { PreventDragClick } from "./PreventDragClick";
import { Domino } from "./Domino";

export default function example() {
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGLRenderer({
    canvas,
    antialias: true,
  });
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setPixelRatio(window.devicePixelRatio > 1 ? 2 : 1);
  renderer.shadowMap.enabled = true;
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

  const ambientLight = new THREE.AmbientLight("white", 0.5);
  scene.add(ambientLight);

  const directionalLight = new THREE.DirectionalLight("white", 1);
  directionalLight.position.x = 1;
  directionalLight.position.z = 2;
  directionalLight.castShadow = true;
  scene.add(directionalLight);

  const controls = new OrbitControls(camera, renderer.domElement);

  const gltfLoader = new GLTFLoader();

  const cannonWorld = new CANNON.World();
  cannonWorld.gravity.set(0, -10, 0);

  cannonWorld.broadphase = new CANNON.SAPBroadphase(cannonWorld);

  const defaultMaterial = new CANNON.Material("default");
  const defaultContactMaterial = new CANNON.ContactMaterial(
    defaultMaterial,
    defaultMaterial,
    {
      friction: 0.005, //마찰
      restitution: 0.9, //반발
    }
  );
  cannonWorld.defaultContactMaterial = defaultContactMaterial;

  const floorShape = new CANNON.Plane();
  const floorBody = new CANNON.Body({
    mass: 0,
    position: new CANNON.Vec3(0, 0, 0),
    shape: floorShape,
    material: defaultMaterial,
  });
  floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI / 2);
  cannonWorld.addBody(floorBody);

  const floorMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(100, 100),
    new THREE.MeshStandardMaterial({
      color: "slategray",
    })
  );
  floorMesh.rotation.x = -Math.PI / 2;
  floorMesh.receiveShadow = true;
  scene.add(floorMesh);

  //도미노 생성
  const dominos = [];
  let domino;
  for (let i = -3; i < 17; i++) {
    domino = new Domino({
      index: i,
      scene,
      cannonWorld,
      gltfLoader,
      //z좌표만 달라지게
      z: -i * 0.8,
    });
    dominos.push(domino);
  }

  const clock = new THREE.Clock();

  function draw() {
    const delta = clock.getDelta();

    cannonWorld.step(1 / 60, delta, 3);

    dominos.forEach((item) => {
      if (item.cannonBody) {
        //로드가 되지 않으면 실행하지 않음
        item.modelMesh.position.copy(item.cannonBody.position);
        item.modelMesh.quaternion.copy(item.cannonBody.quaternion);
      }
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

  //raycaster
  const raycaster = new THREE.Raycaster();
  const mouse = new THREE.Vector2();

  function checkIntersects() {
    raycaster.setFromCamera(mouse, camera);

    const intersects = raycaster.intersectObjects(scene.children);

    //맨 처음 광선 맞은 녀석
    console.log(intersects[0].object.name);

    for (const item of intersects) {
      if (item.object.cannonBody) {
        //외부 클릭하면 처리 안되게 끔
        item.object.cannonBody.applyForce(
          new CANNON.Vec3(0, 0, -50), //z방향으로 -50만큼 밈
          new CANNON.Vec3(0, 0, 0)
        );
        //광선이 맞은 처음 것만 밀기 위해 break
        break;
      }
    }

    // if (intersects[0].object.cannonBody) {
    // 	intersects[0].object.cannonBody.applyForce(
    // 		new CANNON.Vec3(0, 0, -100),
    // 		new CANNON.Vec3(0, 0, 0)
    // 	);
    // }
  }

  window.addEventListener("resize", setSize);
  canvas.addEventListener("click", (e) => {
    if (preventDragClick.mouseMoved) return;

    //e.clientX / canvas.clientWidth 중간클릭하면 0.5
    //mouse.x,mouse.y : -1~1정규화
    mouse.x = (e.clientX / canvas.clientWidth) * 2 - 1;
    mouse.y = -((e.clientY / canvas.clientHeight) * 2 - 1);

    checkIntersects();
  });

  const preventDragClick = new PreventDragClick(canvas);

  draw();
}
