import { DisplayObject } from 'pixi.js'
import { IResize } from './IResize'

export interface IBackground extends DisplayObject, IResize {
  pause(isPaused: boolean): void
}
