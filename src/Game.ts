import { Container } from "pixi.js";
import { Player } from "./Player"

const nbGamer = 2;

export class Game extends Container {
    public players: Player[] = [];

    constructor() {
        super()

        for (let i = 0; i < nbGamer; i++) {
            let player = new Player(i)
            // @ts-ignore
            player.on('lost', this.onLost)
            player.position.y = 0
            this.players.push(player)
            this.addChild(player)
        }
    }

    public resize(width: number, height: number) {
        const playerWidth = Math.floor(width / nbGamer)
        for (let i = 0; i < nbGamer; i++) {
            this.players[i].position.x = i * playerWidth
            this.players[i].resize(playerWidth, height)
        }
    }

    private onLost(player: Player) {
        console.log('someone lost ...', player.num, this)
    }
}