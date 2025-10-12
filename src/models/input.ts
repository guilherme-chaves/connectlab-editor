import Vector2i from '@connectlab-editor/types/vector2i';
import { NodeModel } from '@connectlab-editor/types/common';
import INPUT_OFF from '@connectlab-editor/gates/INPUT_OFF.svg';
import INPUT_ON from '@connectlab-editor/gates/INPUT_ON.svg';
import BUTTON_OFF from '@connectlab-editor/assets/gates/BUTTON_OFF.svg';
import BUTTON_ON from '@connectlab-editor/assets/gates/BUTTON_ON.svg';
import CLOCK from '@connectlab-editor/assets/gates/CLOCK.svg';
import { NodeTypes } from '@connectlab-editor/types/enums';

export const SwitchInput: NodeModel = {
  id: NodeTypes.I_SWITCH,
  imgPath: [INPUT_OFF, INPUT_ON],
  connectionSlot: [
    {
      id: 0,
      in: false,
      name: 'Out',
      localPos: new Vector2i(74, 25),
    },
  ],
};

export const ButtonInput: NodeModel = {
  id: NodeTypes.I_BUTTON,
  imgPath: [BUTTON_OFF, BUTTON_ON],
  connectionSlot: [
    {
      id: 0,
      in: false,
      name: 'Out',
      localPos: new Vector2i(74, 25),
    },
  ],
};

export const ClockInput: NodeModel = {
  id: NodeTypes.I_CLOCK,
  imgPath: [CLOCK],
  connectionSlot: [
    {
      id: 0,
      in: false,
      name: 'Out',
      localPos: new Vector2i(64, 25),
    },
  ],
};
