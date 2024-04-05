import {NodeTypeObject, slotStates} from '../types/types';
import Component from './componentInterface';

export default interface Node extends Component {
  slotIds: Array<number>;
  readonly nodeType: NodeTypeObject;
  image: ImageBitmap | undefined;
  state: slotStates;
}
