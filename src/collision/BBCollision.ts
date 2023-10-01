import Vector2 from '../types/Vector2';
import CollisionShape from './CollisionShape';

export default class BBCollision extends CollisionShape {
  private topLeft: Vector2;
  private bottomRight: Vector2;
  constructor(
    position: Vector2,
    offset: Vector2,
    width = 2,
    height = 2,
    color?: string
  ) {
    super();
    this.parentPosition = position;
    this.a = offset;
    this.b = new Vector2(width, height);
    this.color = color ?? this.color;
    this.drawPath = this.generatePath();
    this.topLeft = new Vector2(0, 0);
    this.bottomRight = new Vector2(0, 0);
    this.setAlignedBounds();
  }

  private setAlignedBounds() {
    const pos = this.parentPosition.add(this.a);
    const b = this.b.add(pos);
    this.topLeft = new Vector2(
      pos.x < b.x ? pos.x : b.x,
      pos.y < b.y ? pos.y : b.y
    );
    this.bottomRight = new Vector2(
      b.x > pos.x ? b.x : pos.x,
      b.y > pos.y ? b.y : pos.y
    );
  }

  public generatePath(): Path2D {
    const path = new Path2D();
    const pos = this.a.add(this.parentPosition);
    path.rect(pos.x, pos.y, this.b.x, this.b.y);
    return path;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean) {
    super.draw(ctx, selected);
  }

  moveShape(delta: Vector2, useDelta = true): void {
    if (useDelta) this.parentPosition = this.parentPosition.add(delta);
    else this.parentPosition = delta;
    this.drawPath = this.generatePath();
    this.setAlignedBounds();
  }

  collisionWithPoint(point: Vector2): boolean {
    return (
      point.x > this.topLeft.x &&
      point.x < this.bottomRight.x &&
      point.y > this.topLeft.y &&
      point.y < this.bottomRight.y
    );
  }

  collisionWithBB(other: BBCollision): boolean {
    return !(
      this.bottomRight.x < other.topLeft.x ||
      this.bottomRight.y < other.topLeft.y ||
      this.topLeft.x > other.bottomRight.x ||
      this.topLeft.y > other.bottomRight.y
    );
  }
}
