import {Group, Mesh, MeshBasicMaterial, PlaneBufferGeometry} from "three";

export default class Terrain extends Group {
	constructor(S) {
		super()

		this.nodes = []
		this.ground = new Mesh(new PlaneBufferGeometry(S, S), new MeshBasicMaterial({color: 'blue'}))
		this.ground.rotateX(- Math.PI / 2)
		this.add(this.ground)
	}

	addNode(n) {
		this.nodes.push(n)
		this.add(n)
	}

	update() {

	}

	dispose() {
		// this.ground.geometry.dispose()
		// this.ground.material.dispose()

		for (let i = 0; i < this.children; i++) {
			this.remove(this.children[i])
		}
	}
}