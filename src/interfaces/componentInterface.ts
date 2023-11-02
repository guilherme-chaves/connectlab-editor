import Vector2 from '../types/Vector2';
import ComponentType from '../types/types';
import Collision from './collisionInterface';

export default interface Component {
  readonly id: number;
  position: Vector2;
  readonly componentType: ComponentType;
  collisionShape: Collision | Array<Collision>;
  move(v: Vector2): void;
  draw(ctx: CanvasRenderingContext2D): void;
}