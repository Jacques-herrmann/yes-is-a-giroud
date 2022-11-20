import * as THREE from 'three'
import {EventEmitter2} from 'eventemitter2'
import Engine from "../Engine";
import {Raycaster} from "three";

export default class Cursor extends EventEmitter2 {
	constructor() {
		super()
		this.engine = new Engine()

		this.position = new THREE.Vector2(0, 0)
		this.raycaster = new Raycaster()

		window.addEventListener('mousemove', this.update.bind(this))
		window.addEventListener('click', this.onClick.bind(this))
	}

	update(ev) {
		this.raycaster.setFromCamera(this.position, this.engine.activeScene.activeCamera)
		this.position.x = (ev.clientX / this.engine.canvas.clientWidth) * 2 - 1
		this.position.y = -(ev.clientY / this.engine.canvas.clientHeight) * 2 + 1
	}

	onClick() {
		this.emit('click')
	}
}
