import Vector2 from '@connectlab-editor/types/vector2';
import {NodeModel, NodeTypes} from '@connectlab-editor/types/common';

export const SwitchInput: NodeModel = {
  id: NodeTypes.I_SWITCH,
  imgPath: [
    '/src/assets/gates/INPUT_OFF.svg',
    '/src/assets/gates/INPUT_ON.svg',
  ],
  connectionSlot: [
    {
      id: 0,
      in: false,
      name: 'A',
      localPos: new Vector2(70, 25),
    },
  ],
};
