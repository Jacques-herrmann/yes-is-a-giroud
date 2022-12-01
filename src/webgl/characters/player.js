import {Mesh, MeshBasicMaterial, SphereBufferGeometry, Vector3} from "three";
import Loader from "@/webgl/utils/loader";
import {Character} from "./character";
import {Bullet} from "@/webgl/bullet";

export class Player extends Character{
    constructor() {
        super(Loader.items.player.scene.children[0])
        this.isPlayer = true
        this.life = 100
        this.strength = 100
        this.speed = 1
        this.interval = null

        this.mesh.material = new MeshBasicMaterial({color: 'green'})
        this.mesh.geometry.translate(0, -0.5, 0)
        this.mesh.position.set(0, 5.5, 0)

        // this.dir = new Mesh(new SphereBufferGeometry(0.5), new MeshBasicMaterial({color: 'red'}))
        // this.add(this.dir)

        this.bullets = []

        this.interval = setInterval(this.shoot.bind(this), 300 / this.speed)
    }

    reset() {
        this.life = 100
        this.strength = 100
        this.mesh.position.set(5, 5.5, 5)
    }

    dispose() {
        super.dispose();
        clearInterval(this.interval)
    }

    shoot() {
        const bullet = new Bullet(this.mesh.position, this.mesh.getWorldDirection(new Vector3()), 10)

        this.bullets.push(bullet)
        this.add(bullet)
    }

    update() {
        super.update();
        // console.log(this.direction)
        this.bullets.forEach(b => b.update())
        // this.dir.position.copy(this.direction)
    }
}