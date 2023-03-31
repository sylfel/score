import { Container, Graphics, Sprite, Text, TextStyle } from 'pixi.js'
import { app } from './main'

export class Player extends Container {
  public readonly num: number
  private image: Sprite
  private rectangle: Graphics
  private text: Text

  public onLost?: (player: Player) => void

  private score = 0
  private currentScore = 0

  constructor(num: number) {
    super()
    this.num = num
    this.image = Sprite.from('assets/clampy.png')
    this.image.anchor.set(0.5)
    this.image.angle = 180 * num

    this.rectangle = new Graphics()
    this.addChild(this.rectangle)

    this.addChild(this.image)
    setTimeout(() => {
      this.emit('lost', this)
    }, Math.random() * 6000)

    setTimeout(() => {
      this.score = Math.floor(Math.random() * 1000)
      console.log(this.num, this.score)
    }, Math.random() * 6000)

    const style = new TextStyle({
      fontFamily: 'Arial',
      fontSize: 200,
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
  }

  updateTransform(): void {
    super.updateTransform()
    const delta = app.ticker.deltaTime
    this.image.angle += delta * 0.8
    if (this.score > this.currentScore) {
      this.currentScore += 1
      this.text.text = this.currentScore
    }
  }
}
