import {Shape} from 'two.js/src/shape';
import BBCollision from '../collision/BBCollision';
import CircleCollision from '../collision/CircleCollision';
import {Vector} from 'two.js/src/vector';

export default interface Collision {
  position: Vector;
  drawShape: Shape | undefined;
  moveShape(v: Vector, isDeltaVector: boolean): void;
  collisionWithPoint(x: number, y: number): boolean;
  collisionWithAABB(other: BBCollision): boolean;
  collisionWithCircle(other: CircleCollision): boolean;
}
