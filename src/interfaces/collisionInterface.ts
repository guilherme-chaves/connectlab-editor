import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import CircleCollision from '@connectlab-editor/collisionShapes/circleCollision';
import Vector2 from '@connectlab-editor/types/vector2';

export default interface Collision {
  position: Vector2;
  borderColor: string;
  draw(ctx: CanvasRenderingContext2D, isSelected: boolean): void;
  moveShape(v: Vector2, isDeltaVector: boolean): void;
  collisionWithPoint(point: Vector2): boolean;
  collisionWithBox(other: BoxCollision): boolean;
  collisionWithCircle(other: CircleCollision): boolean;
  collisionWithLine(p1: Vector2, p2: Vector2): boolean;
}
