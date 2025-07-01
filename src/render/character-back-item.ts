import { type CharacterMapInfo, Direction, Gender, SitState } from 'eolib';
import { CharacterAction } from '../client';
import { getCharacterRectangle } from '../collision';
import { GAME_WIDTH } from '../game-state';
import { GfxType, getBitmapById } from '../gfx';
import type { Vector2 } from '../vector';

const MALE_STANDING_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

const FEMALE_STANDING_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

const FEMALE_WALKING_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

const MALE_WALKING_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

const FEMALE_ATTACK_OFFSETS = [
  {
    [Direction.Up]: { x: 0, y: 0 },
    [Direction.Down]: { x: 0, y: 0 },
    [Direction.Left]: { x: 0, y: 0 },
    [Direction.Right]: { x: 0, y: 0 },
  },
  {
    [Direction.Up]: { x: 0, y: 0 },
    [Direction.Down]: { x: 0, y: 0 },
    [Direction.Left]: { x: 0, y: 0 },
    [Direction.Right]: { x: 0, y: 0 },
  },
];

const MALE_ATTACK_OFFSETS = [
  {
    [Direction.Up]: { x: 0, y: 0 },
    [Direction.Down]: { x: 0, y: 0 },
    [Direction.Left]: { x: 0, y: 0 },
    [Direction.Right]: { x: 0, y: 0 },
  },
  {
    [Direction.Up]: { x: 0, y: 0 },
    [Direction.Down]: { x: 0, y: 0 },
    [Direction.Left]: { x: 0, y: 0 },
    [Direction.Right]: { x: 0, y: 0 },
  },
];

const FEMALE_RANGE_ATTACK_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

const MALE_RANGE_ATTACK_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

const MALE_SIT_FLOOR_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

const FEMALE_SIT_FLOOR_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

const MALE_SIT_CHAIR_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

const FEMALE_SIT_CHAIR_OFFSETS = {
  [Direction.Up]: { x: 0, y: 0 },
  [Direction.Down]: { x: 0, y: 0 },
  [Direction.Left]: { x: 0, y: 0 },
  [Direction.Right]: { x: 0, y: 0 },
};

export function renderCharacterBackItem(
  character: CharacterMapInfo,
  ctx: CanvasRenderingContext2D,
  animationFrame: number,
  action: CharacterAction,
) {
  if (character.equipment.armor <= 0) {
    return;
  }

  const directionalOffset = [Direction.Down, Direction.Up].includes(
    character.direction,
  )
    ? 0
    : 1;
  const baseGfxId = (character.equipment.shield - 1) * 50;
  const offset = directionalOffset + 1;

  const bmp = getBitmapById(
    character.gender === Gender.Female ? GfxType.FemaleBack : GfxType.MaleBack,
    baseGfxId + offset,
  );

  if (!bmp) {
    return;
  }

  const rect = getCharacterRectangle(character.playerId);
  if (!rect) {
    return;
  }

  let screenX = Math.floor(rect.position.x + rect.width / 2 - bmp.width / 2);

  let screenY = Math.floor(
    rect.position.y + rect.height / 2 - 13 * (bmp.height / 16),
  );

  const { direction, gender, sitState } = character;

  let additionalOffset: Vector2;
  switch (true) {
    case action === CharacterAction.Walking:
      additionalOffset =
        gender === Gender.Female
          ? FEMALE_WALKING_OFFSETS[direction]
          : MALE_WALKING_OFFSETS[direction];
      break;
    case action === CharacterAction.MeleeAttack:
      additionalOffset =
        gender === Gender.Female
          ? FEMALE_ATTACK_OFFSETS[animationFrame][direction]
          : MALE_ATTACK_OFFSETS[animationFrame][direction];
      break;
    case action === CharacterAction.RangedAttack:
      additionalOffset =
        gender === Gender.Female
          ? FEMALE_RANGE_ATTACK_OFFSETS[direction]
          : MALE_RANGE_ATTACK_OFFSETS[direction];
      break;
    case sitState === SitState.Floor:
      additionalOffset =
        gender === Gender.Female
          ? FEMALE_SIT_FLOOR_OFFSETS[direction]
          : MALE_SIT_FLOOR_OFFSETS[direction];
      break;
    case sitState === SitState.Chair:
      additionalOffset =
        gender === Gender.Female
          ? FEMALE_SIT_CHAIR_OFFSETS[direction]
          : MALE_SIT_CHAIR_OFFSETS[direction];
      break;
    default:
      additionalOffset =
        gender === Gender.Female
          ? FEMALE_STANDING_OFFSETS[direction]
          : MALE_STANDING_OFFSETS[direction];
      break;
  }

  screenX += additionalOffset.x;
  screenY += additionalOffset.y;

  const mirrored = [Direction.Right, Direction.Up].includes(
    character.direction,
  );

  if (mirrored) {
    ctx.save();
    ctx.translate(GAME_WIDTH, 0);
    ctx.scale(-1, 1);
  }

  const drawX = Math.floor(
    mirrored ? GAME_WIDTH - screenX - bmp.width : screenX,
  );

  const drawY = Math.floor(screenY);

  ctx.drawImage(bmp, drawX, drawY);

  if (mirrored) {
    ctx.restore();
  }
}
