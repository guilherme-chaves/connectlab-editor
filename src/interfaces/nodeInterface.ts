import {NodeTypeObject, slotStates} from '@connectlab-editor/types';
import Component from '@connectlab-editor/interfaces/componentInterface';
import SlotComponent from '@connectlab-editor/components/SlotComponent';

export default interface Node extends Component {
  slots: Array<SlotComponent>;
  readonly nodeType: NodeTypeObject;
  image: ImageBitmap | null;
  state: slotStates;
}
