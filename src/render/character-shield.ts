import { type CharacterMapInfo, Direction, Gender } from 'eolib';
import { CharacterAction } from '../client';
import { getCharacterRectangle } from '../collision';
import { GAME_WIDTH } from '../game-state';
import { GfxType, getBitmapById } from '../gfx';
import { getShieldMetadata } from '../utils/get-shield-metadata';

const _OFFSETS = {
  [`${Gender.Male}_${CharacterAction.Walking}_${Direction.Up}`]: { x: 0, y: 0 },
  [`${Gender.Male}_${CharacterAction.Walking}_${Direction.Down}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.Walking}_${Direction.Left}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.Walking}_${Direction.Right}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.MeleeAttack}_${Direction.Up}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.MeleeAttack}_${Direction.Down}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.MeleeAttack}_${Direction.Left}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.MeleeAttack}_${Direction.Right}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.RangedAttack}_${Direction.Up}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.RangedAttack}_${Direction.Down}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.RangedAttack}_${Direction.Left}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.RangedAttack}_${Direction.Right}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.CastingSpell}_${Direction.Up}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.CastingSpell}_${Direction.Down}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.CastingSpell}_${Direction.Left}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Male}_${CharacterAction.CastingSpell}_${Direction.Right}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.RangedAttack}_${Direction.Up}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.Walking}_${Direction.Up}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.Walking}_${Direction.Down}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.Walking}_${Direction.Left}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.Walking}_${Direction.Right}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.MeleeAttack}_${Direction.Up}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.MeleeAttack}_${Direction.Down}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.MeleeAttack}_${Direction.Left}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.MeleeAttack}_${Direction.Right}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.RangedAttack}_${Direction.Down}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.RangedAttack}_${Direction.Left}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.RangedAttack}_${Direction.Right}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.CastingSpell}_${Direction.Up}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.CastingSpell}_${Direction.Down}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.CastingSpell}_${Direction.Left}`]: {
    x: 0,
    y: 0,
  },
  [`${Gender.Female}_${CharacterAction.CastingSpell}_${Direction.Right}`]: {
    x: 0,
    y: 0,
  },
};

export function renderCharacterShield(
  character: CharacterMapInfo,
  ctx: CanvasRenderingContext2D,
  _animationFrame: number,
  _action: CharacterAction,
) {
  if (character.equipment.shield <= 0) {
    return;
  }

  const shieldMetadata = getShieldMetadata().get(character.equipment.shield);
  const _isShieldOnBack = shieldMetadata?.isShieldOnBack ?? false;

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

  const screenX = rect.position.x;
  const screenY = rect.position.y;

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
