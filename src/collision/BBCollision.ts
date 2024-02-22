import Collision from '../interfaces/collisionInterface';
import {CollisionShape} from '../interfaces/renderObjects';
import Renderer from '../interfaces/renderer';
import Point2i from '../types/Point2i';
import Vector2i from '../types/Vector2i';
import CircleCollision from './CircleCollision';

export default class BBCollision implements Collision {
  public position: Point2i;
  public readonly size: Point2i;
  public drawShape?: CollisionShape | undefined;

  get globalPoints(): {a: Point2i; b: Point2i} {
    return {
      a: this.position,
      b: Vector2i.add(this.position, this.size),
    };
  }

  constructor(
    componentId: number,
    position: Point2i,
    width = 2,
    height = 2,
    renderer?: Renderer
  ) {
    this.position = position;
    this.size = new Point2i(width, height);
    this.drawShape = renderer?.makeRectCollision(
      componentId,
      this.position,
      this.size
    );
  }

  collisionWithPoint(point: Point2i): boolean {
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
