import { Player } from './Player'
import { ResizeContainer } from './ui/ResizeContainer'
import { LargeButton } from './ui/LargeButton'
import { themeManager } from './ThemeManager'
import { IBackground } from './ui/IBackground'

const nbGamer = 2

export class Game extends ResizeContainer {
  private players: Player[] = []
  private resetBtn: LargeButton
  private bg: IBackground

  constructor() {
    super()

    for (let i = 0; i < nbGamer; i++) {
      const player = new Player(i)
      // @ts-ignore TS2345
      player.on('lost', (player: Player) => this.onLost(player))
      this.players.push(player)
      this.addChild(player)
    }

    this.bg = themeManager.getBackground()
    this.addChild(this.bg)

    this.resetBtn = new LargeButton(themeManager.getResetBtn(), 'Reset')
    this.resetBtn.anchor.set(0.5)
    this.resetBtn.onPress.connect(() => this.onReset())
  }

  public resize(width: number, height: number) {
    super.resize(width, height)
    this.bg.resize(width, height)
    const playerWidth = Math.floor(width / nbGamer)
    for (let i = 0; i < nbGamer; i++) {
      this.players[i].position.x = i * playerWidth
      this.players[i].resize(playerWidth, height)
    }
    this.resetBtn.width = width * 0.6
    this.resetBtn.height = height * 0.2
    this.resetBtn.x = width * 0.5
    this.resetBtn.y = height * 0.7
  }

  private onLost(playerLost: Player) {
    for (let i = 0; i < nbGamer; i++) {
      const player = this.players[i]
      if (player === playerLost) {
        player.lost()
      } else {
        player.win()
      }
    }
    this.bg.pause(true)
    this.addChild(this.resetBtn)
  }

  private onReset() {
    const promises = [] as Promise<void>[]
    for (let i = 0; i < nbGamer; i++) {
      promises.push(this.players[i].reset())
    }
    void Promise.all(promises).then(() => {
      this.bg.pause(false)
      this.removeChild(this.resetBtn)
    })
  }
}
