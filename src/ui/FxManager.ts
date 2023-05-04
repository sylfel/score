import { Fx } from './Fx'
import { gsap } from 'gsap'
import { ResizeContainer } from './ResizeContainer'
import { Score } from './Score'

class FxManager {
  private mapFx: Map<number, string> = new Map([
    [1, 'fx1_splatter_small_red'],
    [2, 'fx1_explosion_small_orange'],
    [3, 'fx2_impact_shock_large_brown'],
    [4, 'fx2_electric_burst_large_violet'],
  ])

  public async playFx(
    container: Score,
    newScore: number,
    onUpdate: gsap.Callback,
  ): Promise<gsap.core.Timeline> {
    gsap.killTweensOf(container)
    const diff = newScore - container.getScore()
    const tl = gsap.timeline()
    this.animateScore(tl, container, newScore, diff, onUpdate)
    if (diff > 0) {
      this.incrementAnimation(tl, container)
    } else {
      this.decrementAnimation(tl, container, Math.abs(diff))
    }
    return tl
  }

  private getNameFxFromNumber(type: number): string {
    const name = this.mapFx.get(type)
    return name ?? 'fx1_splatter_small_red'
  }

  private getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  private incrementAnimation(tl: gsap.core.Timeline, container: Score) {
    const fx = this.addFx(container, 4, false)
    tl.to(
      fx,
      {
        onStart: () => fx.play(),
        duration: 1.5,
        width: container.innerWidth,
        height: container.innerHeight,
        alpha: 0,
        ease: 'slow(0.7, 0.7, false)',
      },
      0,
    )
  }

  private decrementAnimation(
    tl: gsap.core.Timeline,
    container: Score,
    diff: number,
  ) {
    for (let i = 0; i < Math.min(diff, 5); i++) {
      tl.add(() => this.addFx(container, 1).play(), i === 0 ? '0' : '>0.1')
    }
    for (let i = 0; i < Math.floor(diff / 5); i++) {
      tl.add(() => this.addFx(container, 2).play(), '>0.1')
    }
    for (let i = 0; i < Math.floor(diff / 12); i++) {
      tl.add(() => this.addFx(container, 3).play(), '>0.1')
    }
  }

  private animateScore(
    tl: gsap.core.Timeline,
    container: Score,
    newScore: number,
    diff: number,
    callback: gsap.Callback,
  ) {
    tl.to(
      container,
      {
        animatedScore: newScore,
        duration: 0.5 + Math.abs(diff) * 0.02,
        ease: 'power1.inOut',
        onUpdate: callback,
      },
      0,
    )
  }

  private addFx(container: ResizeContainer, type: number, random = true): Fx {
    const fx = new Fx(this.getNameFxFromNumber(type))
    fx.anchor.set(0.5)
    const { width, height } = container.innerSize
    fx.scale.set(width / (fx.texture.width * 3))
    if (random) {
      fx.angle = Math.random() * 90 - 45
      fx.x = width * this.getRandomArbitrary(0.25, 0.75)
      fx.y = height * this.getRandomArbitrary(0.25, 0.75)
    } else {
      fx.x = width * 0.5
      fx.y = height * 0.5
    }
    fx.currentFrame = 0
    container.addChild(fx)
    fx.onComplete = () => {
      container.removeChild(fx)
    }
    return fx
  }
}

export const fxManager = new FxManager()
