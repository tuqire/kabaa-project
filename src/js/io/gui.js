import DatGUI from 'dat-gui'

export default class GUI {
  constructor ({
    particles,
    scene
  } = {}) {
    this.gui = new DatGUI.GUI()

    this.addCirclesControls(particles)
    this.addRadiusControls(particles)
    this.addVibrationControls(particles)
    this.addSpeedControls(particles)
    this.addSphereControls(particles)
  }

  addCirclesControls (particles) {
    this.gui.add(particles, 'circles')
      .min(1)
      .max(25)
      .step(1)
      .onFinishChange(() => {
        particles.initParticleVars()
        particles.setTargetPositions()
      })
  }

  addRadiusControls (particles) {
    this.gui.add(particles, 'radius')
      .min(10)
      .max(500)
      .step(1)
      .onFinishChange(() => {
        particles.initParticleVars()
        particles.setTargetPositions()
      })
  }

  addVibrationControls (particles) {
    this.gui.add(particles, 'vibration')
      .min(0)
      .max(50)
      .step(0.25)
      .onFinishChange(() => {
        particles.FBO.simulationShader.uniforms.vibration.value = particles.vibration
      })
  }

  addSpeedControls (particles) {
    this.gui.add(particles, 'speed')
      .min(0)
      .max(0.05)
      .step(0.001)
  }

  addSphereControls (particles) {
    this.gui.add(particles, 'sphere')
      .onFinishChange(() => {
        particles.setSimType()
        particles.setTargetPositions()
      })
  }
}
