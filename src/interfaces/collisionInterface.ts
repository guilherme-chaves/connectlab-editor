import BBCollision from '../collision/BBCollision';
import CircleCollision from '../collision/CircleCollision';
import Point2i from '../types/Point2i';

export default interface Collision {
  position: Point2i;
  collisionWithPoint(point: Point2i): boolean;
  collisionWithAABB(other: BBCollision): boolean;
  collisionWithCircle(other: CircleCollision): boolean;
}
