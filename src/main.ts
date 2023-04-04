import { Application } from 'pixi.js'
import { Game } from './Game'
import { initAssets } from './utils/assets'

/** The PixiJS app Application instance, shared across the project */
export const app = new Application<HTMLCanvasElement>({
  resolution: Math.max(window.devicePixelRatio, 2),
  backgroundColor: 0xffffff,
})

let game: Game

/** Set up a resize function for the app */
function resize() {
  const windowWidth = window.innerWidth
  const windowHeight = window.innerHeight
  const minWidth = 375
  const minHeight = 700

  // Calculate renderer and canvas sizes based on current dimensions
  const scaleX = windowWidth < minWidth ? minWidth / windowWidth : 1
  const scaleY = windowHeight < minHeight ? minHeight / windowHeight : 1
  const scale = scaleX > scaleY ? scaleX : scaleY
  const width = windowWidth * scale
  const height = windowHeight * scale

  // Update canvas style dimensions and scroll window up to avoid issues on mobile resize
  app.renderer.view.style.width = `${windowWidth}px`
  app.renderer.view.style.height = `${windowHeight}px`
  window.scrollTo(0, 0)

  // Update renderer and game dimensions
  app.renderer.resize(width, height)
  game?.resize(width, height)
}

/** Setup app and initialise assets */
async function init(): Promise<void> {
  // Add pixi canvas element (app.view) to the document's body
  document.body.appendChild(app.view)
  await initAssets()
  // Whenever the window resizes, call the 'resize' function
  window.addEventListener('resize', resize)
  game = new Game()

  resize()
  app.stage.addChild(game)
}

// Init everything
void init()
