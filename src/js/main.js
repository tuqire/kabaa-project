import isWebglEnabled from 'detector-webgl'

import Camera from './io/camera'
import Controls from './io/controls'
import Renderer from './io/renderer'
import Stats from './io/stats'
import GUI from './io/gui'

import Scene from './objects/scene'
import Particles from './objects/particles'
import Cube from './objects/cube'
import Light from './objects/light'

import getParameterByName from './helpers/getParameterByName'
import showInfoBox from './helpers/showInfoBox'
import isNotMobileScreen from './helpers/isNotMobileScreen'

document.addEventListener('DOMContentLoaded', () => {
  const quality = Number(getParameterByName('quality'))

  if (!quality || isNaN(quality)) {
    document.getElementById('select-quality').style.display = 'block'
    return
  }

  if (isWebglEnabled && isNotMobileScreen()) {
    document.querySelector('.num-particles').innerHTML = quality.toLocaleString()

    showInfoBox()

    const WIDTH = window.innerWidth
    const HEIGHT = window.innerHeight
    const aspectRatio = WIDTH / HEIGHT

    const container = document.getElementById('simulation')

    const renderer = new Renderer({ width: WIDTH, height: HEIGHT, container })

    const camera = new Camera({ aspectRatio, position: { x: 310, y: -220, z: 240 } })
    const controls = new Controls({ dynamicDampingFactor: 0.3, minDistance: 40, maxDistance: 1000, camera: camera.get(), rendererDomElement: renderer.getDomElement() })

    const stats = new Stats()
    const cube = new Cube({ roughness: 0.7, position: { z: 5 / 2 }, bumpScale: 0.02 })
    const light = new Light({ color: 0x555555, strength: 5, position: [150, 150, 100] })
    const particles = new Particles({
      numParticles: quality,
      renderer: renderer.get()
    })
    const scene = new Scene()

    const gui = new GUI({ particles, scene }) // eslint-disable-line

    const init = () => {
      scene.add(cube.get())
      scene.add(light.get())
      scene.add(particles.get())

      controls.onChange(render)

      container.appendChild(stats.getDomElement())
    }

    const animate = () => {
      requestAnimationFrame(animate) // eslint-disable-line
      controls.update()
      render()
    }

    const render = () => {
      camera.update()
      particles.update()
      stats.update()
      renderer.render(scene.get(), camera.get())
    }

    init()
    animate()
  } else {
    document.getElementById('no-support').style.display = 'block'
  }
})
