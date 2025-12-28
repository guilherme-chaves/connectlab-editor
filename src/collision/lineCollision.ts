import Collision from '@connectlab-editor/interfaces/collisionInterface';
import Vector2i from '@connectlab-editor/types/vector2i';
import BoxCollision from './boxCollision';
import CircleCollision from './circleCollision';

export default class LineCollision implements Collision {
  position: Vector2i;
  endPosition: Vector2i;
  borderColor: string;
  private drawPath: Path2D | null;
  private regenPath: boolean;
  public line: Vector2i;
  public lineLenSquared: number;

  constructor(
    position: Vector2i,
    endPosition: Vector2i,
    borderColor: string = '#FF8008DC',
    render: boolean = true,
  ) {
    this.position = position;
    this.endPosition = endPosition;
    this.line = new Vector2i();
    this.lineLenSquared = 0;
    this.borderColor = borderColor;
    this.regenPath = true;
    this.drawPath = render ? this.generatePath() : null;
    this.computeLine();
  }

  protected generatePath(): Path2D {
    const path = new Path2D();
    path.moveTo(this.position._x, this.position._y);
    path.lineTo(this.endPosition._x, this.endPosition._y);
    this.regenPath = false;
    return path;
  }

  private computeLine(): void {
    this.line.x = this.endPosition._x - this.position._x;
    this.line.y = this.endPosition._y - this.position._y;
    this.lineLenSquared = Vector2i.lenSquared(this.line);
  }

  draw(ctx: CanvasRenderingContext2D, isSelected: boolean): void {
    if (!isSelected) return;
    if (!this.drawPath || this.regenPath) this.drawPath = this.generatePath();
    ctx.save();
    ctx.strokeStyle = this.borderColor;
    ctx.stroke(this.drawPath);
    ctx.restore();
  }

  moveShape(v: Vector2i, isDeltaVector: boolean): void {
    if (isDeltaVector) {
      Vector2i.add(this.position, v, this.position);
      Vector2i.add(this.endPosition, v, this.endPosition);
    }
    else {
      const delta = Vector2i.sub(v, this.position);
      Vector2i.copy(v, this.position);
      Vector2i.add(this.endPosition, delta, this.endPosition);
    }
    this.computeLine();
  }

  collisionWithPoint(point: Vector2i): boolean {
    // https://www.jeffreythompson.org/collision-detection/line-point.php
    const d1 = Math.pow(this.position._x - point._x, 2)
      + Math.pow(this.position._y - point._y, 2);
    const d2 = Math.pow(this.endPosition._x - point._x, 2)
      + Math.pow(this.endPosition._y - point._y, 2);
    return d1 + d2 - this.lineLenSquared < 1e-4;
  }

  collisionWithBox(other: BoxCollision): boolean {
    return other.collisionWithLine(this);
  }

  collisionWithCircle(other: CircleCollision): boolean {
    // https://www.jeffreythompson.org/collision-detection/line-circle.php
    if (
      other.collisionWithPoint(this.position)
      || other.collisionWithPoint(this.endPosition)
    )
      return true;

    const dot
      = ((other.position._x - this.position._x)
        * this.line._x
        + (other.position._y - this.position._y)
        * this.line._y)
      / this.lineLenSquared;

    const closest = new Vector2i(
      this.position._x + dot * (this.endPosition._x - this.position._x),
      this.position._y + dot * (this.endPosition._y - this.position._y),
    );

    if (!this.collisionWithPoint(closest)) return false;

    const distToClosest = Vector2i.lenSquared(
      Vector2i.sub(closest, other.position),
    );

    return distToClosest < other.radiusSquared;
  }

  collisionWithLine(other: LineCollision): boolean {
    return this.hasLineSATCollision(
      this.position,
      this.endPosition,
      other.position,
      other.endPosition,
      this.line,
    ) && (
      this.hasLineCollision(
        this.position,
        this.endPosition,
        other.position,
        other.endPosition,
      ) && this.hasLineCollision(
        other.position,
        other.endPosition,
        this.position,
        this.endPosition,
      )
    );
  }

  private hasLineSATCollision(
    a: Vector2i, b: Vector2i, c: Vector2i, d: Vector2i, ab: Vector2i,
  ) {
    let i = 0, j = 0, k = 0, l = 0;
    if (ab._x === 0) {
      i = a._y;
      j = b._y;
      k = c._y;
      l = d._y;
    }
    else {
      i = a._x;
      j = b._x;
      k = c._x;
      l = d._x;
    }
    if (i < j)
      if (k < l) return i <= l && k <= j;
      else return i <= k && l <= j;
    else
      if (k < l) return j <= l && k <= i;
      else return j <= k && l <= i;
  }

  private hasLineCollision(
    a: Vector2i, b: Vector2i, c: Vector2i, d: Vector2i,
  ): boolean {
    const dc = [d._x - c._x, d._y - c._y];
    const ba = [b._x - a._x, b._y - a._y];
    const ac = [a._x - c._x, a._y - c._y];
    const t = dc[1] * ac[0] - dc[0] * ac[1];
    const u = dc[0] * ba[1] - dc[1] * ba[0];
    if (u !== 0) {
      const v = t / u;
      return v >= 0 && v <= 1;
    }
    const dcs = dc[0] !== 0 ? dc[1] / dc[0] : 0;
    const bas = ba[0] !== 0 ? ba[1] / ba[0] : 0;
    return Math.abs(dcs - bas) < 1e-8;
  }
}
