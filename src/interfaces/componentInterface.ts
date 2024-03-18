import Vector2, {VectorObject} from '../types/Vector2';
import {ComponentType} from '../types/types';
import Collision from './collisionInterface';

export interface ComponentObject {
  readonly id: number;
  readonly componentType: ComponentType;
  readonly position: VectorObject;
}

export default interface Component {
  readonly id: number;
  position: Vector2;
  readonly componentType: ComponentType;
  collisionShape: Collision | Array<Collision>;
  selected: boolean;
  move(v: Vector2, useDelta: boolean): void;
  draw(ctx: CanvasRenderingContext2D): void;
  toObject(): ComponentObject;
}
