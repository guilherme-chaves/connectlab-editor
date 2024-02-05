import SlotComponent from '../components/SlotComponent';
import {
  InputTypeObject,
  NodeTypeObject,
  OutputTypeObject,
} from '../types/types';
import Component from './componentInterface';

export default interface Node extends Component {
  slotComponents: Array<SlotComponent>;
  readonly nodeType: NodeTypeObject | InputTypeObject | OutputTypeObject;
}
