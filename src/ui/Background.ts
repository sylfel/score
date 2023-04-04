import { Assets, Container, Sprite } from 'pixi.js'
import { app } from '../main'

export class Background extends Container {
  private image: Sprite
  private speed: number

  constructor() {
    super()

    this.image = Sprite.from(Assets.cache.get('clampy.png'))
    this.image.anchor.set(0.5)
    this.image.angle = Math.random() * 360
    this.speed = Math.random() * 2 - 1

    this.addChild(this.image)
  }

  public resize(width: number, height: number) {
    const ratio = width / this.image.texture.width
    this.image.scale.set(Math.min(ratio / 2, 1))
    this.image.position.x = width * 0.5
    this.image.position.y = height * 0.5
  }

  updateTransform(): void {
    super.updateTransform()
    const delta = app.ticker.deltaTime
    this.image.angle += delta * this.speed
  }
}
