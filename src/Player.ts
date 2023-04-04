import {
  Container,
  Graphics,
  Rectangle,
  SCALE_MODES,
  Sprite,
  Text,
  TextStyle,
  Texture,
} from 'pixi.js'
import { FancyButton } from '@pixi/ui'
import gsap from 'gsap'
import { app } from './main'

const increments = [1, 5]

export class Player extends Container {
  public readonly num: number
  private image: Sprite
  private rectangle: Graphics
  private text: Text
  private buttons: FancyButton[] = []

  private texture: Texture

  public onLost?: (player: Player) => void

  private score = 0
  private animatedScore = 0

  constructor(num: number) {
    super()
    this.num = num

    this.texture = Texture.from('assets/btns.png')
    this.texture.baseTexture.scaleMode = SCALE_MODES.NEAREST

    const btn1Texture = new Texture(
      this.texture.baseTexture,
      new Rectangle(0, 0, 16, 16),
    )
    const btn5Texture = new Texture(
      this.texture.baseTexture,
      new Rectangle(16, 0, 16, 16),
    )

    this.image = Sprite.from('assets/clampy.png')
    this.image.anchor.set(0.5)
    this.image.angle = 180 * num

    this.rectangle = new Graphics()
    // this.addChild(this.rectangle)

    this.addChild(this.image)
    setTimeout(() => {
      // @ts-ignore TS2345
      this.emit('lost', this)
    }, Math.random() * 6000)

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 30,
      fontStyle: 'italic',
      fontWeight: 'bold',
      fill: ['#ffffff', '#00ff99'], // gradient
      stroke: '#4a1850',
      strokeThickness: 5,
      dropShadow: true,
      dropShadowColor: '#000000',
      dropShadowBlur: 4,
      dropShadowAngle: Math.PI / 6,
      dropShadowDistance: 6,
      wordWrap: true,
      wordWrapWidth: 440,
      lineJoin: 'round',
    })
    this.text = new Text(this.score, style)
    this.text.anchor.set(0.5)
    this.text.y = 100
    this.addChild(this.text)

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

      button.onPress.connect(() => this.setScore(this.score + increments[i]))

      this.buttons.push(button)

      this.addChild(this.buttons[i])
    }
  }

  public resize(width: number, height: number) {
    this.rectangle.clear()
    this.rectangle.beginFill(0xff >> (this.num * 2))
    this.rectangle.drawRect(5, 5, width - 10, height - 10)

    const ratio = width / this.image.texture.width
    this.image.scale.set(Math.min(ratio / 2, 1))
    this.image.position.x = width * 0.5
    this.image.position.y = height * 0.5

    this.text.x = width / 2
    this.text.style.fontSize = Math.min(width / 3, 150)
    for (let i = 0; i < 2; i++) {
      this.buttons[i].width = width / 2
      this.buttons[i].height = height / 4
      this.buttons[i].x = (width / 4) * (i * 2 + 1)
      this.buttons[i].y = (height / 4) * 3 + height / 8
    }
  }

  /** Set the score and play the scores animation */
  public setScore(value: number) {
    if (this.score === value) return
    this.score = value
    this.playScores().catch((err) => {
      console.error(err)
    })
  }

  updateTransform(): void {
    super.updateTransform()
    const delta = app.ticker.deltaTime
    this.image.angle += delta * 0.8
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
