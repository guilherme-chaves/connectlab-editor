import Vector2 from '@connectlab-editor/types/vector2';
import {NodeModel} from '@connectlab-editor/types/common';
import INPUT_OFF from '@connectlab-editor/gates/INPUT_OFF.svg';
import INPUT_ON from '@connectlab-editor/gates/INPUT_ON.svg';
import {NodeTypes} from '@connectlab-editor/types/enums';

export const SwitchInput: NodeModel = {
  id: NodeTypes.I_SWITCH,
  imgPath: [INPUT_OFF, INPUT_ON],
  connectionSlot: [
    {
      id: 0,
      in: false,
      name: 'A',
      localPos: new Vector2(70, 25),
    },
  ],
};
