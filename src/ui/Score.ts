import { BitmapText } from 'pixi.js'
import { fxManager } from './FxManager'
import { ResizeContainer } from './ResizeContainer'

export class Score extends ResizeContainer {
  private bitmapFontText: BitmapText
  private score = 0
  private animatedScore = 0

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
    super.resize(width, height)
    this.pivot.set(width * 0.5, height * 0.5)
    this.position.set(width * 0.5, height * 0.5)

    this.bitmapFontText.y = height * 0.5
    this.bitmapFontText.x = width * 0.5
    this.bitmapFontText.fontSize = Math.max(width * 0.4, height * 0.4)
  }

  public getScore(): number {
    return this.score
  }

  /** Set the score and play the scores animation */
  public async setScore(value: number, doAnimation = true): Promise<number> {
    if (this.score === value) {
      return Promise.resolve(value)
    }
    if (doAnimation) {
      await fxManager.playFx(this, value, () => this.printPoints())
    } else {
      this.animatedScore = value
      this.printPoints()
    }
    this.score = value
    return Promise.resolve(this.score)
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
