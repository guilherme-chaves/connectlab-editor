import Point2i from '../types/Point2i';
import ComponentType from '../types/types';
import Collision from './collisionInterface';
import RenderObject, {Line} from './renderObjects';

export default interface Component {
  readonly id: number;
  position: Point2i;
  readonly componentType: ComponentType;
  collisionShape: Collision | Array<Collision>;
  drawShape?: RenderObject | Line;
}
