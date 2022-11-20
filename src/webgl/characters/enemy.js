// Dijkstra Map Algorythm
// https://www.youtube.com/watch?v=2ExLEY32RgM&t=1141s
// http://roguebasin.com/index.php/The_Incredible_Power_of_Dijkstra_Maps

import {BufferGeometry, CatmullRomCurve3, Line, LineBasicMaterial, MeshBasicMaterial, Vector3} from "three";
import Loader from "@/webgl/utils/loader";
import {Character} from "./character";

export class Enemy extends Character{
    constructor(strength) {
        super(Loader.items.enemy.scene.children[0])
        this.life = 100
        this.strength = strength

        this.mesh.material = new MeshBasicMaterial({color: 'red'})
        this.mesh.geometry.translate(0, -0.5, 0)
        this.mesh.position.set(35, 5.5, 35)

        this.path = new CatmullRomCurve3([new Vector3(), new Vector3()])
        this.indexOnCurve = 0
        this.helper = new Line(
            new BufferGeometry().setFromPoints(this.path.getPoints(50)),
            new LineBasicMaterial({ color: 'red'})
        )
        this.add(this.helper)
        this.update()
    }

    updateFollowPath(tiles) {
        if(tiles.length > 1) {
            this.path = new CatmullRomCurve3([...tiles.map(t => new Vector3(t.x, this.mesh.position.y / 2, t.z).multiplyScalar(2))])
            const points = this.path.getPoints(50)
            this.helper.geometry.setFromPoints(points)

            // Find the closest point on curve and get its index
            // TODO Use find global minima of a function distanceTo(x)
            let d = Infinity
            this.indexOnCurve = 0
            points.forEach((p, i) => {
                const newDistance = p.distanceTo(this.mesh.position)
                if(newDistance < d) {
                    d = newDistance
                    this.indexOnCurve = i/points.length
                }
            })
        }
    }

    getNextPosition() {
        const nextPoint = this.path.getPointAt(this.indexOnCurve)

        this.indexOnCurve += 0.1
        return nextPoint
    }

    update() {
        super.update()
        
    }
}