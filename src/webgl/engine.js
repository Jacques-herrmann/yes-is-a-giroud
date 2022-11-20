import Stage from "./stage";
import {Clock, EventDispatcher} from "three";
import {OrbitControls} from "@/webgl/customs/OrbitControls";
import {Player} from "@/webgl/characters/Player";
import Wave from "@/webgl/wave";

let instance = null;

export default class Engine extends EventDispatcher{
	constructor(canvas) {
		super()
		if (instance) {
			return instance
		}
		instance = this

		this.isRunning = false
		this.stats = {
			yolo: 'zeub'
		}
		this.canvas = canvas
		this.stage = new Stage(canvas)

		this.clock = new Clock()

		this.player = new Player()
		this.wave = new Wave(this.player)
		this.controls = new OrbitControls(this.stage.camera, this.canvas)
		// this.shop = new Shop()

		window.requestAnimationFrame(this.render.bind(this))
		this.player.addEventListener('dead', this.endGame.bind(this))
		this.wave.addEventListener('waveEnd', this.waveEnd.bind(this))
	}

	start() {
		this.isRunning = true
		this.wave.init(0)
	}

	next() {
		this.isRunning = true
		this.wave.next()
	}

	reset() {
		this.player.reset()
		this.isRunning = true

		this.wave.reset()
	}

	endGame() {
		console.log('game end')
		this.isRunning = false
		this.dispatchEvent({ type: 'endGame', stats: this.stats})
	}

	waveEnd() {
		console.log('wave end')
		this.isRunning = false
		this.dispatchEvent({ type: 'waveEnd', stats: this.stats})
	}

	resize() {
		this.stage.resize()
	}

	render() {
		window.requestAnimationFrame(this.render.bind(this))

		if(!this.isRunning) {
			return
		}

		const delta = this.clock.getDelta();
		const physicsSteps = 5
		this.wave.update(Math.min(delta, 0.1) / physicsSteps, this.controls)

		if(this.wave.scene) {
			this.stage.render(this.wave)
		}
	}
}