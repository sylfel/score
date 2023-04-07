import { Container, Graphics } from 'pixi.js'
import { Score } from './ui/Score'
import { Background } from './ui/Background'
import { LargeButton } from './ui/LargeButton'

const nbRow = 12
const heightBtn = nbRow / 2
const ratioY1 = (nbRow - 3) / nbRow
const ratioY2 = (nbRow - 1) / nbRow

export class Player extends Container {
  public readonly num: number

  private rectangle: Graphics

  public onLost?: (player: Player) => void

  private currentScore = 0
  private score: Score
  private bg: Background

  private btnTLTexture: LargeButton
  private btnTRTexture: LargeButton
  private btnBLTexture: LargeButton
  private btnBRTexture: LargeButton

  constructor(num: number) {
    super()
    this.num = num

    this.bg = new Background()
    this.addChild(this.bg)

    this.rectangle = new Graphics()
    this.addChild(this.rectangle)

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

    this.score = new Score()
    this.addChild(this.score)

    setTimeout(() => {
      // @ts-ignore TS2345
      this.emit('lost', this)
    }, Math.random() * 6000)
  }

  public resize(width: number, height: number) {
    this.rectangle.clear()
    this.rectangle.beginFill(0xff >> (this.num * 2), 0.2)
    this.rectangle.drawRect(5, 5, width - 10, height - 10)

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
  }

  private onBtnPress(increment: number): void {
    this.currentScore = this.currentScore + increment
    this.score.setScore(this.currentScore)
  }
}
