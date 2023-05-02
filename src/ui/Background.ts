import { Color, Graphics } from 'pixi.js'
import { app } from '../main'
import { ResizeContainer } from './ResizeContainer'

const nbStars = 100
const maxSpeed = 3

interface Star {
  speed: number
  graphic: Graphics
}

export class Background extends ResizeContainer {
  private stars: Star[]

  constructor() {
    super()
    this.stars = new Array(nbStars) as Star[]
    for (let i = 0; i < nbStars; i++) {
      const speed =
        maxSpeed - Math.floor(Math.log(Math.random() * Math.exp(maxSpeed) + 1))
      const graphic = new Graphics()
      graphic.beginFill(
        new Color({ h: 0, s: 0, l: (100 / maxSpeed) * speed }).toHex(),
      )
      graphic.drawRect(0, 0, speed * 2, speed * 2)
      graphic.endFill()
      graphic.angle = Math.random() * 360

      this.stars[i] = {
        speed,
        graphic,
      }

      this.addChild(graphic)
    }
  }

  public resize(width: number, height: number) {
    super.resize(width, height)

    for (let i = 0; i < nbStars; i++) {
      this.stars[i].graphic.x = Math.random() * width
      this.stars[i].graphic.y = Math.random() * height
    }
  }

  updateTransform(): void {
    super.updateTransform()
    const delta = app.ticker.deltaTime
    for (let i = 0; i < nbStars; i++) {
      const g = this.stars[i].graphic
      g.y = g.y + Math.floor(this.stars[i].speed * delta)
      g.angle += 0.5 * delta
      if (g.y > this.innerHeight) {
        g.y = 0
        g.x = Math.random() * this.innerWidth
      }
    }
  }
}
