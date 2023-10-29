import CollisionShape from './CollisionShape';
import Vector2 from '../types/Vector2';

export default class CircleCollision extends CollisionShape {
  public radius: number;
  public radiusSq: number;

  constructor(
    position: Vector2,
    offset: Vector2,
    radius: number,
    color?: string
  ) {
    super();
    this.parentPosition = position;
    this.a = offset;
    this.radius = radius;
    this.radiusSq = radius * radius;
    this.color = color ?? this.color;
    this.drawPath = this.generatePath();
  }

  protected generatePath(): Path2D {
    const path = new Path2D();
    const pos = this.parentPosition.add(this.a);
    path.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
    return path;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean): void {
    if (!selected) return;
    const oldStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = this.color;
    ctx.stroke(this.drawPath);
    ctx.strokeStyle = oldStrokeStyle;
  }

  moveShape(v: Vector2, useDelta = true): void {
    if (useDelta) this.parentPosition.add(v);
    else this.parentPosition = v;
    this.drawPath = this.generatePath();
  }

  collisionWithPoint(point: Vector2): boolean {
    const pos = this.parentPosition.add(this.a);
    return pos.sub(point).magSq() < this.radiusSq;
  }
}
