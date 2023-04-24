import { FancyButton } from '@pixi/ui'
import { Sprite, Texture } from 'pixi.js'

export class LargeButton extends FancyButton {
  public value: number

  constructor(image: string, value: number) {
    const t = Texture.from(image)
    const defaultView = new Sprite(t)
    super({
      defaultView,
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
    this.value = value
  }
}
