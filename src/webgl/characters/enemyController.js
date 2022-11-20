import {CharacterController} from "./characterController";
import {Vector3} from "three";

export class EnemyController extends CharacterController{
    constructor(character, ground, target) {
        super(character, ground)
        this.speed = 20
        this.target = target

        this.pointToReach = null
        this.distance = 0
    }

    update(delta, controls) {
        super.update(delta, controls);
        if (!this.pointToReach || this.distance < 2) {
            this.pointToReach = this.character.getNextPosition()
        }
        const dif = new Vector3().subVectors(this.pointToReach, this.character.mesh.position)
        this.distance = dif.length()

        this.movement.splice(0, this.movement.length)
        if(dif.x < 0) {
            this.movement.push('Left')
        } else if(dif.x > 0) {
            this.movement.push('Right')
        }
        if(dif.z < 0) {
            this.movement.push("Forward")
        } else if (dif.z > 0 ) {
            this.movement.push("Backward")
        }
        if(dif.y > 0) {
            this.movement.push("Up")
        }

        this.character.update()
    }
}