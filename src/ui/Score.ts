import { Container, Text, TextStyle } from 'pixi.js'
import gsap from 'gsap'

export class Score extends Container {
  private text: Text
  private score = 0
  private animatedScore = 0

  constructor(initialScore: number) {
    super()
    const style = new TextStyle({
      fontFamily: 'Cursive',
      fontSize: 5,
      fontWeight: 'bold',
      fill: ['#ffff00', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 15,
      lineJoin: 'bevel',
    })
    this.score = initialScore
    this.text = new Text(this.score, style)
    this.text.anchor.set(0.5)
    this.addChild(this.text)
  }

  public resize(width: number, height: number) {
    this.text.y = height * 0.5
    this.text.x = width * 0.5
    this.text.style.fontSize = Math.max(width * 0.25, height * 0.25)
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
      ease: 'expo.out',
      onUpdate: () => {
        this.printPoints()
      },
    })
  }

  /** Print currently animated score to the screen */
  private printPoints(): void {
    const points = Math.round(this.animatedScore)
    const text = String(points)
    if (this.text.text !== text) {
      this.text.text = text
    }
  }
}
