import Point2i from '../types/Point2i';
import ComponentType from '../types/types';
import Collision from './collisionInterface';

export default interface Component {
  readonly id: number;
  position: Point2i;
  readonly componentType: ComponentType;
  collisionShape: Collision | Array<Collision>;
}
