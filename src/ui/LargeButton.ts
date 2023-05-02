import { FancyButton } from '@pixi/ui'
import { BitmapText, Sprite, Texture } from 'pixi.js'

export class LargeButton extends FancyButton {
  constructor(image: string, text: string) {
    const defaultView = new Sprite(Texture.from(image))
    super({
      defaultView,
      anchor: 0.5,
      text: new BitmapText(text, {
        fontName: 'Unlearned BRK',
        fontSize: 15,
        tint: 0x003eaa,
      }),
      padding: 5,
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
  }
}
