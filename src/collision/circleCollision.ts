import Collision from '@connectlab-editor/interfaces/collisionInterface';
import Vector2i from '@connectlab-editor/types/vector2i';
import BoxCollision from '@connectlab-editor/collisionShapes/boxCollision';
import LineCollision from '@connectlab-editor/collisionShapes/lineCollision';

export default class CircleCollision implements Collision {
  public position: Vector2i;
  public readonly radius: number;
  private readonly radiusSquared: number;
  private drawPath: Path2D | undefined;
  private regenPath: boolean;
  public borderColor: string;

  constructor(position: Vector2i, radius: number, borderColor = '#FF8008DC') {
    this.position = position;
    this.radius = radius;
    this.radiusSquared = radius * radius;
    this.borderColor = borderColor;
    this.regenPath = false;
  }

  protected generatePath(): Path2D {
    const path = new Path2D();
    path.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    this.regenPath = false;
    return path;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean): void {
    if (!selected) return;
    if (!this.drawPath || this.regenPath) this.drawPath = this.generatePath();
    ctx.save();
    ctx.strokeStyle = this.borderColor;
    ctx.stroke(this.drawPath);
    ctx.restore();
  }

  moveShape(v: Vector2i, useDelta = true): void {
    if (useDelta) this.position.add(v);
    else this.position.copy(v);
    this.drawPath = this.generatePath();
  }

  collisionWithPoint(point: Vector2i): boolean {
    return Vector2i.sub(this.position, point).lenSquared() < this.radiusSquared;
  }

  collisionWithBox(other: BoxCollision): boolean {
    // Centro do círculo dentro do retângulo
    if (other.collisionWithPoint(this.position)) return true;

    const closestRectPoint = Vector2i.max(
      other.vertices.a,
      Vector2i.min(other.vertices.c, this.position),
    );

    const distSquared = Vector2i.sub(
      this.position,
      closestRectPoint,
    ).lenSquared();

    return distSquared < this.radiusSquared;
  }

  collisionWithCircle(other: CircleCollision): boolean {
    return (
      Vector2i.sub(this.position, other.position).len()
      < this.radius + other.radius
    );
  }

  collisionWithLine(other: LineCollision): boolean {
    return other.collisionWithCircle(this);
  }
}
