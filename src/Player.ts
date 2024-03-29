import { BitmapText } from 'pixi.js'
import { Score } from './ui/Score'
import { gsap } from 'gsap'
import { formatNumber } from './utils/strings'
import { ResizeContainer } from './ui/ResizeContainer'
import { LargeNumberButton } from './ui/LargeNumberButton'
import { userSettings } from './UserSettings'
import { themeManager } from './ThemeManager'

const nbRow = 12
const heightBtn = nbRow / 2
const ratioY1 = (nbRow - 3) / nbRow
const ratioY2 = (nbRow - 1) / nbRow

export class Player extends ResizeContainer {
  public readonly num: number

  public onLost?: (player: Player) => void

  private currentScore = userSettings.initialScore
  private nextIncrement = 0
  private t = 0
  private score: Score

  private isAnimating = false
  private isPaused = false

  private btnTLTexture: LargeNumberButton
  private btnTRTexture: LargeNumberButton
  private btnBLTexture: LargeNumberButton
  private btnBRTexture: LargeNumberButton
  private text: BitmapText

  constructor(num: number) {
    super()
    this.num = num

    this.btnTLTexture = new LargeNumberButton(
      themeManager.getLowIntervalPos(),
      userSettings.lowInterval,
    )
    this.btnTLTexture.onPress.connect((btn) => this.onBtnPress(btn?.value || 0))
    this.addChild(this.btnTLTexture)

    this.btnTRTexture = new LargeNumberButton(
      themeManager.getHighIntervalPos(),
      userSettings.highInterval,
    )
    this.btnTRTexture.onPress.connect((btn) => this.onBtnPress(btn?.value || 0))
    this.addChild(this.btnTRTexture)

    this.btnBLTexture = new LargeNumberButton(
      themeManager.getLowIntervalNeg(),
      userSettings.lowInterval * -1,
    )
    this.btnBLTexture.onPress.connect((btn) => this.onBtnPress(btn?.value || 0))
    this.addChild(this.btnBLTexture)

    this.btnBRTexture = new LargeNumberButton(
      themeManager.getHighIntervalNeg(),
      userSettings.highInterval * -1,
    )
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
    super.resize(width, height)
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
    if (!this.isAnimating && !this.isPaused) {
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
      this.text.text = formatNumber(this.nextIncrement)
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

  private pause(isPaused = true) {
    this.isPaused = isPaused
    gsap.to(
      [
        this.btnTLTexture,
        this.btnTRTexture,
        this.btnBLTexture,
        this.btnBRTexture,
      ],
      {
        alpha: isPaused ? 0 : 1,
        duration: 0.4,
      },
    )
  }

  public win() {
    this.pause()
  }

  public lost() {
    this.pause()
  }

  public async reset() {
    this.currentScore = userSettings.initialScore
    await this.score.setScore(userSettings.initialScore, false)
    this.pause(false)
    this.filters = []
  }
}
