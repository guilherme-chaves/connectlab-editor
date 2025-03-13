import {
  NodeModel,
  slotStates,
  VectorObject,
} from '@connectlab-editor/types/common';
import Component, {
  ComponentObject,
} from '@connectlab-editor/interfaces/componentInterface';
import SlotComponent from '@connectlab-editor/components/slotComponent';
import {ComponentType, NodeTypes} from '@connectlab-editor/types/enums';

export default interface Node extends Component {
  slots: Array<SlotComponent>;
  readonly nodeType: NodeModel;
  image: ImageBitmap | null;
  state: slotStates;
}

export interface NodeObject extends ComponentObject {
  id: number;
  componentType: ComponentType;
  nodeType: NodeTypes;
  position: VectorObject;
  slotIds: number[];
  state: boolean;
}
