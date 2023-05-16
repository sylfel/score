import { Rectangle } from 'pixi.js'

export interface IResize {
  resize(width: number, height: number): void

  get innerSize(): Rectangle
}
