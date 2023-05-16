import { Background } from './ui/Background'
import { IBackground } from './ui/IBackground'

class ThemeManager {
  getResetBtn(): string {
    return 'btn'
  }
  getLowIntervalPos(): string {
    return 'btns_1'
  }
  getHighIntervalPos(): string {
    return 'btns_2'
  }
  getLowIntervalNeg(): string {
    return 'btns_3'
  }
  getHighIntervalNeg(): string {
    return 'btns_4'
  }

  getBackground(): IBackground {
    return new Background()
  }
}

export const themeManager = new ThemeManager()
