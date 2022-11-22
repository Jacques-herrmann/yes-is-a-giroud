import {Vector2} from "three";
import { distance } from "@/webgl/utils/math";

// https://www.codingame.com/playgrounds/1608/shortest-paths-with-dijkstras-algorithm/dijkstras-algorithm

class DijkstraMapTile{
	constructor(x, z, d) {
		this.x = x
		this.z = z
		this.size = 400 / d

		this.isObstacle = true
		this.isSelected = false
		this.isOnPath = false
		this.value = Infinity

		this.element = document.createElement('div')
		this.element.classList.add('debug__dijkstra-map-tile')
		this.element.style.transform = `translate(${x * this.size}px, ${z * this.size}px)`
		this.element.style.height = `${this.size}px`
		this.element.style.width = `${this.size}px`
	}

	reset() {
		this.isSelected = false
		this.isOnPath = false
		this.value = Infinity
	}

	toHTML() {
		this.element.className = ""
		this.element.classList.add('debug__dijkstra-map-tile')
		this.element.innerText = `${this.value}`
		if (this.isObstacle) {
			this.element.classList.add('debug__dijkstra-map-tile--is-obstacle')
		} else if(this.isSelected) {
			this.element.classList.add('debug__dijkstra-map-tile--is-selected')
		} else if(this.isOnPath) {
			this.element.classList.add('debug__dijkstra-map-tile--is-on-path')
		}
		return this.element
	}
}

export default class DijkstraMap {
	constructor(division) {
		this.division = division

		this.tiles = []
		for (let x = 0; x < division; x++) {
			for (let z = 0; z < division; z++) {
				this.tiles.push(new DijkstraMapTile(x, z, division))
			}
		}
		this.element = null
	}

	setObstacles(nodes) {
		nodes.forEach(n => {
			if(!n.type.isEmpty) {
				this.tileAt(n.x, n.z).isObstacle = false
			}
		})
	}

	update(target=new Vector2()) {
		const t = performance.now()
		this.tiles.forEach(t => t.reset())

		const base = this.tileAt(target.x, target.y)
		base.value = 0
		base.isSelected = true

		let remaining = [...this.tiles]
		const visited = []

		while(remaining.length){
			remaining = remaining.sort((a, b) => a.value - b.value)
			const current = remaining.splice(0, 1)[0]
			const neighbours = this.neighboursAt(current.x, current.z)
			neighbours.forEach(n => {
				if(visited.indexOf(n) === -1 && !n.isObstacle) {
					let d = distance(current.x, current.z, n.x, n.z)
					if (d > 1) {
						d = 1.4 // diagonal
					}
					n.value = Math.min(n.value,  Math.round((current.value + d ) * 10) / 10)
				}
			})
			visited.push(current)
		}
		// console.log(`Dijkstra Maps update time: ${performance.now() - t}`)
	}

	findPath(enemy=new Vector2()) {
		const p = []
		let current = this.tileAt(enemy.x, enemy.y)
		while(current.value !== 0) {
			p.push(current)
			const neighbours = this.neighboursAt(current.x, current.z).sort((a, b) => a.value - b.value)
			current = neighbours[0]
			current.isOnPath = true
		}
		return p
	}

	tileAt(x, z) {
		return this.tiles[x * this.division + z]
	}

	neighboursAt(x, z) {
		const n = []
		for (let i = Math.max(0, x - 1); i <= Math.min(x + 1, this.division - 1); i++) {
			for (let j =  Math.max(0, z - 1); j <= Math.min(z + 1, this.division - 1) ; j++) {
				const neighbour = this.tileAt(i ,j)
				if (neighbour && !(i === x && j === z)) {
					n.push(neighbour)
				}
			}
		}
		return n
	}

	toHTML() {
		if(!this.element) {
			this.element = document.createElement('div')
			this.element.classList.add('debug__dijkstra-map')
			this.tiles.forEach(t => {
				this.element.appendChild(t.toHTML())
			})
			document.body.appendChild(this.element)
		} else {
			this.tiles.forEach(t => {
				t.toHTML()
			})
		}
	}

	dispose() {
		this.element.remove()
	}
}
