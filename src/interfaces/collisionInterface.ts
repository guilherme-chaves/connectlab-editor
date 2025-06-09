import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import CircleCollision from '@connectlab-editor/collisionShapes/circleCollision';
import LineCollision from '@connectlab-editor/collisionShapes/lineCollision';
import Vector2 from '@connectlab-editor/types/vector2';

export default interface Collision {
  position: Vector2;
  borderColor: string;
  draw(ctx: CanvasRenderingContext2D, isSelected: boolean): void;
  moveShape(v: Vector2, isDeltaVector: boolean): void;
  collisionWithPoint(point: Vector2): boolean;
  collisionWithBox(other: BoxCollision): boolean;
  collisionWithCircle(other: CircleCollision): boolean;
  collisionWithLine(other: LineCollision): boolean;
}
