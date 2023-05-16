import { Container, Rectangle } from 'pixi.js'
import { IResize } from './IResize'

export class ResizeContainer extends Container implements IResize {
  private _innerSize: Rectangle = new Rectangle()

  public resize(width: number, height: number) {
    this._innerSize.width = width
    this._innerSize.height = height
  }

  public get innerWidth(): number {
    return this._innerSize.width
  }

  public get innerHeight(): number {
    return this._innerSize.height
  }

  public get innerSize(): Rectangle {
    return this._innerSize
  }
}
