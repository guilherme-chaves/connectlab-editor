import Collision from '../interfaces/collisionInterface';
import Vector2 from '../types/Vector2';
import BBCollision from './BBCollision';

export default class CircleCollision implements Collision {
  public position: Vector2;
  public readonly radius: number;
  private readonly radiusSquared: number;
  private drawPath: Path2D;
  public borderColor: string;

  constructor(position: Vector2, radius: number, borderColor = '#FF8008DC') {
    this.position = position;
    this.radius = radius;
    this.radiusSquared = radius * radius;
    this.borderColor = borderColor;
    this.drawPath = this.generatePath();
  }

  protected generatePath(): Path2D {
    const path = new Path2D();
    path.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    return path;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean): void {
    if (!selected) return;
    const oldStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = this.borderColor;
    ctx.stroke(this.drawPath);
    ctx.strokeStyle = oldStrokeStyle;
  }

  moveShape(v: Vector2, useDelta = true): void {
    if (useDelta) this.position.add(v);
    else Vector2.copy(v, this.position);
    this.drawPath = this.generatePath();
  }

  collisionWithPoint(point: Vector2): boolean {
    return Vector2.sub(this.position, point).lenSquared() < this.radiusSquared;
  }

  collisionWithAABB(other: BBCollision): boolean {
    let distance = 0;
    if (this.position.x < other.globalPoints.b.x)
      distance += Math.pow(other.globalPoints.b.x - this.position.x, 2);
    else if (this.position.x > other.globalPoints.a.x)
      distance += Math.pow(this.position.x - other.globalPoints.a.x, 2);

    if (this.position.y < other.globalPoints.b.y)
      distance += Math.pow(other.globalPoints.b.y - this.position.y, 2);
    else if (this.position.y > other.globalPoints.a.y)
      distance += Math.pow(this.position.y - other.globalPoints.a.y, 2);

    return distance < this.radiusSquared;
  }

  collisionWithCircle(other: CircleCollision): boolean {
    return (
      Vector2.sub(this.position, other.position).len() <
      this.radius + other.radius
    );
  }
}
