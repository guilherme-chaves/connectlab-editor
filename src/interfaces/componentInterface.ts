import {Shape} from 'two.js/src/shape';
import {Vector} from 'two.js/src/vector';
import ComponentType from '../types/types';
import Collision from './collisionInterface';

export default interface Component {
  readonly id: number;
  position: Vector;
  readonly componentType: ComponentType;
  drawShape: Shape | undefined;
  collisionShape: Collision | Array<Collision>;
  selected: boolean;
  move(v: Vector, useDelta: boolean): void;
  destroy(): void;
}
