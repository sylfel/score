import { AnimatedSprite, Texture } from 'pixi.js'

export class Fx extends AnimatedSprite {
  constructor(name: string) {
    const textureArray = []
    const numberFormat = new Intl.NumberFormat('en', {
      minimumIntegerDigits: 4,
      minimumFractionDigits: 0,
      useGrouping: false,
    })
    for (let i = 0; i <= 15; i++) {
      const textureName = `${name}/frame${numberFormat.format(i)}`
      const texture = Texture.from(textureName)
      if (texture.valid) {
        textureArray.push(texture)
      }
    }

    super(textureArray)
    this.loop = false
    this.animationSpeed = 0.15
  }
}
