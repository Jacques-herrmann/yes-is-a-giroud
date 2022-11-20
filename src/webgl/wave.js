import {
	Scene,
	Color,
	AmbientLight,
	PointLight
} from "three";

import {PlayerController} from "@/webgl/characters/playerController";
import {Enemy} from "@/webgl/characters/enemy";
import {EnemyController} from "@/webgl/characters/enemyController";
import Grid from "@/webgl/terrain/grid";

const S = 20

export default class Wave {
	constructor() {
		this.difficulty = 0

		this.scene = new Scene()
		this.scene.background = new Color('#333')
	}

	run(){}
	end(){}

	init(player) {
		this.player = player
		this.grid = new Grid(S, 3)
		this.enemy = new Enemy()
		this.scene.add(this.grid.terrain)
		this.scene.add(player)
		this.scene.add(this.enemy)

		this.scene.add(new AmbientLight(10))
		const p = new PointLight("#ffffff", 5)
		p.position.set(-2, 20, 3)
		this.scene.add(p)

		this.playerControl = new PlayerController(player, this.grid.collider)
		this.enemyControl = new EnemyController(this.enemy, this.grid.collider)

		player.addEventListener('move', this.updateDijkstraMap.bind(this))
		this.enemy.addEventListener('move', this.updateDijkstraMap.bind(this))
	}

	resize() {
	}

	update(delta, controls) {
		this.playerControl.update(delta, controls)
		this.enemyControl.update(delta, controls)
	}

	updateDijkstraMap() {
		this.grid.updateDijkstraMap(this.player, [this.enemy])
	}

	dispose(){}
}