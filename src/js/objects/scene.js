export default class Canvas {
  constructor () {
    this.scene = new THREE.Scene()
  }

  add (obj) {
    this.scene.add(obj)
  }

  remove (obj) {
    this.scene.remove(obj)
  }

  get () {
    return this.scene
  }
}
