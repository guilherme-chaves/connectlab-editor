import {NodeModel, slotStates} from '@connectlab-editor/types/common';
import Component from '@connectlab-editor/interfaces/componentInterface';
import SlotComponent from '@connectlab-editor/components/slotComponent';

export default interface Node extends Component {
  slots: Array<SlotComponent>;
  readonly nodeType: NodeModel;
  image: ImageBitmap | null;
  state: slotStates;
}
