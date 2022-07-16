import { Scene, BoxGeometry, SphereGeometry, MeshPhongMaterial } from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

import { World, Material } from "cannon-es";

//object 담기 용
export const cm1 = {
  scene: new Scene(),
  gltfLoader: new GLTFLoader(),
  mixer: undefined,

  // cannon
  world: new World(),
  defaultMaterial: new Material("default"),
  glassMaterial: new Material("glass"),
  playerMaterial: new Material("player"),
};

//상태 저장 용
export const cm2 = {
  step: 0,
  backgroundColor: "#3e1322",
  lightColor: "#ffe9ac",
  lightOffColor: "#222",
  floorColor: "#111",
  pillarColor: "#071d28",
  barColor: "#441c1d",
  glassColor: "#9fdfff",
};

export const geo = {
  floor: new BoxGeometry(200, 1, 200),
  pillar: new BoxGeometry(5, 10, 5),
  bar: new BoxGeometry(0.1, 0.3, 1.2 * 21),
  sideLight: new SphereGeometry(0.1, 6, 6),
  glass: new BoxGeometry(1.2, 0.05, 1.2),
};

export const mat = {
  floor: new MeshPhongMaterial({ color: cm2.floorColor }),
  pillar: new MeshPhongMaterial({ color: cm2.pillarColor }),
  bar: new MeshPhongMaterial({ color: cm2.barColor }),
  sideLight: new MeshPhongMaterial({ color: cm2.lightColor }),
  glass1: new MeshPhongMaterial({
    color: cm2.glassColor,
    //투명 설정
    transparent: true,
    opacity: 0.1,
  }),
  glass2: new MeshPhongMaterial({
    color: cm2.glassColor,
    transparent: true,
    opacity: 0.2,
  }),
};

const normalSound = new Audio();
normalSound.src = "/sounds/crash.mp3";
const strongSound = new Audio();
strongSound.src = "/sounds/landing.mp3";
export const sounds = {
  normal: normalSound,
  strong: strongSound,
};
