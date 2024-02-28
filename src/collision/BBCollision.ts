import Collision from '../interfaces/collisionInterface';
import {Vector} from 'two.js/src/vector';
import CircleCollision from './CircleCollision';
import {Rectangle} from 'two.js/src/shapes/rectangle';
import Two from 'two.js';

interface BBPoints {
  a: Vector;
  b: Vector;
}

export default class BBCollision implements Collision {
  private _position: Vector;
  public readonly localPoints: BBPoints;
  public readonly width: number;
  public readonly height: number;
  public readonly drawShape: Rectangle | undefined;

  get position(): Vector {
    return this.drawShape?.position ?? this._position;
  }

  set position(value: Vector) {
    if (this.drawShape) this.drawShape.position.copy(value);
    else this._position.copy(value);
  }

  constructor(
    position: Vector,
    width = 2,
    height = 2,
    borderColor = '#FF8008DC',
    renderer: Two | undefined
  ) {
    if (renderer)
      this.drawShape = renderer.makeRectangle(
        position.x,
        position.y,
        width,
        height
      );
    if (this.drawShape) this.drawShape.stroke = borderColor;
    this._position = this.drawShape?.position ?? position;
    this.width = width;
    this.height = height;
    this.localPoints = this.setPoints();
  }

  get globalPoints(): BBPoints {
    return {
      a: this.position,
      b: Vector.add(this.position, this.localPoints.b),
    };
  }

  get displayShape(): boolean {
    if (this.drawShape === undefined) return false;
    return this.drawShape.visible;
  }

  set displayShape(value: boolean) {
    if (this.drawShape !== undefined) this.drawShape.visible = value;
  }

  private setPoints(): BBPoints {
    return {
      a: Vector.zero,
      b: new Vector(this.width, this.height),
    };
  }

  moveShape(v: Vector, useDelta = true): void {
    if (useDelta) this.position = this.position.addSelf(v);
    else this.position.copy(v);
  }

  collisionWithPoint(x: number, y: number): boolean {
    return (
      x > this.globalPoints.a.x &&
      x < this.globalPoints.b.x &&
      y > this.globalPoints.a.y &&
      y < this.globalPoints.b.y
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
