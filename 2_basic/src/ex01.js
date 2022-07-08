import * as THREE from "three";

export default function example() {
  // <canvas> 없이
  // const renderer = new THREE.WebGLRenderer();
  // renderer.setSize(window.innerWidth, window.innerHeight);
  // document.body.appendChild(renderer.domElement);

  //renderer
  const canvas = document.querySelector("#three-canvas");
  const renderer = new THREE.WebGL1Renderer({
    canvas,
    antialias: true, //계단 현상 안보이게끔, 성능 저하가 있음
  });
  renderer.setSize(window.innerWidth, window.innerHeight);

  //scene
  const scene = new THREE.Scene();

  //camera (시야각, 종횡비, near, far),
  //x,y,z 설정을 하지않으면 camera 위치는 0 0 0
  //PerspectiveCamera: 자연스럽게 원근 처리, 멀어지면 작아짐
  const camera1 = new THREE.PerspectiveCamera(
    75,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );

  //카메라를 앞으로
  camera1.position.z = 5;
  //카메라 위로
  camera1.position.y = 2;
  //카메라를 오른쪽으로
  camera1.position.x = 1;

  //OrthographicCamera: 객체의 크기가 카메라와의 거리에 관계없이 일정, 하늘에서 내려다보는 느낌
  //camera(절두체 좌평면, 우평면, 상평면, 하평면, near, far)
  const camera2 = new THREE.OrthographicCamera(
    -(window.innerWidth / window.innerHeight),
    window.innerWidth / window.innerHeight,
    1,
    -1,
    0.1,
    1000
  );

  camera2.position.z = 5;
  camera2.position.y = 2;
  camera2.position.x = 1;

  //카메라가 바라보는 좌표, 원점으로 설정
  camera2.lookAt(0, 0, 0);
  //줌 아웃
  camera2.zoom = 0.5;
  //변경된 속성 적용(zoom)
  camera2.updateProjectionMatrix();

  //scene에 카메라 올리기
  // scene.add(camera1);

  //모양, 정육면체, x,y,z 길이
  const geometry = new THREE.BoxGeometry(1, 1, 1);

  //재질
  const material = new THREE.MeshBasicMaterial({
    color: "#ff0000",
  });

  //물체
  const mesh = new THREE.Mesh(geometry, material);

  //scene에 추가
  scene.add(mesh);

  //그리기
  renderer.render(scene, camera2);
}
