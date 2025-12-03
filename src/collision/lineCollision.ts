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
  private lineLength: number;

  constructor(
    position: Vector2i,
    endPosition: Vector2i,
    borderColor: string = '#FF8008DC',
    render: boolean = true,
  ) {
    this.position = position;
    this.endPosition = endPosition;
    this.lineLength = this.computeLineLength();
    this.borderColor = borderColor;
    this.regenPath = true;
    this.drawPath = render ? this.generatePath() : null;
  }

  protected generatePath(): Path2D {
    const path = new Path2D();
    path.moveTo(this.position.x, this.position.y);
    path.lineTo(this.endPosition.x, this.endPosition.y);
    this.regenPath = false;
    return path;
  }

  private computeLineLength(): number {
    return Vector2i.sub(this.endPosition, this.position).len();
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
      this.position.add(v);
      this.endPosition.add(v);
    }
    else {
      this.position.add(Vector2i.sub(this.position, v));
      this.endPosition.add(Vector2i.sub(this.position, v));
    }
  }

  collisionWithPoint(point: Vector2i): boolean {
    // https://www.jeffreythompson.org/collision-detection/line-point.php
    const d1 = Vector2i.sub(this.position, point).len();
    const d2 = Vector2i.sub(this.endPosition, point).len();
    return d1 + d2 - this.lineLength < 1e-4;
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
      = ((other.position.x - this.position.x)
        * (this.endPosition.x - this.position.x)
        + (other.position.y - this.position.y)
        * (this.endPosition.y - this.position.y))
      / Math.pow(this.lineLength, 2);

    const closest = new Vector2i(
      this.position.x + dot * (this.endPosition.x - this.position.x),
      this.position.y + dot * (this.endPosition.y - this.position.y),
    );

    if (!this.collisionWithPoint(closest)) return false;

    const distToClosest = Vector2i.sub(closest, other.position).len();

    return distToClosest < other.radius;
  }

  collisionWithLine(other: LineCollision): boolean {
    const denominator
      = (this.position.x - this.endPosition.x)
        * (other.position.y - other.endPosition.y)
        - (this.position.y - this.endPosition.y)
        * (other.position.x - other.endPosition.x);

    // Denominador === 0 => Linhas paralelas ou colineares
    if (denominator === 0) {
      // https://blogs.sas.com/content/iml/2018/07/09/intersection-line-segments.html
      if (
        this.collisionWithPoint(other.position)
        || this.collisionWithPoint(other.endPosition)
        || other.collisionWithPoint(this.position)
      )
        return true;
      return false;
    }

    const numeratorA
      = (this.position.x - other.position.x)
        * (other.position.y - other.endPosition.y)
        - (this.position.y - other.position.y)
        * (other.position.x - other.endPosition.x);
    const numeratorB
      = (this.position.x - this.endPosition.x)
        * (this.position.y - other.position.y)
        - (this.position.y - this.endPosition.y)
        * (this.position.x - other.position.x);

    const a = numeratorA / denominator;
    const b = -(numeratorB / denominator);

    return a >= 0 && a <= 1 && b >= 0 && b <= 1;
  }
}
