import forEach from 'lodash/forEach'
class AmbientBase {
  initDOM () {
    const canvas1 = this.createCanvas()
    const canvas2 = this.createCanvas()
    this.setCanvasStyle(canvas1)
    this.setCanvasStyle(canvas2)
    // this.parent.appendChild(canvas1)
    this.canvas1 = canvas1
    this.canvas2 = canvas2
    this.ctx1 = canvas1.getContext('2d')
    this.ctx2 = canvas2.getContext('2d')
    // this.setCanvasStyle(canvas2, {
    //   backgroundColor: window[O2_AMBIENT_CONFIG].backgroundColor
    // })
    this.parent.appendChild(canvas2)
  }

  createCanvas () {
    const canvas = document.createElement('canvas')
    const devicePixelRatio = this.devicePixelRatio
    this.setCanvasStyle(canvas, {
      position: 'fixed',
      left: 0,
      top: 0,
      width: `${this.width / devicePixelRatio}px`,
      height: `${this.height / devicePixelRatio}px`,
      zIndex: -1,
      pointerEvents: 'none'
    })
    canvas.className = this.className
    canvas.width = this.width
    canvas.height = this.height
    return canvas
  }

  setCanvasStyle (canvas, styleHash) {
    forEach(styleHash, (val, key) => {
      canvas.style[key] = val
    })
  }

  initFPS () {
    this.INTERVAL = 1000 / this.FPS
    this.nextTime = Date.now()
    this.startTime = this.nextTime
  }

  play () {
    this.isPaused = false
    cancelAnimationFrame(this.rafId)
    this.loop()
  }

  pause () {
    this.isPaused = true
  }

  stop () {
    cancelAnimationFrame(this.rafId)
    this.pause()
  }

  toggle () {
    this.isPaused
      ? this.play()
      : this.pause()
  }

  destory () {
    this.stop()
    this.unbindEvents()
    this.parent.removeChild(this.canvas)
  }
}

export default AmbientBase
