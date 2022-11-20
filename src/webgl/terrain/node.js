import {
	Box3,
	Group,
	Vector3,
	MeshNormalMaterial
} from 'three'
import Grid from "./grid";
import Loader from "@/webgl/utils/loader";
import {NodeType} from "./nodeType";
import {matches} from "./constraints";

export class Node extends Group {
	constructor(x, y, z, bounds) {
		super()
		this.x = x
		this.y = y
		this.z = z
		this.type = undefined
		this.onError = false

		this.box = new Box3(bounds[0], bounds[1])
		this.center = new Vector3()
		this.box.getCenter(this.center)

		this.neighbour = NodeType.instances

		// Number of full tiles under this one, a tile can be added only if all 9 tiles under it are full
		this.fullTilesUnder = 0
	}

	setNodeType(type) {
		if (!type) {
			if (this.y === 0 || this.fullTilesUnder === 9) {
				if (this.neighbour.length) {
					// Here we choose the current type
					type = NodeType.getWeightedRand(this.neighbour)
				} else {
					// Nobody should be here
					type = NodeType.getWeightedRand(NodeType.instances)
					this.onError = true
					console.error('Error on : ', this.x, this.y, this.z)
				}
			}
			else {
				// Force empty if we can't add a normal tile (tile under a non-full one)
				type = NodeType.getByName('empty')
			}
		}
		this.type = type
		this.addMesh()
	}

	collapse(type, position) {
		if (this.type !== undefined) return
		const [sign, axis] = [position.slice(0, 3), position.slice(3)]
		const inverse = (sign === 'pos' ? 'neg' : 'pos') + axis
		this.neighbour = this.neighbour.filter(n => {
			return matches[n.profiles[inverse]].includes(type.profiles[position])
		})
		if (this.neighbour.length === 1) {
			this.setNodeType(this.neighbour[0])
			Grid.propagate(this)
		}
	}

	addMesh() {
		if (this.type.isEmpty) return
		this.mesh = Loader.items[this.type.name].scene.children[0].clone()
		this.mesh.rotateY(this.type.rotation * Math.PI / 2)
		this.mesh.position.copy(new Vector3()).add(new Vector3(this.center.x, this.center.y, this.center.z))
		// this.mesh.visible = false
		this.add(this.mesh)
		// if (this.onError) {
		this.mesh.material = new MeshNormalMaterial()
		// }

		// const color = !this.x && !this.y ? new Color('red') : new Color('blue')
		// this.add(new BoxHelper(this.mesh, color))
	}

	update() {
	}
}
