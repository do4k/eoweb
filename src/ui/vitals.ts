import { Rectangle } from "../collision";
import { getBitmapById, GfxType } from "../gfx";
import { Base } from "./base-ui";
import { Vector2 } from '../vector';

export class Vitals extends Base {

  private ctx: CanvasRenderingContext2D;
  private canvas: HTMLCanvasElement;

  private static readonly VITAL_WIDTH = 110;
  private static readonly VITAL_HEIGHT = 14;

  constructor() {
    super();
    this.canvas = document.createElement('canvas');
    this.canvas.width = Vitals.VITAL_WIDTH;
    this.canvas.height = Vitals.VITAL_HEIGHT;
    this.ctx = this.canvas.getContext('2d');
    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
  }

  render(now: DOMHighResTimeStamp, mainCanvasCtx: CanvasRenderingContext2D) {
    const bmp = getBitmapById(GfxType.PostLoginUI, 58);
    if (!bmp) {
      return;
    }

    const rect = new Rectangle(new Vector2(mainCanvasCtx.canvas.width / 2 - Vitals.VITAL_WIDTH / 2, 0), Vitals.VITAL_WIDTH, Vitals.VITAL_HEIGHT);
    this.drawVitalBar(bmp, 0, 0);
    this.drawVitalBar(bmp, 0, 1, Vitals.VITAL_WIDTH - 50);
    mainCanvasCtx.drawImage(this.canvas, rect.position.x, rect.position.y, rect.width, rect.height);
  }

  drawVitalBar(bmp: HTMLImageElement, xSpriteOffset: number, ySpriteOffset: number, spriteWidth: number = Vitals.VITAL_WIDTH) {
    const sx = xSpriteOffset * Vitals.VITAL_WIDTH;
    const sy = ySpriteOffset * Vitals.VITAL_HEIGHT;
    console.log(`Drawing vital bar at sprite offset (${sx}, ${sy}) with width ${spriteWidth}`);
    this.ctx.drawImage(
      bmp, 
      sx, 
      sy, 
      spriteWidth,
      Vitals.VITAL_HEIGHT, 
      0,
      0,
      spriteWidth,
      Vitals.VITAL_HEIGHT
    )
  }
}