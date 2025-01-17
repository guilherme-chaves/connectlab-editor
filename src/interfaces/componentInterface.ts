import Vector2 from '@connectlab-editor/types/vector2';
import {VectorObject} from '@connectlab-editor/types/common';
import {ComponentType} from '@connectlab-editor/types/enums';
import Collision from '@connectlab-editor/interfaces/collisionInterface';

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
