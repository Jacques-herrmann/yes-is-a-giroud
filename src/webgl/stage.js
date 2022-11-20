import {PerspectiveCamera, WebGLRenderer} from "three";
import Sizes from "@/webgl/utils/sizes";

export default class Stage {
	constructor(canvas) {
		this.canvas = canvas

		this.renderer = new WebGLRenderer({
			canvas: canvas,
			antialias: true,
			alpha: true
		})
		this.renderer.setSize(window.innerWidth, window.innerHeight)
		this.renderer.setPixelRatio(window.devicePixelRatio)
		this.renderer.setClearColor(0xffffff, 1)
		// this.renderer.shadowMap.enabled = true

		this.sizes = new Sizes()
		this.sizes.on('resize', this.resize.bind(this))


		this.camera =  new PerspectiveCamera(75, this.sizes.width / this.sizes.height, 0.1, 1000)
		this.camera.position.set(0, 14, 10)

		this.sizes.on('resize', this.resize.bind(this))
	}

	resize() {
		this.renderer.setSize(this.sizes.height, this.sizes.width)
		this.renderer.setPixelRatio(this.sizes.devicePixelRatio)

		this.camera.aspect = this.sizes.ratio
		this.camera.updateProjectionMatrix()

	}

	render(wave) {
		this.renderer.render(wave.scene, this.camera)
	}
}