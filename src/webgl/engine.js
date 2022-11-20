import Stage from "./stage";
import {Clock} from "three";
import {OrbitControls} from "@/webgl/customs/OrbitControls";
import {Player} from "@/webgl/characters/Player";
import Wave from "@/webgl/wave";

let instance = null;

export default class Engine {
	constructor(canvas) {
		if (instance) {
			return instance
		}
		instance = this

		this.isRunning = false
		this.canvas = canvas
		this.stage = new Stage(canvas)

		this.clock = new Clock()

		this.wave = new Wave()
		this.player = new Player()
		this.controls = new OrbitControls(this.stage.camera, this.canvas)
		// this.shop = new Shop()

		window.requestAnimationFrame(this.render.bind(this))
	}

	start() {
		this.isRunning = true
		this.wave.init(this.player)
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