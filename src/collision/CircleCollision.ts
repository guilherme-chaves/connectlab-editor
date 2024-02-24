import Collision from '../interfaces/collisionInterface';
import {CircleCollision as CircleCollisionShape} from '../interfaces/renderObjects';
import Renderer from '../interfaces/renderer';
import Point2i from '../types/Point2i';
import Vector2i from '../types/Vector2i';
import BBCollision from './BBCollision';

export default class CircleCollision implements Collision {
  public position: Point2i;
  private parentPosition: Point2i;
  public readonly radius: number;
  private readonly radiusSquared: number;
  public drawShape?: CircleCollisionShape | undefined;

  get globalPosition(): Point2i {
    return Vector2i.add(this.parentPosition, this.position);
  }

  constructor(
    componentId: number,
    localPosition: Point2i,
    parentPosition: Point2i,
    radius: number,
    borderColor?: string,
    renderer?: Renderer
  ) {
    this.position = localPosition;
    this.parentPosition = parentPosition;
    this.radius = radius;
    this.radiusSquared = radius * radius;
    this.drawShape = renderer?.makeCircleCollision(
      componentId,
      this.parentPosition,
      this.position,
      this.radius,
      borderColor
    );
  }

  collisionWithPoint(point: Point2i): boolean {
    return (
      Vector2i.magSq(Vector2i.sub(this.globalPosition, point)) <
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
      Vector2i.mag(Vector2i.sub(this.globalPosition, other.globalPosition)) <
      this.radius + other.radius
    );
  }
}
