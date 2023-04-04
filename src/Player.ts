import {
  Assets,
  Container,
  Graphics,
  Rectangle,
  SCALE_MODES,
  Sprite,
  Texture,
} from 'pixi.js'
import { FancyButton } from '@pixi/ui'
import { Score } from './ui/Score'
import { Background } from './ui/Background'

const increments = [1, 5]

export class Player extends Container {
  public readonly num: number

  private rectangle: Graphics

  private buttons: FancyButton[] = []

  private texture: Texture

  public onLost?: (player: Player) => void

  private currentScore = 0
  private score: Score
  private bg: Background

  constructor(num: number) {
    super()
    this.num = num

    this.texture = Assets.cache.get('btns.png')
    this.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST

    const btn1Texture = new Texture(
      this.texture.baseTexture,
      new Rectangle(0, 0, 16, 16),
    )
    const btn5Texture = new Texture(
      this.texture.baseTexture,
      new Rectangle(16, 0, 16, 16),
    )
    this.rectangle = new Graphics()
    this.addChild(this.rectangle)

    this.bg = new Background()
    this.addChild(this.bg)
    setTimeout(() => {
      // @ts-ignore TS2345
      this.emit('lost', this)
    }, Math.random() * 6000)

    this.score = new Score()
    this.addChild(this.score)

    for (let i = 0; i < 2; i++) {
      const button = new FancyButton({
        defaultView: Sprite.from(i === 0 ? btn1Texture : btn5Texture),
        anchor: 0.5,
        animations: {
          pressed: {
            props: {
              scale: {
                x: 0.9,
                y: 0.9,
              },
            },
            duration: 100,
          },
        },
      })

      button.onPress.connect(() => {
        this.currentScore = this.currentScore + increments[i]
        this.score.setScore(this.currentScore)
      })

      this.buttons.push(button)

      this.addChild(this.buttons[i])
    }
  }

  public resize(width: number, height: number) {
    this.rectangle.clear()
    this.rectangle.beginFill(0xff >> (this.num * 2), 0.5)
    this.rectangle.drawRect(5, 5, width - 10, height - 10)

    this.bg.resize(width, height)
    this.score.resize(width, height * 0.5)

    for (let i = 0; i < 2; i++) {
      this.buttons[i].width = width / 2
      this.buttons[i].height = height / 4
      this.buttons[i].x = (width / 4) * (i * 2 + 1)
      this.buttons[i].y = (height / 4) * 3 + height / 8
    }
  }
}
