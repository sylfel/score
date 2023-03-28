import { Application, Sprite } from 'pixi.js'

const app = new Application({
  view: document.getElementById("pixi-canvas") as HTMLCanvasElement,
  resolution: window.devicePixelRatio || 1,
  autoDensity: true,
  backgroundColor: 0x6495ed,
  width: 640,
  height: 480
});

const clampy: Sprite = Sprite.from("assets/clampy.png");

clampy.anchor.set(0.5);

clampy.x = app.screen.width / 2;
clampy.y = app.screen.height / 2;
clampy.scale.x = 0.5
clampy.scale.y = 0.5

app.stage.addChild(clampy);

app.ticker.add((delta: number) => {
  clampy.rotation += 0.02 * delta
})
