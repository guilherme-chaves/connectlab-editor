import Collision from '../interfaces/collisionInterface';
import {Vector} from 'two.js/src/vector';
import BBCollision from './BBCollision';
import Two from 'two.js';
import {Circle} from 'two.js/src/shapes/circle';

export default class CircleCollision implements Collision {
  public position: Vector;
  public readonly radius: number;
  private readonly radiusSquared: number;
  public drawShape: Circle | undefined;

  constructor(
    position: Vector,
    radius: number,
    borderColor = '#FF8008DC',
    renderer: Two | undefined
  ) {
    if (renderer) {
      this.drawShape = renderer.makeCircle(position.x, position.y, radius);
      this.drawShape.stroke = borderColor;
    }
    this.position = this.drawShape?.position ?? position;
    this.radius = radius;
    this.radiusSquared = radius * radius;
  }

  moveShape(v: Vector, useDelta = true): void {
    if (useDelta) this.position = this.position.add(v);
    else this.position.copy(v);
  }

  collisionWithPoint(x: number, y: number): boolean {
    return (
      Vector.sub(this.position, new Vector(x, y)).lengthSquared() <
      this.radiusSquared
    );
  }

  collisionWithAABB(other: BBCollision): boolean {
    let distance = 0;
    if (this.position.x < other.globalPoints.b.x)
      distance += Math.pow(other.globalPoints.b.x - this.position.x, 2);
    else if (this.position.x > other.globalPoints.a.x)
      distance += Math.pow(this.position.x - other.globalPoints.a.x, 2);

    if (this.position.y < other.globalPoints.b.y)
      distance += Math.pow(other.globalPoints.b.y - this.position.y, 2);
    else if (this.position.y > other.globalPoints.a.y)
      distance += Math.pow(this.position.y - other.globalPoints.a.y, 2);

    return distance < this.radiusSquared;
  }

  collisionWithCircle(other: CircleCollision): boolean {
    return (
      Vector.sub(this.position, other.position).length() <
      this.radius + other.radius
    );
  }
}
