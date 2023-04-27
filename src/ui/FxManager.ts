import { Container, Rectangle } from 'pixi.js'
import { Fx } from './Fx'
import { gsap } from 'gsap'

class FxManager {
  public playFx(container: Container, score: number, zone: Rectangle) {
    return this._playFx(container, score, zone)
  }

  private getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  private _playFx(container: Container, diff: number, zone: Rectangle) {
    const tl = gsap.timeline()
    if (diff > 0) {
      // increment
      tl.add(() => this.addFx(container, 4, zone).play(), 0)
    } else {
      // decrement
      for (let i = 0; i > Math.max(diff, -5); i--) {
        tl.add(() => this.addFx(container, 1, zone).play(), '>0.1')
      }
      if (diff < -4) {
        tl.add(() => this.addFx(container, 2, zone).play(), '>0.2')
      }
    }
  }

  private addFx(container: Container, type: number, zone: Rectangle) {
    let name = 'fx1_splatter_small_red'
    switch (type) {
      case 1:
        name = 'fx1_splatter_small_red'
        break
      case 2:
        name = 'fx1_explosion_small_orange'
        break
      case 3:
        name = 'fx2_impact_shock_large_brown'
        break
      case 4:
        name = 'fx2_electric_burst_large_violet'
        break
    }
    const fx = new Fx(name)
    fx.anchor.set(0.5)
    fx.angle = Math.random() * 90 - 45
    const { width, height } = zone
    fx.scale.set(width / (fx.texture.width * 3))
    fx.x = width * this.getRandomArbitrary(0.25, 0.75)
    fx.y = height * this.getRandomArbitrary(0.25, 0.75)
    fx.currentFrame = 0
    container.addChild(fx)
    fx.onComplete = () => {
      container.removeChild(fx)
    }
    return fx
  }
}

export const fxManager = new FxManager()
