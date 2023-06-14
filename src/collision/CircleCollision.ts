import CollisionShape from './CollisionShape';
import Position from '../types/Position';

export default class CircleCollision extends CollisionShape {
  public radius: number;
  public radiusSq: number;
  protected drawPath: Path2D;

  constructor(position: Position, offset: Position, radius: number, color?: string) {
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
    const pos = this.parentPosition.add(this.a)
    path.arc(pos.x, pos.y, this.radius, 0, Math.PI * 2);
    return path;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean): void {
    if (!selected) return;
    ctx.beginPath();
    const oldStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = this.color;
    ctx.stroke(this.drawPath);
    ctx.strokeStyle = oldStrokeStyle;
    ctx.closePath();
  }

  moveShape(delta: Position, useDelta: boolean = true): void {
    if (useDelta) this.parentPosition.add(delta);
    else this.parentPosition = delta
    this.drawPath = this.generatePath();
  }

  collisionWithPoint(point: Position): boolean {
    const pos = this.parentPosition.add(this.a)
    return pos.minus(point).magSq() < this.radiusSq;
  }
}
