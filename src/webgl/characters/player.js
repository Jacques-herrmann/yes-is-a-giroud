import {MeshBasicMaterial} from "three";
import Loader from "@/webgl/utils/loader";
import {Character} from "./character";

export class Player extends Character{
    constructor() {
        super(Loader.items.player.scene.children[0])
        this.isPlayer = true
        this.life = 100
        this.strength = 100

        this.mesh.material = new MeshBasicMaterial({color: 'green'})
        this.mesh.geometry.translate(0, -0.5, 0)
        this.mesh.position.set(5, 5.5, 5)
    }

    reset() {
        this.life = 100
        this.strength = 100
        this.mesh.position.set(5, 5.5, 5)
    }
}