import { FancyButton } from '@pixi/ui'
import { BitmapText, Sprite, Texture } from 'pixi.js'
import { formatNumber } from '../utils/strings'

export class LargeButton extends FancyButton {
  public value: number
  private bitmapFontText: BitmapText

  constructor(image: string, value: number) {
    const defaultView = new Sprite(Texture.from(image))
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
    this.bitmapFontText = new BitmapText(formatNumber(value), {
      fontName: 'Unlearned BRK',
      fontSize: 15,
    })
    this.bitmapFontText.tint = 0x003eaa
    this.bitmapFontText.anchor.set(0.5)
    this.addChild(this.bitmapFontText)
  }
}
