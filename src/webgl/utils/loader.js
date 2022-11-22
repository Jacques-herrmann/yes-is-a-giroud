import {EventEmitter2} from 'eventemitter2'
import {GLTFLoader} from 'three/examples/jsm/loaders/GLTFLoader'
import {LoadingManager, TextureLoader} from "three";

const items = []

let i = 0
const TYPES = {
	MODEL: i++,
	TEXTURE: i++
}

export default class Loader extends EventEmitter2 {
	constructor(content) {
		super()

		this.content = content
		this.toLoad = this.content.length
		this.loaded = 0

		this.initManager()
		this.initLoaders()
	}

	static get items() {
		return items
	}

	static get TYPES() {
		return TYPES
	}

	initManager() {
		this.manager = new LoadingManager(
				() => {
					console.log('Loading complete!')
				},
				(url, itemsLoaded, itemsTotal) => {
					console.log('Loading file: ' + url + '.\nLoaded ' + itemsLoaded + ' of ' + itemsTotal + ' files.')
				},
				(url) => {
					console.log('There was an error loading ' + url)
				},
		)
	}

	initLoaders() {
		this.loaders = {}
		this.loaders.gltfLoader = new GLTFLoader(this.manager)
		this.loaders.gltfLoader.setDRACOLoader(this.loaders.dracoLoader)
		this.loaders.textureLoader = new TextureLoader(this.manager)
	}

	load(content) {
		for (const item of content) {
			this.loadOne(item)
		}
	}

	loadOne(item) {
		switch (item.type) {
			case Loader.TYPES.MODEL:
				this.loaders.gltfLoader.load(
						item.path,
						(file) => {
							this.itemLoaded(item, file)
						}
				)
				break
			case Loader.TYPES.TEXTURE:
				this.loaders.textureLoader.load(
						item.path,
						(file) => {
							file.ratio = file.image.height / file.image.width
							this.itemLoaded(item, file)
						}
				)
				break
		}
	}

	itemLoaded(source, file) {
		items[source.name] = file

		this.loaded++

		if (this.loaded === this.toLoad) {
			this.emit('ready')
		}
	}

}
