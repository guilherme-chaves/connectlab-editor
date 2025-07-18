import Vector2i from '@connectlab-editor/types/vector2i';
import {VectorObject} from '@connectlab-editor/types/common';
import {ComponentType, EditorEvents} from '@connectlab-editor/types/enums';
import Collision from '@connectlab-editor/interfaces/collisionInterface';

export interface ComponentObject {
  readonly id: number;
  readonly componentType: ComponentType;
  readonly position: VectorObject;
}

export default interface Component {
  readonly id: number;
  position: Vector2i;
  readonly componentType: ComponentType;
  collisionShape: Collision | Array<Collision>;
  selected: boolean;
  move(v: Vector2i, useDelta: boolean): void;
  draw(ctx: CanvasRenderingContext2D): void;
  onEvent(ev: EditorEvents): boolean;
  toObject(): ComponentObject;
}
