import { cm1, geo, mat, sounds } from "./common";
import { Mesh } from "three";
import { Stuff } from "./Stuff";

export class Glass extends Stuff {
  constructor(info) {
    super(info);

    this.type = info.type;
    this.step = info.step;

    this.geometry = geo.glass;
    switch (this.type) {
      case "normal":
        this.material = mat.glass1;
        this.mass = 1;
        break;
      case "strong":
        this.material = mat.glass2;
        this.mass = 0;
        break;
    }

    this.width = this.geometry.parameters.width;
    this.height = this.geometry.parameters.height;
    this.depth = this.geometry.parameters.depth;

    this.mesh = new Mesh(this.geometry, this.material);
    this.mesh.position.set(this.x, this.y, this.z);
    this.mesh.castShadow = true;
    this.mesh.receiveShadow = true;
    this.mesh.name = this.name;
    this.mesh.step = this.step;
    this.mesh.type = this.type;
    cm1.scene.add(this.mesh);

    this.setCannonBody();

    this.cannonBody.addEventListener("collide", playSound);

    const sound = sounds[this.type];
    function playSound(e) {
      const strength = e.contact.getImpactVelocityAlongNormal();
      //맨 처음 세팅시에도 playsound가 실행됨 (설치도 떨어지는거니까..)
      if (strength > 5) {
        sound.currentTime = 0;
        sound.play();
        console.log(strength);
      }
    }
  }
}
