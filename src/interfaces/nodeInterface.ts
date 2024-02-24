import SlotComponent from '../components/SlotComponent';
import {
  InputTypeObject,
  NodeTypeObject,
  OutputTypeObject,
} from '../types/types';
import Component from './componentInterface';
import {Sprite} from './renderObjects';

export default interface Node extends Component {
  drawShape?: Sprite;
  slotComponents: Array<SlotComponent>;
  readonly nodeType: NodeTypeObject | InputTypeObject | OutputTypeObject;
}
