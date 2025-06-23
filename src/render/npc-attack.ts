import { type Coords, Direction, type NpcMapInfo } from 'eolib';
import { setNpcRectangle, Rectangle } from '../collision';
import {
  ATTACK_TICKS,
  ATTACK_ANIMATION_FRAMES,
  WALK_WIDTH_FACTOR,
  WALK_HEIGHT_FACTOR,
} from '../consts';
import { HALF_GAME_WIDTH, HALF_GAME_HEIGHT, GAME_WIDTH } from '../game-state';
import { getBitmapById, GfxType } from '../gfx';
import type { NPCMetadata } from '../utils/get-npc-metadata';
import { isoToScreen } from '../utils/iso-to-screen';
import type { Vector2 } from '../vector';
import { NpcAnimation } from './npc-base-animation';

export class NpcAttackAnimation extends NpcAnimation {
  direction: Direction;
  animationFrame = 0;
  attackOffset = { x: 0, y: 0 };
  coords: Coords;

  constructor(coords: Coords, direction: Direction) {
    super();
    this.ticks = ATTACK_TICKS;
    this.direction = direction;
    this.coords = coords;
  }

  tick() {
    if (this.ticks === 0) {
      return;
    }

    const walkFrame = Math.abs(this.ticks - ATTACK_TICKS) + 1;
    this.animationFrame = (this.animationFrame + 1) % ATTACK_ANIMATION_FRAMES;
    this.attackOffset = {
      [Direction.Up]: {
        x: WALK_WIDTH_FACTOR * walkFrame,
        y: -WALK_HEIGHT_FACTOR * walkFrame,
      },
      [Direction.Down]: {
        x: -WALK_WIDTH_FACTOR * walkFrame,
        y: WALK_HEIGHT_FACTOR * walkFrame,
      },
      [Direction.Left]: {
        x: -WALK_WIDTH_FACTOR * walkFrame,
        y: -WALK_HEIGHT_FACTOR * walkFrame,
      },
      [Direction.Right]: {
        x: WALK_WIDTH_FACTOR * walkFrame,
        y: WALK_HEIGHT_FACTOR * walkFrame,
      },
    }[this.direction];
    this.ticks = Math.max(this.ticks - 1, 0);
  }

  render(
    graphicId: number,
    npc: NpcMapInfo,
    meta: NPCMetadata,
    playerScreen: Vector2,
    ctx: CanvasRenderingContext2D,
  ) {
    const downRight = [Direction.Down, Direction.Right].includes(
      this.direction,
    );
    const frame = this.animationFrame + 1;
    const offset = downRight ? frame + 4 : frame + 8;

    const bmp = getBitmapById(GfxType.NPC, (graphicId - 1) * 40 + offset);
    if (!bmp) {
      return;
    }

    const screenCoords = isoToScreen(this.coords);
    const mirrored = [Direction.Right, Direction.Up].includes(this.direction);
    const screenX = Math.floor(
      screenCoords.x -
        bmp.width / 2 -
        playerScreen.x +
        HALF_GAME_WIDTH +
        this.attackOffset.x,
    );

    const screenY =
      screenCoords.y -
      (bmp.height - 23) -
      playerScreen.y +
      HALF_GAME_HEIGHT +
      this.attackOffset.y;

    if (mirrored) {
      ctx.save(); // Save the current context state
      ctx.translate(GAME_WIDTH, 0); // Move origin to the right edge
      ctx.scale(-1, 1); // Flip horizontally
    }

    const drawX = Math.floor(
      mirrored
        ? GAME_WIDTH - screenX - bmp.width + meta.xOffset
        : screenX + meta.xOffset,
    );
    const drawY = Math.floor(screenY - meta.yOffset);

    ctx.drawImage(bmp, drawX, drawY);

    setNpcRectangle(
      npc.index,
      new Rectangle({ x: screenX, y: drawY }, bmp.width, bmp.height),
    );

    if (mirrored) {
      ctx.restore();
    }
  }
}
