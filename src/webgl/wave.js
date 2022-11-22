import {
	Scene,
	Color,
	AmbientLight,
	PointLight, EventDispatcher
} from "three";

import {PlayerController} from "@/webgl/characters/playerController";
import {Enemy} from "@/webgl/characters/enemy";
import {EnemyController} from "@/webgl/characters/enemyController";
import Grid from "@/webgl/terrain/grid";
import config from "@/webgl/config"

export default class Wave extends EventDispatcher{
	constructor(player) {
		super()
		this.difficulty = 0

		this.scene = new Scene()
		this.scene.background = new Color('#333')
		this.scene.add(new AmbientLight(10))
		const p = new PointLight("#ffffff", 5)
		p.position.set(-2, 20, 3)
		this.scene.add(p)

		this.player = player
		this.scene.add(player)
		this.player.addEventListener('move', this.updateDijkstraMap.bind(this))

		this.enemies = []
		this.playerControl = null
		this.enemiesControls = []
	}


	init() {
		const waveConfig = config.waves[this.difficulty]

		this.grid = new Grid(waveConfig.terrainSize, 3)
		this.scene.add(this.grid.terrain)

		for (let i = 0; i < waveConfig.enemies.number; i++) {
			const enemy = new Enemy(waveConfig.enemies.strength, this.grid.getRandomPosition())
			this.enemies.push(enemy)
			const enemyControl = new EnemyController(enemy, this.grid.collider)
			enemy.addEventListener('move', this.updateDijkstraMap.bind(this))
			enemy.addEventListener('dead', (enemy) => {
				this.onEnemyDied(enemy)
			})
			this.enemiesControls.push(enemyControl)
			this.scene.add(enemy)
		}

		this.playerControl = new PlayerController(this.player, this.grid.collider)
	}

	onEnemyDied(ev) {
		this.scene.remove(ev.instance)
		this.enemies.splice(this.enemies.indexOf(ev.instance), 1)
		if(!this.enemies.length) {
			this.dispatchEvent({type: 'waveEnd'})
		}
	}

	next() {
		this.dispose()
		this.difficulty += 1
		this.init()
	}

	reset() {
		this.dispose()
		this.difficulty = 0

		this.init()
	}

	resize() {
	}

	update(delta, controls) {
		this.playerControl.update(delta, controls)
		this.enemiesControls.forEach(c => c.update(delta, controls))
	}

	updateDijkstraMap() {
		this.grid.updateDijkstraMap(this.player, this.enemies)
	}

	dispose(){
		this.grid.dispose(this.scene)

		this.enemies.forEach(enemy => {
			enemy.dispose()
			this.scene.remove(enemy)
			enemy.removeEventListener('move', this.updateDijkstraMap.bind(this))
			enemy.removeEventListener('dead', (enemy) => {
				this.onEnemyDied(enemy)
			})
		})
		this.enemies.splice(0, this.enemies.length)
		this.enemiesControls.splice(0, this.enemiesControls.length)
	}
}