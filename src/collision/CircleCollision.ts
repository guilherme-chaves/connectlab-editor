import Collision from '../interfaces/collisionInterface';
import Point2i from '../types/Point2i';
import Vector2i from '../types/Vector2i';
import BBCollision from './BBCollision';

export default class CircleCollision implements Collision {
  public position: Point2i;
  public readonly radius: number;
  private readonly radiusSquared: number;

  constructor(position: Point2i, radius: number) {
    this.position = position;
    this.radius = radius;
    this.radiusSquared = radius * radius;
  }

  collisionWithPoint(point: Point2i): boolean {
    return (
      Vector2i.magSq(Vector2i.sub(this.position, point)) < this.radiusSquared
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
      Vector2i.mag(Vector2i.sub(this.position, other.position)) <
      this.radius + other.radius
    );
  }
}
