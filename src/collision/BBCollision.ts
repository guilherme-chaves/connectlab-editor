import Position from '../types/Position';
import CollisionShape from './CollisionShape';

export default class BBCollision extends CollisionShape {
  constructor(
    position: Position,
    offset: Position,
    width: number,
    height: number,
    color?: string
  ) {
    super();
    this.parentPosition = position
    this.a = offset;
    this.b = new Position(width, height);
    this.color = color ?? this.color;
    this.drawPath = this.generatePath();
  }

  public generatePath(): Path2D {
    const path = new Path2D();
    const pos = this.a.add(this.parentPosition)
    path.rect(pos.x, pos.y, this.b.x, this.b.y);
    return path;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean) {
    super.draw(ctx, selected);
  }

  moveShape(delta: Position, useDelta: boolean = true): void {
    if (useDelta) this.parentPosition = this.parentPosition.add(delta);
    else this.parentPosition = delta
    this.drawPath = this.generatePath();
  }

  collisionWithPoint(point: Position): boolean {
    const pos = this.parentPosition.add(this.a)
    const b = this.b.add(pos);
    const topLeft = new Position(
      pos.x < b.x ? pos.x : b.x,
      pos.y < b.y ? pos.y : b.y
    )
    const bottomRight = new Position(
      b.x > pos.x ? b.x : pos.x,
      b.y > pos.y ? b.y : pos.y
    )
    return (
      point.x > topLeft.x && point.x < bottomRight.x && point.y > topLeft.y && point.y < bottomRight.y
    );
  }
}
