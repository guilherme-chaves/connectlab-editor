import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import CircleCollision from '@connectlab-editor/collisionShapes/circleCollision';
import LineCollision from '@connectlab-editor/collisionShapes/lineCollision';
import Vector2i from '@connectlab-editor/types/vector2i';

export default interface Collision {
  position: Vector2i;
  borderColor: string;
  draw(ctx: CanvasRenderingContext2D, isSelected: boolean): void;
  moveShape(v: Vector2i, isDeltaVector: boolean): void;
  collisionWithPoint(point: Vector2i): boolean;
  collisionWithBox(other: BoxCollision): boolean;
  collisionWithCircle(other: CircleCollision): boolean;
  collisionWithLine(other: LineCollision): boolean;
}
