import { BitmapText, Container } from 'pixi.js'
import gsap from 'gsap'

export class Score extends Container {
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
    this.bitmapFontText.y = height * 0.5
    this.bitmapFontText.x = width * 0.5
    this.bitmapFontText.fontSize = Math.max(width * 0.4, height * 0.4)
  }

  /** Set the score and play the scores animation */
  public setScore(value: number) {
    if (this.score === value) return
    this.score = value
    void this.playScores()
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
