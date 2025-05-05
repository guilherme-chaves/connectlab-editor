import Collision from '@connectlab-editor/interfaces/collisionInterface';
import Vector2 from '@connectlab-editor/types/vector2';
import CircleCollision from '@connectlab-editor/collisionShapes/circleCollision';

interface BoxPoints {
  a: Vector2;
  b: Vector2;
}

export default class BoxCollision implements Collision {
  public position: Vector2;
  public readonly points: BoxPoints;
  public readonly globalPoints: BoxPoints;
  public readonly width: number;
  public readonly height: number;
  private drawPath: Path2D | undefined;
  private regenPath: boolean;
  public borderColor: string;

  constructor(
    position: Vector2,
    width = 2,
    height = 2,
    borderColor = '#FF8008DC'
  ) {
    this.position = position;
    this.width = width;
    this.height = height;
    this.borderColor = borderColor;
    this.points = this.setPoints();
    this.regenPath = false;
    this.globalPoints = {
      a: this.position,
      b: Vector2.add(this.position, this.points.b),
    };
  }

  private setGlobalPoints(): void {
    Vector2.add(this.position, this.points.b, this.globalPoints.b);
  }

  private setPoints(): BoxPoints {
    return {
      a: Vector2.ZERO,
      b: new Vector2(this.width, this.height),
    };
  }

  private generatePath(): Path2D {
    const path = new Path2D();
    path.rect(this.position.x, this.position.y, this.width, this.height);
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

  moveShape(v: Vector2, useDelta = true): void {
    if (useDelta) this.position.add(v);
    else Vector2.copy(v, this.position);
    this.setGlobalPoints();
    this.regenPath = true;
  }

  collisionWithPoint(point: Vector2): boolean {
    return (
      point.x > this.globalPoints.a.x &&
      point.x < this.globalPoints.b.x &&
      point.y > this.globalPoints.a.y &&
      point.y < this.globalPoints.b.y
    );
  }

  collisionWithBox(other: BoxCollision): boolean {
    return !(
      this.globalPoints.b.x < other.globalPoints.a.x ||
      this.globalPoints.b.y < other.globalPoints.a.y ||
      this.globalPoints.a.x > other.globalPoints.b.x ||
      this.globalPoints.a.y > other.globalPoints.b.y
    );
  }

  collisionWithCircle(other: CircleCollision): boolean {
    return other.collisionWithBox(this);
  }

  collisionWithLine(p1: Vector2, p2: Vector2): boolean {
    for (const boxBoundary of [
      [
        this.position.x,
        this.position.y,
        this.position.x,
        this.position.y + this.height,
      ],
      [
        this.position.x + this.width,
        this.position.y,
        this.position.x + this.width,
        this.position.y + this.height,
      ],
      [
        this.position.x,
        this.position.y,
        this.position.x + this.width,
        this.position.y,
      ],
      [
        this.position.x,
        this.position.y + this.height,
        this.position.x + this.width,
        this.position.y + this.height,
      ],
    ]) {
      const boxP1 = new Vector2(boxBoundary[0], boxBoundary[1]);
      const boxP2 = new Vector2(boxBoundary[2], boxBoundary[3]);
      const uA =
        ((boxP2.x - boxP1.x) * (p1.y - boxP1.y) -
          (boxP2.y - boxP1.y) * (p1.x - boxP1.x)) /
        ((boxP2.y - boxP1.y) * (p2.x - p1.x) -
          (boxP2.x - boxP1.x) * (p2.y - p1.y));
      const uB =
        ((p2.x - p1.x) * (p1.y - boxP1.y) - (p2.y - p1.y) * (p1.x - boxP1.x)) /
        ((boxP2.y - boxP1.y) * (p2.x - p1.x) -
          (boxP2.x - boxP1.x) * (p2.y - p1.y));

      return uA >= 0 && uA <= 1 && uB >= 0 && uB <= 1;
    }
    return false;
  }
}
