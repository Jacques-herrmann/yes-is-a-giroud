import {
    Box3,
    Group,
    Line3,
    Vector3,
    Vector2,
    Box3Helper
} from "three";

const instances = []

export class Character extends Group{
    constructor(model) {
        super()
        this.name = ""
        this.velocity = new Vector3()
        this.direction = new Vector3()

        this.mesh = model.clone()

        this.collider = new Box3()
        this.mesh.updateMatrix()
        this.mesh.geometry.computeBoundingBox()
        this.position2D = new Vector2()
        this.collider.copy(this.mesh.geometry.boundingBox).applyMatrix4(this.mesh.matrix)
        this.radius = new Vector2(
            this.collider.max.x - this.collider.min.x,
            this.collider.max.z - this.collider.min.z
        ).multiplyScalar(0.5).length()

        this.segment = new Line3(
            new Vector3(0, 0, 0),
            new Vector3(0, this.collider.max.y, 0)
        )
        const helper = new Box3Helper(this.collider, 'red')
        this.add(helper)
        this.add(this.mesh)
        instances.push(this)
    }

    static get instances() {
        return instances
    }

    dispose() {
        // this.mesh.geometry.dispose()
    }

    receiveDamage(d) {
        this.life = Math.max(0, this.life - d)
        if(!this.life) {
            this.dispatchEvent({type: 'dead', instance: this})
        }
    }

    update(){
        if(Math.floor(this.position2D.x) !== Math.floor(this.mesh.position.x) ||  Math.floor(this.position2D.y) !== Math.floor(this.mesh.position.z)) {
            this.position2D.set(this.mesh.position.x, this.mesh.position.z)
            this.dispatchEvent({type: 'move'})
        }
    }
}