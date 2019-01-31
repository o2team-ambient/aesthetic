import debounce from 'lodash/debounce'
import {
  getRandom,
  hsla
} from '../utils/util'
import {
  O2_AMBIENT_CLASSNAME,
  O2_AMBIENT_CONFIG
} from '../utils/const'
import AmbientBase from './ambient-base'

class Aesthetic extends AmbientBase {
  constructor () {
    super()
    this.devicePixelRatio = 1
    this.isPaused = false
    this.isInited = false
    this.reset()
    this.initFPS()
    this.initDOM()
    this.bindEvents()
    this.init()
  }

  init () {
    this.isInited = true
    this.create()
  }

  create () {
    // this.renderBgCanvas()
    this.draw = this.drawDefault
    this.addParticles()
    this.play()
  }

  reset () {
    this.width = window.innerWidth * this.devicePixelRatio
    this.height = window.innerHeight * this.devicePixelRatio
    this.parent = document.querySelector('.o2team_ambient_main')
    this.FPS = 30
    this.sizeBase = this.width + this.height
    this.count = Math.floor(this.sizeBase * 0.3)
    this.backgroundColor = window[O2_AMBIENT_CONFIG].backgroundColor
    // this.hue = window[O2_AMBIENT_CONFIG].hue // getRandom(0, 360)
    this.hue = getRandom(0, 360)
    // this.saturation = window[O2_AMBIENT_CONFIG].saturation
    this.saturation = getRandom(0, 40)
    this.alpha = window[O2_AMBIENT_CONFIG].alpha || 0.1
    this.option = {
      backgroundColor: this.backgroundColor,
      radiusMin: 1,
      radiusMax: this.sizeBase * 0.04,
      blurMin: 10,
      blurMax: this.sizeBase * 0.04,
      hueMin: this.hue,
      hueMax: this.hue + 100,
      saturationMin: this.saturation,
      saturationMax: this.saturation + 60,
      lightnessMin: 20,
      lightnessMax: 50,
      alphaMin: this.alpha,
      alphaMax: this.alpha + 0.4,

      density: window[O2_AMBIENT_CONFIG].density || 3,
      radius: window[O2_AMBIENT_CONFIG].radius || 3
    }
    this.className = O2_AMBIENT_CLASSNAME
    this.isInited && this.create()
  }

  bindEvents () {
    this.windowResizeHandleSelf = debounce(this.windowResizeHandle.bind(this), 300)
    window.addEventListener('resize', this.windowResizeHandleSelf, false)
  }

  unbindEvents () {
    window.removeEventListener('resize', this.windowResizeHandleSelf, false)
  }

  windowResizeHandle (e) {
    const devicePixelRatio = this.devicePixelRatio

    this.width = window.innerWidth * devicePixelRatio
    this.height = window.innerHeight * devicePixelRatio
    this.canvas2.width = this.canvas1.width = this.width
    this.canvas2.height = this.canvas1.height = this.height
    this.canvas2.style.width = this.canvas1.style.width = `${this.width / devicePixelRatio}px`
    this.canvas2.style.height = this.canvas1.style.height = `${this.height / devicePixelRatio}px`
    this.reset()
  }

  renderBgCanvas () {
    const ctx1 = this.ctx1
    const option = this.option
    ctx1.clearRect(0, 0, this.width, this.height)
    this.setCanvasStyle(this.canvas2, {
      backgroundColor: option.backgroundColor
    })
    // ctx1.globalCompositeOperation = 'lighter'
    // for (let i = 0; i < this.count; i++) {
    //   const radius = getRandom(option.radiusMin, option.radiusMax)
    //   const blur = getRandom(option.blurMin, option.blurMax)
    //   const x = getRandom(0, this.width)
    //   const y = getRandom(0, this.height)
    //   const hue = getRandom(option.hueMin, option.hueMax)
    //   const saturation = getRandom(option.saturationMin, option.saturationMax)
    //   const lightness = getRandom(option.lightnessMin, option.lightnessMax)
    //   const alpha = getRandom(option.alphaMin, option.alphaMax)

    //   ctx1.shadowColor = hsla(hue, saturation, lightness, alpha)
    //   ctx1.shadowBlur = blur
    //   ctx1.beginPath()
    //   ctx1.arc(x, y, radius, 0, Math.PI * 2, false)
    //   ctx1.closePath()
    //   ctx1.fill()
    // }
  }

  addParticles () {
    const particles = []
    const { density, radius } = this.option
    const len = Math.floor((this.sizeBase) * 0.01 * density)
    for (let i = 0; i < len; i++) {
      particles.push({
        radius: getRandom(1, this.sizeBase * 0.01 * radius),
        x: getRandom(0, this.width),
        y: getRandom(0, this.height),
        angle: getRandom(0, Math.PI * 2),
        vel: getRandom(0.1, 0.5),
        tick: getRandom(0, 10000)
      })
    }
    this.particles = particles
  }

  drawDefault () {
    const ctx2 = this.ctx2
    ctx2.clearRect(0, 0, this.width, this.height)
    ctx2.globalCompositeOperation = 'source-over'
    ctx2.shadowBlur = 0
    ctx2.drawImage(this.canvas1, 0, 0)
    ctx2.globalCompositeOperation = 'lighter'
    ctx2.shadowBlur = 15
    ctx2.shadowColor = '#fff'

    this.particles.forEach((particle, index) => {
      particle.x += Math.cos(particle.angle) * particle.vel
      particle.y += Math.sin(particle.angle) * particle.vel
      particle.angle += getRandom(-0.05, 0.05)

      ctx2.beginPath()
      ctx2.arc(particle.x, particle.y, particle.radius, 0, Math.PI * 2, false)
      ctx2.fillStyle = hsla(0, 0, 100, 0.075 + Math.cos(particle.tick * 0.02) * 0.05)
      ctx2.fill()

      if (particle.x - particle.radius > this.width) { particle.x = -particle.radius }
      if (particle.x + particle.radius < 0) { particle.x = this.width + particle.radius }
      if (particle.y - particle.radius > this.height) { particle.y = -particle.radius }
      if (particle.y + particle.radius < 0) { particle.y = this.height + particle.radius }

      particle.tick++
    })
  }

  loop () {
    this.rafId = requestAnimationFrame(this.loop.bind(this))
    if (this.isPaused) return

    this.ctx2.clearRect(0, 0, this.width, this.height)
    this.draw()
  }
}

export default Aesthetic
