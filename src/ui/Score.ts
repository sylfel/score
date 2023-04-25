import { BitmapText, Container, utils } from 'pixi.js'
import gsap from 'gsap'
import { Fx } from './Fx'

export class Score extends Container {
  private bitmapFontText: BitmapText
  private score = 0
  private animatedScore = 0
  private innerWidth = 0
  private innerHeight = 0

  constructor(initialScore: number) {
    super()
    this.score = initialScore
    this.animatedScore = initialScore

    this.bitmapFontText = new BitmapText(String(initialScore), {
      fontName: 'Unlearned BRK',
      fontSize: 20,
    })
    this.bitmapFontText.tint = 0x003eaa
    this.bitmapFontText.anchor.set(0.5)
    this.addChild(this.bitmapFontText)
  }

  public resize(width: number, height: number) {
    this.innerWidth = width
    this.innerHeight = height

    this.bitmapFontText.y = height * 0.5
    this.bitmapFontText.x = width * 0.5
    this.bitmapFontText.fontSize = Math.max(width * 0.4, height * 0.4)
  }

  private getRandomArbitrary(min: number, max: number) {
    return Math.random() * (max - min) + min
  }

  private playFx(diff: number) {
    const tl = gsap.timeline()
    const count = 0
    if (diff > 0) {
      // increment
      tl.add(() => this.addFx(4).play(), 0)
    } else {
      // decrement
      for (let i = 0; i > Math.max(diff, -5); i--) {
        tl.add(() => this.addFx(1).play(), '>0.1')
      }
      if (diff < -4) {
        tl.add(() => this.addFx(2).play(), '>0.2')
      }
    }
  }
  private addFx(type: number) {
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
    fx.scale.set(this.innerWidth / (fx.texture.width * 3))
    fx.x = this.innerWidth * this.getRandomArbitrary(0.25, 0.75)
    fx.y = this.innerHeight * this.getRandomArbitrary(0.25, 0.75)
    fx.currentFrame = 0
    this.addChild(fx)
    fx.onComplete = () => {
      this.removeChild(fx)
    }
    return fx
  }

  /** Set the score and play the scores animation */
  public async setScore(value: number): Promise<number> {
    if (this.score === value) {
      return Promise.resolve(value)
    }
    this.playFx(value - this.score)
    this.score = value
    await this.playScores()
    return Promise.resolve(value)
  }

  /** Play score animation, increasing gradually until reaches actual score */
  private async playScores(): Promise<void> {
    gsap.killTweensOf(this)
    await gsap.to(this, {
      animatedScore: this.score,
      duration: 0.7,
      ease: 'power1.inOut',
      onUpdate: () => {
        this.printPoints()
      },
    })
  }

  /** Print currently animated score to the screen */
  private printPoints(): void {
    const points = Math.round(this.animatedScore)
    const text = String(points)
    if (this.bitmapFontText.text !== text) {
      this.bitmapFontText.text = text
    }
  }
}
