import { formatNumber } from '../utils/strings'
import { LargeButton } from './LargeButton'

export class LargeNumberButton extends LargeButton {
  public value: number

  constructor(image: string, value: number) {
    super(image, formatNumber(value))
    this.value = value
  }
}
