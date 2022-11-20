import {constraints} from "./constraints";

const instances = []

export class NodeType {
	constructor(params) {
		this.name = params.name
		this.index = params.index
		this.profiles = params.profiles
		this.weight = params.weight
		this.rotation = params.rotation

		this.color = params.color
		this.isEmpty = params.name === 'empty'

		instances.push(this)
	}

	static get instances() {
		return instances
	}

	static getByName(name) {
		return instances.find(t => t.name === name)
	}

	static getWeightedRand(neighbour) {
		const table = []

		neighbour.forEach(n => {
			for (let j = 0; j < n.weight; j++) {
				table.push(n)
			}
		})
		return table[Math.floor(Math.random() * table.length)]
	}
}

constraints.forEach(c => new NodeType(c))
