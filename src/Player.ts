import { BitmapText, Container } from 'pixi.js'
import { Score } from './ui/Score'
import { Background } from './ui/Background'
import { LargeButton } from './ui/LargeButton'
import { gsap } from 'gsap'

const nbRow = 12
const heightBtn = nbRow / 2
const ratioY1 = (nbRow - 3) / nbRow
const ratioY2 = (nbRow - 1) / nbRow

export class Player extends Container {
  public readonly num: number

  public onLost?: (player: Player) => void

  private currentScore = 50
  private nextIncrement = 0
  private t = 0
  private score: Score
  private bg: Background

  private innerHeight = 0
  private isAnimating = false

  private btnTLTexture: LargeButton
  private btnTRTexture: LargeButton
  private btnBLTexture: LargeButton
  private btnBRTexture: LargeButton
  private text: BitmapText

  constructor(num: number) {
    super()
    this.num = num

    this.bg = new Background()
    this.addChild(this.bg)

    this.btnTLTexture = new LargeButton('btns_1', +1)
    this.btnTLTexture.onPress.connect((btn) => this.onBtnPress(btn?.value || 0))
    this.addChild(this.btnTLTexture)

    this.btnTRTexture = new LargeButton('btns_2', +5)
    this.btnTRTexture.onPress.connect((btn) => this.onBtnPress(btn?.value || 0))
    this.addChild(this.btnTRTexture)

    this.btnBLTexture = new LargeButton('btns_3', -1)
    this.btnBLTexture.onPress.connect((btn) => this.onBtnPress(btn?.value || 0))
    this.addChild(this.btnBLTexture)

    this.btnBRTexture = new LargeButton('btns_4', -5)
    this.btnBRTexture.onPress.connect((btn) => this.onBtnPress(btn?.value || 0))
    this.addChild(this.btnBRTexture)

    this.score = new Score(this.currentScore)
    this.addChild(this.score)

    this.text = new BitmapText('', {
      fontName: 'Unlearned BRK',
      fontSize: 20,
    })
    this.text.anchor.set(0.5, 0.5)
    this.addChild(this.text)
  }

  public resize(width: number, height: number) {
    this.innerHeight = height
    this.bg.resize(width, height)
    this.score.resize(width, height * 0.5)

    this.btnTLTexture.width = width / 2
    this.btnTLTexture.height = height / heightBtn
    this.btnTLTexture.x = width * 0.25
    this.btnTLTexture.y = height * ratioY1

    this.btnTRTexture.width = width / 2
    this.btnTRTexture.height = height / heightBtn
    this.btnTRTexture.x = width * 0.75
    this.btnTRTexture.y = height * ratioY1

    this.btnBLTexture.width = width / 2
    this.btnBLTexture.height = height / heightBtn
    this.btnBLTexture.x = width * 0.25
    this.btnBLTexture.y = height * ratioY2

    this.btnBRTexture.width = width / 2
    this.btnBRTexture.height = height / heightBtn
    this.btnBRTexture.x = width * 0.75
    this.btnBRTexture.y = height * ratioY2

    this.text.x = width * 0.5
    this.text.y = (height * (nbRow - 2)) / nbRow
    this.text.fontSize = Math.max(width * 0.09, height * 0.09)
  }

  private onBtnPress(increment: number): void {
    if (!this.isAnimating) {
      this.updateIncrement(this.nextIncrement + increment)
    }
  }

  private updateIncrement(nextIncrment: number): void {
    this.nextIncrement = nextIncrment
    // use a simple debounce to perform increment
    clearTimeout(this.t)
    if (this.nextIncrement === 0) {
      this.text.text = ''
    } else {
      const isPositif = Math.sign(this.nextIncrement) === 1
      const color = isPositif ? 'deepskyblue' : 'firebrick'
      this.text.text =
        (isPositif ? '+' : '-') + String(Math.abs(this.nextIncrement))
      this.text.tint = color
      this.t = window.setTimeout(() => this.updateScore(), 800)
    }
  }

  private updateScore(): void {
    this.isAnimating = true
    this.currentScore = Math.max(this.currentScore + this.nextIncrement, 0)
    gsap.killTweensOf(this.text)
    const tween = gsap.to(this.text, {
      duration: 0.5,
      pixi: {
        scaleY: 2,
        scaleX: 0.2,
      },
      y: this.innerHeight * 0.25,
      ease: 'expo.in',
      onComplete: () => {
        tween.revert()
        void this.propagateScore()
      },
    })
  }

  private async propagateScore() {
    this.updateIncrement(0)
    const newValue = await this.score.setScore(this.currentScore)
    if (newValue === 0) {
      // @ts-ignore TS2345
      this.emit('lost', this)
    }
    this.isAnimating = false
  }
}
