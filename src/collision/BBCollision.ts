import Collision from '../interfaces/collisionInterface';
import Vector2 from '../types/Vector2';
import CircleCollision from './CircleCollision';

interface BBPoints {
  a: Vector2;
  b: Vector2;
}

export default class BBCollision implements Collision {
  private _position: Vector2;
  private _points: BBPoints;
  public readonly width: number;
  public readonly height: number;
  private drawPath: Path2D;
  private _borderColor: string;

  get position(): Vector2 {
    return this._position;
  }

  set position(value: Vector2) {
    this._position = value;
  }

  get localPoints(): BBPoints {
    return this._points;
  }

  get borderColor() {
    return this._borderColor;
  }

  set borderColor(value: string) {
    this._borderColor = value;
  }

  constructor(
    position: Vector2,
    width = 2,
    height = 2,
    borderColor = '#FF8008DC'
  ) {
    this._position = position;
    this.width = width;
    this.height = height;
    this._borderColor = borderColor;
    this._points = this.setPoints();
    this.drawPath = this.generatePath();
  }

  get globalPoints(): BBPoints {
    return {
      a: this._position,
      b: this._position.add(this._points.b),
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
    path.rect(this._position.x, this._position.y, this.width, this.height);
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
