import {Group, Mesh, MeshBasicMaterial, SphereBufferGeometry, Vector3} from "three";

const G = new SphereBufferGeometry(0.2, 0.2)
const M = new MeshBasicMaterial({color: 'green'})

export class Bullet extends Group{
    constructor(position, direction, speed) {
        super()
        this.base = new Vector3().copy(position)
        this.position.copy(position)
        this.direction = direction.normalize()
        this.speed = speed / 100

        this.offset = new Vector3().copy(this.direction).multiplyScalar(this.speed)

        this.mesh = new Mesh(G, M)
        this.add(this.mesh)
    }

    update() {
        this.position.add(this.offset)
        if(new Vector3().subVectors(this.base, this.position).length() > 50) {
            this.remove(this.mesh)
        }
    }

}