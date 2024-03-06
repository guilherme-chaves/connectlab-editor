import SlotComponent from '../components/SlotComponent';
import {NodeTypeObject} from '../types/types';
import Component from './componentInterface';

export default interface Node extends Component {
  slotComponents: Array<SlotComponent>;
  readonly nodeType: NodeTypeObject;
  image: ImageBitmap | undefined;
  state: boolean;
}
