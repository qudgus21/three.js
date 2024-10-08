import { Scene, PerspectiveCamera, Color } from "three";

export class CreateScene {
  constructor(info) {
    this.renderer = info.renderer;
    this.elem = document.querySelector(info.placeholder);
    const rect = this.elem.getBoundingClientRect();

    const bgColor = info.bgColor || "white";
    const fov = info.fov || 75;
    const aspect = rect.width / rect.height; //css에서 정해진대로
    const near = info.near || 0.1;
    const far = info.far || 100;
    const cameraPosition = info.cameraPosition || { x: 0, y: 0, z: 3 };

    // scene
    this.scene = new Scene();
    this.scene.background = new Color(bgColor);

    // camera
    this.camera = new PerspectiveCamera(fov, aspect, near, far);
    this.camera.position.x = cameraPosition.x;
    this.camera.position.y = cameraPosition.y;
    this.camera.position.z = cameraPosition.z;

    this.scene.add(this.camera);

    this.meshes = [];
  }

  set(func) {
    func();
  }

  render() {
    const renderer = this.renderer;
    const rect = this.elem.getBoundingClientRect(); //위치,크기 가져오기

    // 영역이 화면에 안보인다면 함수 종료
    if (
      rect.top > renderer.domElement.clientHeight ||
      rect.bottom < 0 ||
      rect.left > renderer.domElement.clientWidth ||
      rect.right < 0
    ) {
      return;
    }

    this.camera.aspect = rect.width / rect.height;
    this.camera.updateProjectionMatrix();

    const canvasBottom = renderer.domElement.clientHeight - rect.bottom;
    renderer.setScissor(rect.left, canvasBottom, rect.width, rect.height);
    renderer.setViewport(rect.left, canvasBottom, rect.width, rect.height);
    renderer.setScissorTest(true);

    renderer.render(this.scene, this.camera);
  }
}
