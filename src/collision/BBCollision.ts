import Collision from '../interfaces/collisionInterface';
import Vector2 from '../types/Vector2';
import CircleCollision from './CircleCollision';

interface BBPoints {
  a: Vector2;
  b: Vector2;
}

export default class BBCollision implements Collision {
  public position: Vector2;
  public readonly points: BBPoints;
  public readonly width: number;
  public readonly height: number;
  private drawPath: Path2D;
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
    this.drawPath = this.generatePath();
  }

  get globalPoints(): BBPoints {
    return {
      a: this.position,
      b: this.position.add(this.points.b),
    };
  }

  private setPoints(): BBPoints {
    return {
      a: Vector2.ZERO,
      b: new Vector2(this.width, this.height),
    };
  }

  private generatePath(): Path2D {
    const path = new Path2D();
    path.rect(this.position.x, this.position.y, this.width, this.height);
    return path;
  }

  draw(ctx: CanvasRenderingContext2D, selected: boolean) {
    if (!selected) return;
    const oldStrokeStyle = ctx.strokeStyle;
    ctx.strokeStyle = this.borderColor;
    ctx.stroke(this.drawPath);
    ctx.strokeStyle = oldStrokeStyle;
  }

  moveShape(v: Vector2, useDelta = true): void {
    if (useDelta) this.position = this.position.add(v);
    else this.position = v;
    this.drawPath = this.generatePath();
  }

  collisionWithPoint(point: Vector2): boolean {
    return (
      point.x > this.globalPoints.a.x &&
      point.x < this.globalPoints.b.x &&
      point.y > this.globalPoints.a.y &&
      point.y < this.globalPoints.b.y
    );
  }

  collisionWithAABB(other: BBCollision): boolean {
    return !(
      this.globalPoints.b.x < other.globalPoints.a.x ||
      this.globalPoints.b.y < other.globalPoints.a.y ||
      this.globalPoints.a.x > other.globalPoints.b.x ||
      this.globalPoints.a.y > other.globalPoints.b.y
    );
  }

  collisionWithCircle(other: CircleCollision): boolean {
    return other.collisionWithAABB(this);
  }
}
