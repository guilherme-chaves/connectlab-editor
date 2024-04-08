import {NodeTypeObject, slotStates} from '@connectlab-editor/types';
import Component from '@connectlab-editor/interfaces/componentInterface';

export default interface Node extends Component {
  slotIds: Array<number>;
  readonly nodeType: NodeTypeObject;
  image: ImageBitmap | undefined;
  state: slotStates;
}
