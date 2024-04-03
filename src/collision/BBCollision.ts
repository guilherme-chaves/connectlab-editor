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
  public readonly globalPoints: BBPoints;
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

  private setPoints(): BBPoints {
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

  draw(ctx: CanvasRenderingContext2D, selected: boolean) {
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
