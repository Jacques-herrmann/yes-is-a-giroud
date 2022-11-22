import {Mesh, MeshNormalMaterial, Vector2, Vector3} from 'three'
import {Node} from './node'
import {MeshBVH, MeshBVHVisualizer} from "three-mesh-bvh";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils";
import Terrain from "./terrain";
import DijkstraMap from "./dijkstraMap";

const tiles = []
const tiles2D = []
window.tiles = tiles

let currentElevation = 0

export default class Grid {
	constructor(division, elevation) {
		this.division = division
		this.tileSize = 2
		this.size = this.division * this.tileSize
		this.elevation = elevation - 1

		this.terrain = new Terrain(division * 4)
		this.dijkstraMap = null

		this.createNodes(division)
		this.wfc()
		// window.addEventListener('click', this.run.bind(this))
	}

	static tiles() {
		return tiles
	}

	static propagate(node) {
		const division = tiles[0].length - 1
		if (node.x > 0) {
			tiles[node.y][node.x - 1][node.z].collapse(node.type, 'negX')
		}
		if (node.x < division) {
			tiles[node.y][node.x + 1][node.z].collapse(node.type, 'posX')
		}
		if (node.z > 0) {
			tiles[node.y][node.x][node.z - 1].collapse(node.type, 'negZ')
		}
		if (node.z < division) {
			tiles[node.y][node.x][node.z + 1].collapse(node.type, 'posZ')
		}
		if (node.y < tiles.length - 1 && node.type.name === 'full') {
			// Propagate on next level (top). A tile can be added if the tile bellow and all it neighbours are full.
			for (let x = Math.max(0, node.x - 1); x <= Math.min(node.x + 1,division); x++) {
				for (let z = Math.max(0,node.z - 1); z <= Math.min(node.z + 1, division); z++) {
					if (x >= 0 && z >= 0) {
						tiles[node.y + 1][x][z].fullTilesUnder ++
					}
				}
			}
		}
	}

	createNodes(division) {
		for (let y = 0; y < this.elevation; y++) {
			tiles.push([])
			for (let x = 0; x < division; x++) {
				tiles[y].push([])
				for (let z = 0; z < division; z++) {
					const topLeft = new Vector3(
							x * this.tileSize,
							y * this.tileSize,
							z * this.tileSize
					)
					const bottomRight = new Vector3().copy(topLeft)
					bottomRight.add(new Vector3(this.tileSize, 2, this.tileSize))

					const node = new Node(x, y, z, [topLeft, bottomRight])
					tiles[y][x].push(node)
					this.terrain.addNode(node)
				}
			}
		}
	}

	wfc() {
		const remainingNode = tiles[currentElevation].flat().filter(n => n.type === undefined)
		if (remainingNode.length) {
			remainingNode.sort((a, b) => b.length - a.length)
			remainingNode[0].setNodeType()
			Grid.propagate(remainingNode[0])
			this.wfc()
		} else if(currentElevation < this.elevation - 1) {
			currentElevation++
			this.wfc()
		} else {
			this.createDijkstraMap()
			this.computeBVH()
		}
	}

	createDijkstraMap() {
		tiles2D.splice(0, tiles2D.length, ...tiles[0])
		for (let y = 1; y < this.elevation; y++) {
			for (let x = 0; x < this.division; x++) {
				for (let z = 0; z < this.division; z++) {
					const t = tiles[y][x][z]
					if(!t.type.isEmpty) {
						tiles2D[x][z] = t
					}
				}
			}
		}
		this.dijkstraMap = new DijkstraMap(this.division)
		this.dijkstraMap.setObstacles(tiles2D.flat())
	}

	updateDijkstraMap(player, enemies) {
		this.dijkstraMap.update(this.tileIndexAt(player.position2D))
		enemies.forEach(enemy => {
			const path = this.dijkstraMap.findPath(this.tileIndexAt(enemy.position2D))
			path.push(new Vector3().copy(player.mesh.position).multiplyScalar(0.5))
			enemy.updateFollowPath(path)
		})
		this.dijkstraMap.toHTML()
	}

	computeBVH() {
		// TODO: Use only nodes on top
		const nodes = tiles2D.flat(this.elevation).filter(n => n.type.name !== 'empty')
		this.merged = BufferGeometryUtils.mergeBufferGeometries( nodes.map(t => {
			t.mesh.updateMatrixWorld()
			const g = t.mesh.geometry.clone()
			g.applyMatrix4(t.mesh.matrixWorld)
			return g
		}), false);
		this.merged.boundsTree = new MeshBVH( this.merged, { lazyGeneration: false } );

		this.collider = new Mesh( this.merged, new MeshNormalMaterial() );
		this.visualizer = new MeshBVHVisualizer( this.collider, 10 );
		// this.add( this.visualizer );
		this.terrain.add( this.collider );
	}

	update() {
		this.terrain.update()
	}

	tileIndexAt(position=new Vector2()) {
		const x = Math.floor(position.x / this.tileSize)
		const z = Math.floor(position.y / this.tileSize)
		return new Vector2(x,z)
	}

	getRandomPosition() {
		return new Vector3(Math.random() * this.size, this.elevation + 2, Math.random() * this.size)
	}

	dispose(scene) {
		currentElevation = 0
		this.terrain.dispose()
		this.visualizer.dispose()
		this.collider.geometry.dispose()
		scene.remove(this.terrain)
		this.dijkstraMap.dispose()
		this.dijkstraMap = null

		tiles.splice(0, tiles.length)
		tiles2D.splice(0, tiles2D.length)
	}
}
