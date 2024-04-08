import BBCollision from '@connectlab-editor/collisionShapes/BBCollision';
import CircleCollision from '@connectlab-editor/collisionShapes/CircleCollision';
import Vector2 from '@connectlab-editor/types/Vector2';

export default interface Collision {
  position: Vector2;
  borderColor: string;
  draw(ctx: CanvasRenderingContext2D, isSelected: boolean): void;
  moveShape(v: Vector2, isDeltaVector: boolean): void;
  collisionWithPoint(point: Vector2): boolean;
  collisionWithAABB(other: BBCollision): boolean;
  collisionWithCircle(other: CircleCollision): boolean;
}
