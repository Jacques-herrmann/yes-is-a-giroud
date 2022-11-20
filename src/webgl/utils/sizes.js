import { EventEmitter2 } from 'eventemitter2'

let instance = null;

export default class Sizes extends EventEmitter2 {
  constructor () {
    super()
    if (instance) {
        return instance
    }
    instance = this
    this.width = window.innerWidth
    this.height = window.innerHeight
    this.pixelRatio = Math.min(window.devicePixelRatio, 2)
    this.ratio = this.height / this.width

    window.addEventListener('resize', () => {
      this.width = window.innerWidth
      this.height = window.innerHeight
      this.pixelRatio = Math.min(window.devicePixelRatio, 2)
      this.ratio = this.height / this.width
      this.emit('resize')
    })
  }
}
