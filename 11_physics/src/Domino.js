import { Mesh, BoxGeometry, MeshBasicMaterial } from "three";

import { Body, Box, Vec3 } from "cannon-es";

export class Domino {
  constructor(info) {
    this.scene = info.scene;
    this.cannonWorld = info.cannonWorld;

    this.index = info.index;

    //도미노 크기만큼의 크기 설정
    this.width = info.width || 0.6; //x
    this.height = info.height || 1; //y
    this.depth = info.depth || 0.2; //z

    this.x = info.x || 0;
    this.y = info.y || 0.5; //높이가 1이니까 0.5가 기준점이여야 바닥(0)에 딱 붙음
    this.z = info.z || 0;

    this.rotationY = info.rotationY || 0.5;

    info.gltfLoader.load("/models/domino.glb", (glb) => {
      this.modelMesh = glb.scene.children[0];
      this.modelMesh.name = `${this.index}번 도미노`;
      this.modelMesh.castShadow = true;
      this.modelMesh.position.set(this.x, this.y, this.z);
      this.scene.add(this.modelMesh);

      this.setCannonBody();
    });
  }

  //하나의 도미노
  setCannonBody() {
    const shape = new Box(
      new Vec3(this.width / 2, this.height / 2, this.depth / 2)
    );
    this.cannonBody = new Body({
      mass: 1,
      position: new Vec3(this.x, this.y, this.z),
      shape,
    });

    this.cannonBody.quaternion.setFromAxisAngle(
      new Vec3(0, 1, 0), // y축
      this.rotationY
    );

    //mesh에 cannonbody 넣기 => 클릭 시 mesh를 통한 canonbody를 알아내기 위함
    this.modelMesh.cannonBody = this.cannonBody;

    this.cannonWorld.addBody(this.cannonBody);
  }
}
