import FBO from 'three.js-fbo'
import { fragmentShader, vertexShader } from '../shaders/shaders'
import { simulationFragmentShader, simulationVertexShader } from '../shaders/simulationShaders'

export default class Particles {
  constructor ({
    renderer,

    numParticles = 1000 * 1200,

    configUniforms = {
      color: { value: new THREE.Color(0xffffff) },
      sizeMultipler: { value: (window.innerHeight * window.devicePixelRatio) / 2 },
      texture: { value: new THREE.TextureLoader().load('images/star.png') }
    },
    blending = THREE.AdditiveBlending,
    transparent = true,
    depthTest = true,
    depthWrite = false,

    circles = 7,
    radius = 100,
    depth = 0,
    colour = 0.8,

    sphere = false,
    speed = 0.0005,
    vibration = 1,
    beats = 0.075,

    // particle sizes
    minSize = 1,
    maxSize = 5,
    incSize = 0.05
  }) {
    this.renderer = renderer
    this.numParticles = numParticles

    this.circles = circles
    this.radius = radius
    this.depth = depth
    this.colour = colour

    this.sphere = sphere
    this.speed = speed
    this.vibration = vibration
    this.beats = beats

    this.minSize = minSize
    this.maxSize = maxSize
    this.incSize = incSize

    this.initParticleVars()

    // height and width that set up a texture in memory
    // this texture is used to store particle position values
    const tHeight = 512
    const tWidth = this.numParticles / tHeight

    this.FBO = new FBO({
      tWidth,
      tHeight,
      renderer,
      uniforms: {
        tTargetPosition: { type: 't', value: null },
        clampValue: { type: 'f', value: 0.1 },
        flatSimulation: { type: 'bool', value: true },

        vibration: { type: 'f', value: this.vibration },

        minSize: { type: 'f', value: this.minSize },
        maxSize: { type: 'f', value: this.maxSize },
        incSize: { type: 'f', value: this.incSize }
      },
      simulationVertexShader,
      simulationFragmentShader
    })

    this.setDefaultPositions()
    this.setTargetPositions()

    const uniforms = Object.assign({}, configUniforms, {
      tPosition: { type: 't', value: this.FBO.targets[0] }
    })

    this.material = new THREE.ShaderMaterial({
      uniforms,
      vertexShader,
      fragmentShader,
      blending,
      transparent,
      depthTest,
      depthWrite
    })

    const geometry = new THREE.Geometry()

    for (let i = 0, l = this.numParticles; i < l; i++) {
      const vertex = new THREE.Vector3()
      vertex.x = (i % tWidth) / tWidth
      vertex.y = Math.floor(i / tWidth) / tHeight
      geometry.vertices.push(vertex)
    }

    this.particles = new THREE.Points(geometry, this.material)
    this.particles.frustumCulled = false
  }

  setDefaultPositions () {
    this.FBO.setTextureUniform(['tPrev', 'tCurr'], this.getDefaultPositions())
  }

  getDefaultPositions () {
    const vertices = new Float32Array(this.numParticles * 4)
    for (let i = 0, i3 = 0; i < this.numParticles; i++, i3 += 4) {
      vertices[i3] = vertices[i3 + 1] = vertices[i3 + 2] = vertices[i3 + 3] = 0
    }
    return vertices
  }

  setTargetPositions () {
    this.FBO.setTextureUniform('tTargetPosition', this.getTargetPositions())
  }

  getTargetPositions () {
    const vertices = new Float32Array(this.numParticles * 4)
    for (let i = 0, i3 = 0; i < this.numParticles; i++, i3 += 4) {
      const vertice = this.getTargetPosition(i, i3)

      vertices[i3] = vertice[0]
      vertices[i3 + 1] = vertice[1]
      vertices[i3 + 2] = vertice[2]

      vertices[i3 + 3] = this.getSize(i, vertice)
    }
    return vertices
  }

  getTargetPosition (index, i3) {
    const clusterNum = this.getClusterNum(index)
    return this.calcTargetPosition(this.radiuses[clusterNum])
  }

  calcTargetPosition (radius) {
    const x = Math.random() * 2 - 1
    const y = Math.random() * 2 - 1
    const tempZ = Math.random() * 3 - 1.5
    const z = tempZ < 1.45 ? tempZ : Math.random() * 150
    const d = (1 / Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2) + Math.pow(tempZ, 2)))

    return [
      x * radius * d,
      y * radius * d,
      this.sphere ? tempZ * radius * d : z
    ]
  }

  getSize (index, vertice) {
    const clusterNum = this.getClusterNum(index) + 1
    const sizeRange = this.maxSize - this.minSize
    const rand = Math.random() / clusterNum
    const size = this.minSize + sizeRange * rand

    return size
  }

  initParticleVars () {
    this.setClusters()
    this.setRadiuses()
  }

  setClusters () {
    this.clusters = []

    for (let i = 0; i < (this.circles - 1); i++) {
      this.clusters[i] = Math.floor((this.numParticles / (this.circles * (this.circles - i))) * (i + 1))
    }

    this.clusters[this.circles - 1] = this.numParticles
  }

  getClusterNum (index) {
    for (let i = 0; i < this.clusters.length; i++) {
      const lowerLimit = i === 0 ? 0 : this.clusters[i - 1]
      if (index < this.clusters[i] && index >= lowerLimit) {
        return i
      }
    }
  }

  setRadiuses () {
    this.radiuses = []

    for (let i = 0; i < this.circles; i++) {
      this.radiuses[i] = (i + 1) * this.radius
    }
  }

  setColour (i3) {
    // TODO: colours
  }

  update () {
    this.FBO.simulate()
    this.material.uniforms.tPosition.value = this.FBO.getCurrentFrame()

    this.rotateZ(this.speed)
  }

  rotateZ (inc) {
    this.particles.rotation.z += inc
  }

  get () {
    return this.particles
  }

  setSimType () {
    this.FBO.simulationShader.uniforms.flatSimulation.value = !this.sphere
  }
}
